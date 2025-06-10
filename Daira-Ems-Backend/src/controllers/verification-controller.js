import jwt from 'jsonwebtoken';
import User from '../modals/user-model.js';
import Amab from '../modals/ambassador-model.js';
import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Verification token is missing.');
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET);

    // Convert email to lowercase before destructuring
    userData.email = userData.email.toLowerCase();

    const { password, ...userDataWithoutPassword } = userData;

    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return res.status(400).send('This email is already in use.');
    }

    const user = new User({
      ...userDataWithoutPassword,
      password: userData.password,
    });

    await user.save();
    res.send('Your account has been created, and you can now log in.');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(400).send('Verification link has expired.');
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400).send('Invalid verification link.');
    } else {
      res.status(500).send('Failed to verify email.');
    }
  }
};


export const verifyAmbasEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Verification token is missing.');
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET);
    const existingUser = await Amab.findOne({ email: userData.email });

    if (!existingUser) {
      return res.status(400).send('User not found.');
    }

    existingUser.isemailverified = true;
    await existingUser.save();

    res.send('Email verification successful.');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(400).send('Verification link has expired.');
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400).send('Invalid verification link.');
    } else {
      res.status(500).send('Failed to verify email.');
    }
  }
};
