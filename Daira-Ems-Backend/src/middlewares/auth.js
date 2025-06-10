import Admin from '../modals/admin-model.js';
import invitations_team from '../modals/invitations-model.js';
import jwt from 'jsonwebtoken';
import User from '../modals/user-model.js';
import dotenv from 'dotenv';
import Ambassador from '../modals/ambassador-model.js';
import Agent from '../modals/registrationAgent-Model.js';
import society from '../modals/society-modal.js';
import accommodations_team from '../modals/accommodation-model.js';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isAdminOrInvitation = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decodedData = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decodedData.id);
    if (admin) {
      return next();
    } else {
      const invitation = await invitations_team.findById(decodedData.id);
      if (invitation) {
        return next();
      } else {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log('No token provided.');
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decodedData.id);
    if (admin) {
      req.admin = admin;
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized access' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({
      message: 'Invalid token. Please login again.',
      error: error.message,
    });
  }
};

const isInvitations = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const invitation = await invitations_team.findById(decodedData.id);
    if (invitation) {
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isLogin = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decodedData.id);
    if (!user) {
      const ambassador = await Ambassador.findById(decodedData.id);
      if (ambassador) {
        return next();
      } else {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
    } else {
      return next();
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isAgent = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Token received:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const agent = await Agent.findById(decodedData.id);
    if (agent) {
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isPresident = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const president = await society.findById(decodedData.id);
    if (!president) {
      return res.status(401).json({ message: 'Unauthorized access' });
    } else {
      return next();
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const isAccommodations = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    const accommodation = await accommodations_team.findById(decodedData.id);
    if (!accommodation) {
      return res.status(401).json({ message: 'Unauthorized access' });
    } else {
      return next();
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

export {
  isInvitations,
  isLogin,
  isAdmin,
  verifyToken,
  isAdminOrInvitation,
  isAgent,
  isPresident,
  isAccommodations,
};
