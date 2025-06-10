import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Registration from '../modals/registeration-model.js';
import Team from '../modals/team-model.js';
import Event from '../modals/Event-Model.js';
import Ambassador from '../modals/ambassador-model.js';
import Participant from '../modals/participant-model.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';

const getAmbassadors = async (req, res) => {
  try {
    const ambassadors = await Ambassador.find({}, { image: 0 });
    res.status(200).json(ambassadors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAmbassador = async (req, res) => {
  const { id } = req.params;
  try {
    const ambassador = await Ambassador.findById(id);
    res.status(200).json(ambassador);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getAmbassadorParticipants = async (req, res) => {
  try {
    const ambassadors = await Ambassador.find({}, { image: 0 });

    let dataToReturn = [];
    for (let index = 0; index < ambassadors.length; index++) {
      const ambassador = ambassadors[index];
      const participants = await Participant.find({ userId: ambassador._id });
      let registeredCount = 0;
      let unregisteredCount = 0;
      participants.forEach((participant) => {
        if (participant.team.length > 0) {
          registeredCount++;
        } else {
          unregisteredCount++;
        }
      });
      dataToReturn.push({
        _id: ambassador._id,
        name: ambassador.name,
        institute: ambassador.institute,
        registeredCount,
        unregisteredCount,
      });
    }
    res.status(200).json(dataToReturn);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getRegistrationStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const registrations = await Registration.find({ userId });

    const approvedRegistrations = registrations.filter((reg) => reg.approved);
    const unapprovedRegistrations = registrations.filter(
      (reg) => !reg.approved
    );

    const approvedStats = {};
    const unapprovedStats = {};

    for (let registration of approvedRegistrations) {
      const team = await Team.findById(registration.teamId);
      const event = await Event.findById(team.eventId);
      const category = event.eventCategory;
      if (!approvedStats[category]) {
        approvedStats[category] = 0;
      }
      approvedStats[category]++;
    }

    for (let registration of unapprovedRegistrations) {
      const team = await Team.findById(registration.teamId);
      const event = await Event.findById(team.eventId);
      const category = event.eventCategory;
      if (!unapprovedStats[category]) {
        unapprovedStats[category] = 0;
      }
      unapprovedStats[category]++;
    }

    res.status(200).json({
      approvedStats,
      unapprovedStats,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during fetching registration statistics.',
      error: error.message,
    });
  }
};

export {
  getAmbassadors,
  getAmbassador,
  getRegistrationStats,
  getAmbassadorParticipants,
};
