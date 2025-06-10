import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import Ambassador from '../modals/ambassador-model.js';
import User from '../modals/user-model.js';
import Events from '../modals/Event-Model.js';
import Participant from '../modals/participant-model.js';
import Team from '../modals/team-model.js';
import Registration from '../modals/registeration-model.js';
import archievedModel from '../modals/archieved-model.js';
dotenv.config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const getCategoies = async (req, res) => {
  try {
    const categories = await Events.find().distinct('eventCategory');
    return res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching categories.',
      error: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Events.find({ status: 'active' });
    return res.status(200).json({
      events: events,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching events.',
      error: error.message,
    });
  }
};

const getEventsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const events = await Events.find({
      eventCategory: category,
      status: 'active',
    });
    return res.status(200).json({
      events: events,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching events.',
      error: error.message,
    });
  }
};
const getEventsByName = async (req, res) => {
  try {
    const name = req.params.name;
    const events = await Events.find({ eventName: name });
    return res.status(200).json({
      events: events,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching events.',
      error: error.message,
    });
  }
};
const addParticipant = async (req, res) => {
  const {
    name,
    cnic,
    contactNumber,
    userid: userId,
    team,
    gender,
    accomodation,
  } = req.body;
  try {
    const participant = new Participant({
      name,
      cnic,
      contactNumber,
      userId,
      team,
      gender,
      accommodation: accomodation,
    });
    try {
      await participant.save();
    } catch (saveError) {
      console.error('Error during participant save operation:', saveError);
    }
    return res.status(201).json({
      message: 'Participant added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during adding participant.',
      error: error.message,
    });
  }
};

const getParticipantsByiD = async (req, res) => {
  try {
    const userid = req.params.id;
    const participants = await Participant.find({ userId: userid });
    return res.status(200).json({
      participants: participants,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching participants.',
      error: error.message,
    });
  }
};

const deleteSingleParticipantByiD = async (req, res) => {
  try {
    const participantId = req.params.id;
    const participant = await Participant.findById(participantId);
    if (participant && participant.team.length === 0) {
      await Participant.deleteOne({ _id: participantId });
      return res.status(200).json({
        message: 'Participant deleted successfully',
      });
    } else {
      return res.status(400).json({
        message: 'Cannot delete participant. Participant is part of a team.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error during deleting participant.',
      error: error.message,
    });
  }
};

const registerTeam = async (req, res) => {
  const { userId, teamName, eventId, participants, captchaValue, payable } =
    req.body;

  if (!captchaValue) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }

  const recaptchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`
  );
  const recaptchaData = recaptchaResponse.data;

  if (!recaptchaData.success) {
    return res
      .status(400)
      .json({ message: 'Invalid reCAPTCHA. Please try again.' });
  }

  try {
    // Create the team
    const team = new Team({
      name: teamName,
      userId,
      eventId,
      participants,
    });
    const existingTeam = await Team.find({
      userId: userId,
      eventId: eventId,
      participants: participants,
    });
    if (existingTeam && existingTeam[0]) {
      return res.status(400).json({
        message: 'This team has already been registered for this event.',
      });
    }
    await team.save();

    // Update the participants with the team they are part of
    for (let participantId of participants) {
      const participant = await Participant.findById(participantId);
      if (participant) {
        participant.team = participant.team || [];
        participant.team.push(team._id);
        await participant.save();
      }
    }

    // Check if the team is already registered
    const existingRegistration = await Registration.findOne({
      teamId: team._id,
    });
    if (existingRegistration) {
      return res.status(400).json({
        message: 'This team has already been registered for the event.',
      });
    }

    // Create the registration with the provided payable amount
    const registration = new Registration({
      userId,
      teamId: team._id,
      approved: false,
      payable: parseFloat(payable) || 0,
    });

    await registration.save();

    return res.status(201).json({
      message: 'Team registered successfully',
      team,
      registration,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error during team registration.',
      error: error.message,
    });
  }
};

const getRegistrationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const registrations = await Registration.find({ userId });
    return res.status(200).json({
      registrations,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching registrations.',
      error: error.message,
    });
  }
};

const getRegisterationInfo = async (req, res) => {
  try {
    const registrationId = req.params.registrationId;
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        message: 'No registration found for the given ID.',
      });
    }

    const team = await Team.findById(registration.teamId);
    if (!team) {
      return res.status(404).json({
        message: 'Team not found.',
      });
    }

    const event = await Events.findById(team.eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found.',
      });
    }

    const participants = await Participant.find({
      _id: { $in: team.participants },
    });
    const participantNames = participants.map(
      (participant) => participant.name
    );

    const statistics = {
      eventName: event.eventName,
      teamName: team.name,
      participantsCount: team.participants.length,
      registrationFee: registration.payable,
      participants: participantNames,
    };
    console.log(statistics);
    res.status(200).json(statistics);
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching registration info.',
      error: error.message,
    });
  }
};

const deleteSpecificRegistrationANDteam = async (req, res) => {
  try {
    const registrationId = req.params.registrationId;
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        message: 'Registration not found',
      });
    }
    if (registration.approved) {
      return res.status(404).json({
        message: 'Cannot Delete As Payment Is Done',
      });
    }
    const team = await Team.findById(registration.teamId);
    if (!team) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }

    // Archive the team
    const archivedTeam = new archievedModel.ArchivedTeam({
      originalId: team._id,
      name: team.name,
      userId: team.userId,
      eventId: team.eventId,
      participants: team.participants,
    });
    await archivedTeam.save();

    // Archive the registration
    const archivedRegistration = new archievedModel.ArchivedRegistration({
      originalId: registration._id,
      userId: registration.userId,
      teamId: registration.teamId,
      approved: registration.approved,
      payable: registration.payable,
    });
    await archivedRegistration.save();

    for (let participantId of team.participants) {
      let participant = await Participant.findById(participantId);
      if (participant) {
        participant.team = participant.team.filter(
          (temp) => temp !== registration.teamId
        );
        await participant.save();
      }
    }

    await Team.deleteOne({ _id: registration.teamId });
    await Registration.deleteOne({ _id: registrationId });

    return res.status(200).json({
      message: 'Registration and associated team deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during deleting registration and team.',
      error: error.message,
    });
  }
};

// const modifyRegisteration = async (req, res) => {
//   const { registrationId, formData } = req.body;

//   try {
//     const registration = await Registration.findById(registrationId);
//     if (!registration) {
//       return res.status(404).json({
//         message: 'Registration not found.',
//       });
//     }

//     return res.status(200).json({
//       message: 'Registration modified successfully',
//       registration,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Error during registration modification.',
//       error: error.message,
//     });
//   }
// };

const getAmountPayable = async (req, res) => {
  const { eventId, participantCount } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    let payable;
    if (event.status === 'Individual') {
      payable = event.registrationFee * participantCount;
    } else if (event.status === 'Per Team') {
      payable = event.registrationFee;
    }

    return res.status(200).json({
      message: 'Payable amount calculated successfully',
      payable,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during payable amount calculation.',
      error: error.message,
    });
  }
};

const generateInvoice = async (req, res) => {
  const userId = req.params.userId;

  try {
    const registrations = await Registration.find({ userId });
    const registrationTableData = await Promise.all(
      registrations.map(async (registration) => {
        const team = await Team.findById(registration.teamId);
        if (!team) {
          return null;
        }
        const event = await Events.findById(team.eventId);
        if (!event) {
          return null;
        }
        return {
          teamName: team.name,
          participantsCount: team.participants.length,
          fee: registration.payable,
          eventName: event.eventName,
          status: registration.approved ? 'Approved' : 'Pending',
        };
      })
    );

    const participants = await Participant.find({
      userId,
      accommodation: true,
      team: { $ne: null },
    });
    const accommodationTableData = await Promise.all(
      participants.map(async (participant) => {
        if (participant.team.length === 0) {
          return null;
        }
        return {
          participantName: participant.name,
          numberOfTeams: participant.team.length,
          gender: participant.gender || 'NA',
          fee: 1000,
          status: participant.accommodation_status ? 'Approved' : 'Pending',
        };
      })
    );

    // Filter out any null values from the arrays
    const filteredRegistrationTableData = registrationTableData.filter(
      (item) => item !== null
    );
    const filteredAccommodationTableData = accommodationTableData.filter(
      (item) => item !== null
    );

    // Calculate totals
    const registrationTotal = filteredRegistrationTableData.reduce(
      (total, item) => total + item.fee,
      0
    );
    const accommodationTotal = filteredAccommodationTableData.reduce(
      (total, item) => total + item.fee,
      0
    );
    const grandTotal = registrationTotal + accommodationTotal;

    res.json({
      filteredRegistrationTableData,
      filteredAccommodationTableData,
      registrationTotal,
      accommodationTotal,
      grandTotal,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during invoice generation.',
      error: error.message,
    });
  }
};

const getDashboardStatistics = async (req, res) => {
  const userid = req.params.userId;
  try {
    const registrations = await Registration.find({ userId: userid });
    const totalRegistrations = registrations.length;

    // Calculate total payable excluding approved registrations
    const totalPayable = registrations.reduce(
      (total, registration) =>
        total + (registration.approved ? 0 : registration.payable),
      0
    );

    const participants = await Participant.find({ userId: userid });

    const totalParticipants = participants.length;

    // Filter participants with accommodation and assigned to a team
    const accommodationParticipants = participants.filter(
      (participant) =>
        participant.accommodation === true && participant.team.length > 0
    );

    // Generate accommodation table data as in `generateInvoice`
    const accommodationTableData = accommodationParticipants.map(
      (participant) => ({
        participantName: participant.name,
        numberOfTeams: participant.team.length,
        gender: participant.gender || 'NA',
        fee: 1000, // Fixed fee per participant
        status: participant.accommodation_status ? 'Approved' : 'Pending',
      })
    );

    // Calculate accommodation total using the same logic as `generateInvoice`
    const totalAccommodationFee = accommodationTableData.reduce(
      (total, item) => total + item.fee,
      0
    );

    // Add accommodation fee to total payable
    const grandTotalPayable = totalPayable + totalAccommodationFee;

    const total_accomodation = accommodationParticipants.length;

    const assignedParticipants = participants.filter(
      (participant) => participant.team.length > 0
    ).length;

    // Calculate registrations by category
    const registrationsByCategory = {};
    for (let registration of registrations) {
      const team = await Team.findById(registration.teamId);
      if (team) {
        const event = await Events.findById(team.eventId);
        if (event) {
          const category = event.eventCategory;
          if (!registrationsByCategory[category]) {
            registrationsByCategory[category] = 0;
          }
          registrationsByCategory[category]++;
        }
      }
    }

    // Send response with the updated statistics
    res.status(200).json({
      totalRegistrations,
      totalPayable: grandTotalPayable,
      totalParticipants,
      total_accomodation,
      totalAccommodationFee,
      assignedParticipants,
      registrationsByCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching dashboard statistics.',
      error: error.message,
    });
  }
};

// get the participants by day for the bar chart per useriD
const getParticipantsByDay = async (req, res) => {
  const userId = req.params.userId;
  try {
    const participants = await Participant.find({ userId });
    const participantsByDay = {};
    for (let participant of participants) {
      const date = new Date(participant.createdAt).toDateString();
      if (!participantsByDay[date]) {
        participantsByDay[date] = 0;
      }
      participantsByDay[date]++;
    }
    res.status(200).json({
      participantsByDay,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching participants by day.',
      error: error.message,
    });
  }
};

const getAmbassadorStatistics = async (req, res) => {
  const ambassadorId = req.params.ambassadorId;
  try {
    const ambassador = await Ambassador.findById(ambassadorId);
    if (!ambassador) {
      return res.status(404).json({
        message: 'Ambassador not found',
      });
    }
    const categoryEventIds = await Events.aggregate([
      {
        $group: {
          _id: '$eventCategory', // Group by event category
          eventIds: { $push: '$_id' }, // Collect event IDs for each category
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          eventIds: 1,
        },
      },
    ]);

    // Convert the aggregation result into a lookup map {eventId: category}
    const eventCategoryMap = {};
    const categoryCounts = {}; // Initialize all categories with zero counts

    // Initialize all categories with zero registered and unregistered counts
    categoryEventIds.forEach((cat) => {
      categoryCounts[cat.category] = { registered: 0, unregistered: 0 };
      cat.eventIds.forEach((eventId) => {
        eventCategoryMap[eventId.toString()] = cat.category;
      });
    });

    // Fetch registrations for the specific user
    const registrations = await Registration.find({ userId: ambassador._id });

    // Enrich registrations with event category
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const team = await Team.findById(reg.teamId).select('eventId -_id');
        const category =
          eventCategoryMap[team.eventId.toString()] || 'Unknown Category';
        return { ...reg._doc, eventCategory: category };
      })
    );

    // Accumulate registered and unregistered counts for each category
    enrichedRegistrations.forEach((reg) => {
      const category = reg.eventCategory;
      const isRegistered = reg.approved;
      if (isRegistered) {
        categoryCounts[category].registered += 1;
      } else {
        categoryCounts[category].unregistered += 1;
      }
    });

    // Convert the categoryCounts object into an array of objects
    const categorySummary = Object.keys(categoryCounts).map((category) => ({
      category: category,
      registered: categoryCounts[category].registered,
      unregistered: categoryCounts[category].unregistered,
    }));

    // Output the array of category summaries
    categorySummary.sort((a, b) => a.category.localeCompare(b.category));
    res.send(categorySummary);
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching ambassador statistics.',
      error: error.message,
    });
  }
};

export {
  getEventsByCategory,
  getEvents,
  getCategoies,
  addParticipant,
  getParticipantsByiD,
  registerTeam,
  deleteSingleParticipantByiD,
  getRegistrationsByUserId,
  //modifyRegisteration,
  deleteSpecificRegistrationANDteam,
  getEventsByName,
  getRegisterationInfo,
  getAmountPayable,
  generateInvoice,
  getDashboardStatistics,
  getParticipantsByDay,
  getAmbassadorStatistics,
};
