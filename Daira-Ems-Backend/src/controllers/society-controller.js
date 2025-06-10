import jwt from 'jsonwebtoken';
import User from '../modals/user-model.js';
import Ambassador from '../modals/ambassador-model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Society from '../modals/society-modal.js';
import Event from '../modals/Event-Model.js';
import Participant from '../modals/participant-model.js';
import Registration from '../modals/registeration-model.js';
import Team from '../modals/team-model.js';
import axios from 'axios';
import ParticipantsDetails from '../modals/participant-details-model.js';
import mongoose from 'mongoose';
import json2csv from 'json2csv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const login = async (req, res) => {
  const { username, password, recaptchaToken } = req.body;
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }
  try {
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ message: 'Invalid reCAPTCHA. Please try again.' });
    }

    const president = await Society.findOne({ userName: username });
    if (!president) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await bcrypt.compare(password, president.password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        username: president.userName,
        id: president._id,
        society: president.society,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ result: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = async (req, res) => {
  const token = req.headers.authorization;
  const decodedData = jwt.verify(token, JWT_SECRET);
  try {
    const existingUser = await Society.findOne({
      userName: decodedData.username,
    });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ result: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getRegistrationsBySociety = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const societyName = decodedData.society;

    // Fetch only events for this society
    const allEvents = await Event.find({ societyName: societyName });

    // Fetch all teams and categorize by eventId
    const allTeams = await Team.find({});
    const teamsByEventId = allTeams.reduce((acc, team) => {
      (acc[team.eventId] = acc[team.eventId] || []).push(team);
      return acc;
    }, {});

    // Fetch only approved registrations
    const approvedRegistrations = await Registration.find({ approved: true });
    const registrationsByTeamId = approvedRegistrations.reduce(
      (acc, registration) => {
        (acc[registration.teamId] = acc[registration.teamId] || []).push(
          registration
        );
        return acc;
      },
      {}
    );

    // Prepare to collect registration statistics
    const registrationStats = {};

    // Process each event
    for (const event of allEvents) {
      const teams = (teamsByEventId[event._id.toString()] || []).filter(
        (team) => registrationsByTeamId[team._id.toString()] // Only include teams with approved registrations
      );
      const eventKey = `${event.societyName} - ${event.eventName}`;

      // Initialize data structures for each society
      if (!registrationStats[event.societyName]) {
        registrationStats[event.societyName] = {
          totalSocietyRegistrations: 0,
          totalSocietyParticipants: 0,
          totalSocietyTeams: 0,
          events: {},
        };
      }

      // Initialize data structures for each event within a society
      if (!registrationStats[event.societyName].events[event.eventName]) {
        registrationStats[event.societyName].events[event.eventName] = {
          totalRegistrations: 0,
          totalParticipants: 0,
          totalTeams: 0,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
        };
      }

      // Update the counts for this event
      registrationStats[event.societyName].events[event.eventName].totalTeams +=
        teams.length;

      // Process each team under the current event
      for (const team of teams) {
        const registrations = registrationsByTeamId[team._id.toString()] || [];
        const numRegistrations = registrations.length;
        const participantIds = new Set(team.participants || []);
        const numParticipants = participantIds.size;

        // Update event-specific and society-wide counts
        registrationStats[event.societyName].events[
          event.eventName
        ].totalRegistrations += numRegistrations;
        registrationStats[event.societyName].events[
          event.eventName
        ].totalParticipants += numParticipants;
        registrationStats[event.societyName].totalSocietyRegistrations +=
          numRegistrations;
        registrationStats[event.societyName].totalSocietyParticipants +=
          numParticipants;
      }

      // Accumulate total teams at the society level
      registrationStats[event.societyName].totalSocietyTeams += teams.length;
    }

    // Format data for response
    const formattedStats = Object.keys(registrationStats).map((society) => ({
      society: society,
      totalRegistrations: registrationStats[society].totalSocietyRegistrations,
      totalParticipants: registrationStats[society].totalSocietyParticipants,
      totalTeams: registrationStats[society].totalSocietyTeams,
      events: Object.keys(registrationStats[society].events).map(
        (eventName) => ({
          eventName: eventName,
          eventType: registrationStats[society].events[eventName].eventType,
          eventCategory:
            registrationStats[society].events[eventName].eventCategory,
          ...registrationStats[society].events[eventName],
        })
      ),
    }));

    res.json(formattedStats);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch data', error: error.message });
  }
};

const getParticipantsEventWise = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const societyName = decodedData.society;

    // Fetch only events for this society
    const events = await Event.find(
      { societyName: societyName },
      '_id eventName eventType eventCategory'
    );

    let eventWiseParticipants = await Promise.all(
      events.map(async (event) => {
        // Fetch approved registrations for the event
        const approvedRegistrations = await Registration.find(
          { approved: true },
          'teamId'
        );

        // Extract team IDs from approved registrations
        const approvedTeamIds = approvedRegistrations.map((reg) => reg.teamId);

        // Fetch teams for the event that are approved
        const teams = await Team.find({
          eventId: event._id,
          _id: { $in: approvedTeamIds },
        });

        // For each team, fetch participants' details using the array of participant IDs
        const teamsWithParticipants = await Promise.all(
          teams.map(async (team) => {
            // Fetch participants details for the current team
            const participants = await Participant.find(
              {
                _id: { $in: team.participants },
              },
              'name contactNumber -_id'
            );

            return {
              teamName: team.name,
              participants: participants.map((participant) => ({
                participantId: participant._id,
                name: participant.name,
                contactNumber: participant.contactNumber,
              })),
            };
          })
        );

        return {
          eventId: event._id,
          eventName: event.eventName,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
          teams: teamsWithParticipants,
        };
      })
    );

    res.json(eventWiseParticipants);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch participants event-wise',
      error: error.message,
    });
  }
};

// get unregistered participants details
const getUnRegisteredParticipants = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const societyName = decodedData.society;

    // Fetch only events for this society
    const events = await Event.find(
      { societyName: societyName },
      '_id eventName eventType eventCategory'
    );

    let eventWiseParticipants = await Promise.all(
      events.map(async (event) => {
        // Fetch approved registrations for the event
        const approvedRegistrations = await Registration.find(
          { approved: false },
          'teamId'
        );

        // Extract team IDs from approved registrations
        const approvedTeamIds = approvedRegistrations.map((reg) => reg.teamId);

        // Fetch teams for the event that are approved
        const teams = await Team.find({
          eventId: event._id,
          _id: { $in: approvedTeamIds },
        });

        // For each team, fetch participants' details using the array of participant IDs
        const teamsWithParticipants = await Promise.all(
          teams.map(async (team) => {
            // Fetch participants details for the current team
            const participants = await Participant.find(
              {
                _id: { $in: team.participants },
              },
              'name contactNumber -_id'
            );

            return {
              teamName: team.name,
              participants: participants.map((participant) => ({
                participantId: participant._id,
                name: participant.name,
                contactNumber: participant.contactNumber,
              })),
            };
          })
        );

        return {
          eventId: event._id,
          eventName: event.eventName,
          eventType: event.eventType,
          eventCategory: event.eventCategory,
          teams: teamsWithParticipants,
        };
      })
    );

    res.json(eventWiseParticipants);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch participants event-wise',
      error: error.message,
    });
  }
};

const getAccomodationCount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const societyName = decodedData.society;

    // Get all events for this society
    const societyEvents = await Event.find({ societyName: societyName });
    const eventIds = societyEvents.map((event) => event._id);

    // Get all teams for these events
    const teams = await Team.find({ eventId: { $in: eventIds } });
    const teamIds = teams.map((team) => team._id);

    // Get approved registrations for these teams
    const approvedRegistrations = await Registration.find({
      teamId: { $in: teamIds },
      approved: true,
    });
    const approvedTeamIds = approvedRegistrations.map((reg) => reg.teamId);

    // Get participants with accommodation status true and are part of approved teams
    const participants = await Participant.find({
      accommodation_status: true,
      team: { $in: approvedTeamIds },
    })
      .select('name gender contactNumber society team')
      .sort({ gender: 1, name: 1 });

    // Calculate counts and analysis
    const analysis = {
      total: participants.length,
      genderBreakdown: participants.reduce((acc, curr) => {
        acc[curr.gender] = (acc[curr.gender] || 0) + 1;
        return acc;
      }, {}),
      societyBreakdown: participants.reduce((acc, curr) => {
        acc[curr.society] = (acc[curr.society] || 0) + 1;
        return acc;
      }, {}),
    };

    // Format participant details with event information
    const participantDetails = await Promise.all(
      participants.map(async (p) => {
        const participantTeams = await Team.find({
          _id: { $in: p.team },
          _id: { $in: approvedTeamIds },
        });

        const events = await Promise.all(
          participantTeams.map(async (team) => {
            const event = await Event.findById(team.eventId);
            return event ? event.eventName : null;
          })
        );

        return {
          name: p.name,
          gender: p.gender,
          contactNumber: p.contactNumber,
          society: societyEvents.societyName,
          events: events.filter((event) => event !== null),
        };
      })
    );

    // Calculate percentages for analysis
    const genderPercentages = {};
    for (const [gender, count] of Object.entries(analysis.genderBreakdown)) {
      genderPercentages[gender] =
        ((count / analysis.total) * 100).toFixed(1) + '%';
    }

    const societyPercentages = {};
    for (const [society, count] of Object.entries(analysis.societyBreakdown)) {
      societyPercentages[society] =
        ((count / analysis.total) * 100).toFixed(1) + '%';
    }

    // Send the comprehensive response
    res.status(200).json({
      success: true,
      data: {
        analysis: {
          totalAccommodations: analysis.total,
          genderDistribution: {
            counts: analysis.genderBreakdown,
            percentages: genderPercentages,
          },
          societyDistribution: {
            counts: analysis.societyBreakdown,
            percentages: societyPercentages,
          },
        },
        participants: participantDetails,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

async function convertJsonToCsv(jsonData) {
  const fields = [
    'name',
    'eventName',
    'contact',
    'ambassadorContact',
    'institute',
  ];
  const opts = { fields };
  try {
    const csv = json2csv.parse(jsonData, opts);
    return csv;
  } catch (error) {
    console.error('Error converting JSON to CSV:', error);
    return null;
  }
}

const getParticipantsDetails = async (req, res) => {
  try {
    const details = await ParticipantsDetails.find({})
      .select('name eventName contact ambassadorContact institute')
      .sort({ eventName: 1 });

    const csvString = await convertJsonToCsv(details);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=participants.csv'
    );
    res.status(200).send(csvString);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const updateParticipantDetails = async () => {
  console.log('Updating Details Table');
  const approvedRegistrations = await Registration.find({
    approved: true,
  }).select('teamId');
  const teamIds = [
    ...new Set(
      approvedRegistrations.map(
        (reg) => new mongoose.Types.ObjectId(reg.teamId.toString())
      )
    ),
  ];

  const teams = await Team.find({ _id: { $in: teamIds } }).select(
    'eventId participants'
  );
  const dataArray = [];

  const eventPromises = teams.map((team) =>
    Event.findById(team.eventId).select('eventName')
  );
  const events = await Promise.all(eventPromises);
  teams.forEach((team, index) => {
    const event = events[index];
    if (event) {
      dataArray.push({
        eventName: event.eventName,
        participants: team.participants,
      });
    }
  });
  const participantPromises = [];
  dataArray.forEach((eventItem) => {
    eventItem.participants.forEach((participantId) => {
      participantPromises.push(
        Participant.findById(participantId).then(async (participant) => {
          const { contactNumber, name, userId, _id } = participant;
          let user;
          user = await User.findById(userId).select('contact');
          if (!user) {
            user = await Ambassador.findById(participant.userId).select(
              'contact institute'
            );
          }
          return {
            participantId: _id.toString(),
            name: name,
            eventName: eventItem.eventName,
            contact: contactNumber,
            ambassadorContact: user ? user.contact : '',
            institute: user.institute ? user.institute : 'Private',
          };
        })
      );
    });
  });

  const participantData = await Promise.all(participantPromises);

  const updateOperations = participantData.map((participant) => ({
    updateOne: {
      filter: { participantId: participant.participantId },
      update: participant,
      upsert: true,
    },
  }));

  try {
    await ParticipantsDetails.bulkWrite(updateOperations);
  } catch (error) {
    console.error('Error updating participant details:', error);
  }
};

export {
  login,
  getRegistrationsBySociety,
  getParticipantsEventWise,
  verifyToken,
  getAccomodationCount,
  updateParticipantDetails,
  getParticipantsDetails,
  getUnRegisteredParticipants,
};
