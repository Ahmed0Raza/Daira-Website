import dotenv from 'dotenv';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Invitations from '../modals/invitations-model.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';

const login = async (req, res) => {
  const { username, password, recaptchaToken } = req.body;
  if (!recaptchaToken) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }
  try {
    // const recaptchaResponse = await axios.post(
    //   `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    // );
    // const recaptchaData = recaptchaResponse.data;

    // if (!recaptchaData.success) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Invalid reCAPTCHA. Please try again.' });
    // }

    const user = await Invitations.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { username: user.userName, id: user._id },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );
    return res.status(200).json({ result: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { login };
