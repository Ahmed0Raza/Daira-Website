import axios from 'axios';
import dotenv from 'dotenv';
import AmbassadorNomination from '../modals/ambassador-nomination-model.js';
import Ambassador from '../modals/ambassador-model.js';
import User from '../modals/user-model.js';
import { sendAmbassadorCredentials } from '../utilities/emailService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Registration from '../modals/registeration-model.js';
import Participant from '../modals/participant-model.js';
import Team from '../modals/team-model.js';

dotenv.config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h';

const registerAmbassador = async (req, res) => {
  try {
    const {
      name,
      institute,
      campusName,
      typeOfInstitute,
      department,
      rollNumber,
      city,
      batch,
      phoneNumber,
      email,
      studentAffairOfficerName,
      studentAffairOfficerContact,
      attendedDairaBefore,
      ambassadorDaira,
      previousExperience,
      plansOfDaira,
      participantsNumber,
      captchaValue,
    } = req.body;

    if (!captchaValue) {
      return res.status(400).json({ message: 'No reCAPTCHA token provided.' });
    }

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      console.log('Invalid reCAPTCHA verification');
      return res
        .status(400)
        .json({ message: 'Invalid reCAPTCHA. Please try again.' });
    }

    const newAmbassador = new AmbassadorNomination({
      name,
      institute,
      campusName,
      typeOfInstitute,
      department,
      rollNumber,
      city,
      batch,
      phoneNumber,
      email,
      studentAffairOfficerName,
      studentAffairOfficerContact,
      attendedDairaBefore,
      ambassadorDaira,
      previousExperience,
      plansOfDaira,
      participantsNumber,
    });

    await newAmbassador.save();

    res.status(201).json({ message: 'Application Recieved Successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to register ambassador', error: error.message });
  }
};

const getAmbassadors = async (req, res) => {
  try {
    const ambassadors = await AmbassadorNomination.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$email',
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
    ]);

    res.status(200).json(ambassadors);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get ambassadors',
      error: error.message,
    });
  }
};

const getAmbassador = async (req, res) => {
  try {
    const ambassador = await AmbassadorNomination.findById(req.params.id);
    res.status(200).json(ambassador);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to get ambassador', error: error.message });
  }
};

const approveAmbassador = async (req, res) => {
  try {
    const { id: _id } = req.body;
    const nominated_ambassador = await AmbassadorNomination.findById(_id);
    const Ambassador = {
      _id: nominated_ambassador._id,
      name: nominated_ambassador.name,
      institute: nominated_ambassador.institute,
      campus: nominated_ambassador.campusName,
      email: nominated_ambassador.email,
      contactNumber: nominated_ambassador.phoneNumber,
    };
    const verificationToken = jwt.sign(Ambassador, JWT_SECRET, {
      expiresIn: '4d',
    });

    sendAmbassadorCredentials(
      nominated_ambassador.name,
      nominated_ambassador.email,
      verificationToken
    );

    nominated_ambassador.approved = true;
    await nominated_ambassador.save();
    await AmbassadorNomination.deleteMany({
      email: nominated_ambassador.email,
      approved: false,
    });
    res.status(201).json({ message: 'Ambassador Approved Successfully' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Failed to register ambassador', error: error.message });
  }
};

const AmbassadorSignup = async (req, res) => {
  try {
    const {
      values: { image, imagePreview, cnic, gender, password },
      token,
      captchaValue,
    } = req.body;

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

    const ambassadorData = jwt.verify(token, JWT_SECRET);
    const { _id, name, institute, campus, email, contactNumber } =
      ambassadorData;
    const ambassadorCode = Math.random().toString(36).substring(2, 8);
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageBuffer = null;
    let contentType = null;
    if (imagePreview && typeof imagePreview === 'string') {
      const matches = imagePreview.match(/^data:(.*);base64,(.*)$/);
      if (matches) {
        contentType = matches[1];
        imageBuffer = Buffer.from(matches[2], 'base64');
      }
    }

    const newAmbassador = new Ambassador({
      name,
      institute,
      campusName: campus,
      email,
      contact: contactNumber,
      cnic,
      gender,
      password: hashedPassword,
      a_id: ambassadorCode,
      image: imageBuffer ? { data: imageBuffer, contentType } : undefined,
    });

    await newAmbassador.save();
    const nominated_ambassador = await AmbassadorNomination.findById(_id);

    const user = await User.findOne({ email: newAmbassador.email });

    if (user) {
      // Delete the registrations, participants, and teams associated with the user
      await Registration.deleteMany({ userId: user._id });
      await Participant.deleteMany({ userId: user._id });
      await Team.deleteMany({ userId: user._id });

      // Delete the user
      await User.deleteOne({ _id: user._id });
    }

    if (nominated_ambassador) {
      nominated_ambassador.status = true;
      await nominated_ambassador.save();
    }

    res.status(201).json({ message: 'Ambassador Registered Successfully' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Failed to register ambassador', error: error.message });
  }
};

const verifyToken = async (req, res) => {
  const token = req.query.token;
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: 'Token is Valid', status: '200' });
  } catch (error) {
    res.status(500).json({
      message: 'Error during token verification.',
      error: error.message,
    });
  }
};

const getActiveAmbassadors = async (req, res) => {
  try {
    const fieldsToSelect = 'name email contact institute campusName';
    const ambassadors = await Ambassador.find().select(fieldsToSelect);

    res.status(200).json(ambassadors);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to get ambassadors', error: error.message });
  }
};

const updateAmbassadorNomination = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const ambassador = await AmbassadorNomination.findById(_id);
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    const updatedAmbassador = await AmbassadorNomination.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAmbassador);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update ambassador', error: error.message });
  }
};

export {
  registerAmbassador,
  getAmbassadors,
  getAmbassador,
  approveAmbassador,
  AmbassadorSignup,
  verifyToken,
  updateAmbassadorNomination,
  getActiveAmbassadors,
};
