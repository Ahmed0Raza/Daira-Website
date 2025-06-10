import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import accommodations_team from '../modals/accommodation-model.js';
import Participant from '../modals/participant-model.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';

const login = async (req, res) => {
  const { username, password, recaptchaToken } = req.body;
  console.log('Login request received:', { username });

  if (!recaptchaToken) {
    console.log('No reCAPTCHA token provided.');
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }

  try {
    console.log("secret",process.env.RECAPTCHA_SECRET_KEY)
    console.log(recaptchaToken)
    console.log('Verifying reCAPTCHA...');
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );

    const recaptchaData = recaptchaResponse.data;
    console.log('reCAPTCHA verification result:', recaptchaData);

    if (!recaptchaData.success) {
      console.log('Invalid reCAPTCHA.');
      return res.status(400).json({ message: 'Invalid reCAPTCHA. Please try again.' });
    }

    console.log('Finding user in database...');
    const accommodation = await accommodations_team.findOne({ userName: username });
    if (!accommodation) {
      console.log('User not found.');
      return res.status(404).json({ message: 'Accomodation user not found' });
    }

    console.log('Checking password...');
    const isPasswordValid = await bcrypt.compare(password, accommodation.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { username: accommodation.userName, id: accommodation._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    console.log('Login successful, token generated.');
    return res.status(200).json({ result: token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = async (req, res) => {
  const token = req.headers.authorization;
  console.log('Verifying token:', token);

  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decodedData);

    const existingUser = await accommodations_team.findOne({
      userName: decodedData.username,
    });

    if (!existingUser) {
      console.log('User not found from token.');
      return res.status(404).json({ message: 'Accomodation member not found' });
    }

    console.log('Token verified successfully.');
    res.status(200).json({ result: true });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getConfirmedAccommodations = async (req, res) => {
  console.log('Fetching confirmed accommodations...');
  try {
    // Only select the fields you want to return
    const participants = await Participant.find(
      { accommodation_status: true },
      'name cnic contactNumber gender' // Only select these fields
    );

    if (!participants || participants.length === 0) {
      console.log('No confirmed participants found.');
      return res.status(404).json({ message: 'Participants not found' });
    }

    const count = participants.length;
    console.log('Confirmed participants found:', count);

    return res.status(200).json({ 
      result: participants,
      count: count
    });
  } catch (error) {
    console.error('Error fetching confirmed accommodations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUnConfirmedAccommodations = async (req, res) => {
  console.log('Fetching unconfirmed accommodations...');
  try {
    // Only select the fields you want to return
    const participants = await Participant.find(
      { 
        accommodation: true, 
        accommodation_status: false 
      },
      'name cnic contactNumber gender' // Only select these fields
    );

    if (!participants || participants.length === 0) {
      console.log('No unconfirmed participants found.');
      return res.status(404).json({ message: 'Participants not found' });
    }

    const count = participants.length;
    console.log('Unconfirmed participants found:', count);

    return res.status(200).json({ 
      result: participants,
      count: count
    });
  } catch (error) {
    console.error('Error fetching unconfirmed accommodations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// If you want to get both counts in a single request
const getAccommodationCounts = async (req, res) => {
  console.log('Fetching accommodation counts...');
  try {
    const confirmedCount = await Participant.countDocuments({ accommodation_status: true });
    const unconfirmedCount = await Participant.countDocuments({ accommodation: true, accommodation_status: false });
    
    return res.status(200).json({
      confirmedCount,
      unconfirmedCount
    });
  } catch (error) {
    console.error('Error fetching accommodation counts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// const confirmAccommodationStatus = async (req, res) => {
//   console.log('Confirming accommodation status...');
//   try {
//     const { participantId } = req.params;
//     console.log('Participant ID:', participantId);

//     const updatedParticipant = await Participant.findByIdAndUpdate(
//       participantId,
//       { accommodation_status: true },
//       { new: true }
//     );

//     if (!updatedParticipant) {
//       console.log('Participant not found for update.');
//       return res.status(404).json({ message: 'Participant not found' });
//     }

//     console.log('Accommodation status updated:', updatedParticipant);
//     return res.status(200).json({
//       message: 'Accommodation status updated successfully',
//       participant: updatedParticipant,
//     });
//   } catch (error) {
//     console.error('Error confirming accommodation status:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

export {
  login,
  getConfirmedAccommodations,
  getUnConfirmedAccommodations,
  // confirmAccommodationStatus,
  verifyToken,
};
