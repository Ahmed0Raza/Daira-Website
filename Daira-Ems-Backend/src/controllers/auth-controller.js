import jwt from 'jsonwebtoken';
import User from '../modals/user-model.js';
import Userforgetpass from '../modals/user-forgetpass-model.js';
import Ambassador from '../modals/ambassador-model.js';
import {
  sendAmbassadorCredentials,
  sendVerificationEmail,
  sendForgetPassEmail,
} from '../utilities/emailService.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import axios from 'axios';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';
const A_JWT_EXPIRATION = '1d';

const signup = async (req, res) => {
  let {
    name,
    email,
    password,
    contact,
    cnic,
    gender,
    a_id,
    institute,
    city,
    recaptcha,
  } = req.body;

  // Convert email to lowercase
  email = email.toLowerCase();

  if (!recaptcha) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }

  try {
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ message: 'Invalid reCAPTCHA. Please try again.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { cnic }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with the given email or CNIC already exists.' });
    }

    const existingAmbassador = await Ambassador.findOne({
      $or: [{ email }, { cnic }],
    });
    if (existingAmbassador) {
      return res
        .status(400)
        .json({ message: 'User with the given email or CNIC already exists.' });
    }

    if (a_id) {
      const ambassadorExists = await Ambassador.findById(a_id);
      if (!ambassadorExists) {
        return res.status(404).json({ message: 'Invalid ambassador code.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      contact,
      cnic,
      gender,
      a_id,
      institute,
      city,
    };

    const verificationToken = jwt.sign(userData, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    await sendVerificationEmail(name, email, verificationToken);

    res.status(200).json({
      message: 'Please check your email to verify your account.',
      success: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error during signup.',
      error: error.message,
    });
  }
};


// login controller
const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
    }

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ message: 'Invalid reCAPTCHA. Please try again.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const ambassador = await Ambassador.findOne({ email }).select('-image');
      if (!ambassador) {
        return res.status(404).json({ message: 'Invalid Email entered.' });
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          ambassador.password
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid password entered.' });
        }
        const token = jwt.sign(
          { email: ambassador.email, id: ambassador._id },
          JWT_SECRET,
          {
            expiresIn: JWT_EXPIRATION,
          }
        );
        if (token) return res.status(200).json({ result: ambassador, token });
      }
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password entered.' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.status(200).json({ result: user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res
      .status(500)
      .json({ message: 'Error during login.', error: error.message });
  }
};

// verify token
const verifyToken = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: 'Token is Valid', decodedData });
  } catch (error) {
    res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const ambassadorsignup = async (req, res) => {
  const { name, institute, email, password, contact, cnic, gender, a_id } =
    req.body;

  try {
    const existingUser = await Ambassador.findOne({
      $or: [{ email }, { cnic }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: 'Ambassdor with the given email or CNIC already exists.',
      });
    }
    if (a_id) {
      const ambassadorExists = await Ambassador.findOne({ a_id });
      if (ambassadorExists) {
        return res.status(404).json({ message: 'try new ambassador code.' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const AmbassData = new Ambassador({
      name,
      institute,
      email,
      password: hashedPassword,
      contact,
      cnic,
      gender,
      a_id,
    });

    await AmbassData.save();

    res
      .status(200)
      .json({ message: 'Ambassdar created successfully(email not verified).' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during signup.', error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email, password, captchaValue } = req.body;
  if (!captchaValue) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }
  const recaptchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`
  );
  const recaptchaData = recaptchaResponse.data;

  if (!recaptchaData.success) {
    return res
      .status(400)
      .json({ message: 'Invalid reCAPTCHA. Please try again.' });
  }

  try {
    let existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      existingUser = await Ambassador.findOne({
        email: email,
      });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
    }

    if (existingUser) {
      const user = await Userforgetpass.create({
        email: existingUser.email,
        password: password,
      });
      user.otp = 'trigger';
      await user.save();
      sendForgetPassEmail(existingUser.name, user.email, user.otp);
      res.status(200).json({ message: 'OTP sent to your email.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({
      message: 'Recurrent attempt, try again after 5 minutes.',
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { otp, captchaValue } = req.body;

  if (!captchaValue) {
    return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
  }

  const recaptchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`
  );
  const recaptchaData = recaptchaResponse.data;

  if (!recaptchaData.success) {
    return res
      .status(400)
      .json({ message: 'Invalid reCAPTCHA. Please try again.' });
  }

  try {
    const otpUser = await Userforgetpass.findOne({ otp: otp });
    if (otpUser) {
      const user = await User.findOne({ email: otpUser.email });
      user.password = await bcrypt.hash(otpUser.password, 10);
      await user.save();
      res.status(200).json({ message: 'Password reset successfully.' });
    } else {
      res.status(404).json({ message: 'Wrong OTP.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during password reset.', error: error.message });
  }
};

const ambassadorlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const amb = await Ambassador.findOne({ email });

    if (!amb) {
      return res.status(404).json({ message: 'Ambassador not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, amb.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    if (!amb.isemailverified) {
      const verificationToken = jwt.sign(
        { email: amb.email, id: amb._id },
        JWT_SECRET,
        {
          expiresIn: A_JWT_EXPIRATION,
        }
      );
      sendAmbassadorCredentials(amb.name, amb.email, verificationToken);
      return res
        .status(400)
        .json({ message: 'Please check your email to verify your account.' });
    }

    const token = jwt.sign({ email: amb.email, id: amb._id }, JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({ result: amb, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during login.', error: error.message });
  }
};

export {
  signup,
  login,
  verifyToken,
  ambassadorsignup,
  ambassadorlogin,
  forgetPassword,
  verifyOTP,
};
