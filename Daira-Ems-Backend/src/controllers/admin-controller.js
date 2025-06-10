import dotenv from 'dotenv';
import axios from 'axios';
import Admin from '../modals/admin-model.js';
import GuideBook from '../modals/GuideBook-model.js';
import Event from '../modals/Event-Model.js';
import invitations_team from '../modals/invitations-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import csv from 'csv-parser';
import readXlsxFile from 'read-excel-file/node';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import os from 'os';
import User from '../modals/user-model.js';
import Ambassador from '../modals/ambassador-model.js';
import Team from '../modals/team-model.js';
import Registration from '../modals/registeration-model.js';
import Participant from '../modals/participant-model.js';
import Agent from '../modals/registrationAgent-Model.js';
import Invoice from '../modals/invoice-modal.js';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.staging';
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

    const admin = await Admin.findOne({ userName: username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { username: admin.userName, id: admin._id },
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

const updateGuideBook = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    let guideBook = await GuideBook.findOne();
    if (!guideBook) {
      guideBook = new GuideBook();
    }
    guideBook.pdfFile = req.file.buffer;
    await guideBook.save();
    res.status(200).send('GuideBook updated successfully.');
  } catch (error) {
    console.error('Error updating the guidebook:', error);
    res.status(500).send('Error updating the guidebook.');
  }
};

const parseNumber = (value, fallback = 0) => {
  const cleaned = value?.toString().replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
};

const uploadEvent = async (req, res) => {
  try {
    const { file } = req;
    const { originalname, buffer } = file;

    const processEventRow = (row) => {
      const minTeamSize = parseNumber(row[7], 1);
      const maxTeamSize = parseNumber(row[8], 1);
      const registrationType = row[12]?.toString()?.trim();
      const prizeMoney = parseNumber(row[13], 0);
      const registrationFee = parseNumber(row[14], 0);

      return {
        timestamp: row[0]?.toString()?.trim(),
        emailAddress: row[1]?.toString()?.trim(),
        societyName: row[2]?.toString()?.trim(),
        eventCategory: row[3]?.toString()?.trim(),
        eventName: row[4]?.toString()?.trim(),
        description: row[5]?.toString()?.trim(),
        rules: row[6]?.toString()?.trim(),
        minTeamSize,
        maxTeamSize,
        headName: row[9]?.toString()?.trim(),
        contactNumber: row[10]?.toString()?.trim(),
        nuEmailAddress: row[11]?.toString()?.trim(),
        registrationType,
        prizeMoney,
        registrationFee,
        status: 'active',
      };
    };

    const validateEvent = (event) => {
      const requiredFields = [
        'emailAddress',
        'societyName',
        'eventCategory',
        'eventName',
        'description',
        'rules',
        'minTeamSize',
        'maxTeamSize',
        'headName',
        'contactNumber',
        'nuEmailAddress',
        'registrationType',
        'prizeMoney',
        'registrationFee',
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = event[field];
        if (typeof value === 'number') return isNaN(value);
        return !value || value.toString().trim() === '';
      });

      return missingFields.length === 0;
    };

    if (originalname.endsWith('.csv')) {
      const events = [];
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      stream
        .pipe(csv())
        .on('data', (data) => {
          const row = Object.values(data);
          const event = processEventRow(row);
          if (validateEvent(event)) {
            events.push(event);
          } else {
            console.log('Invalid CSV row:', row);
          }
        })
        .on('end', async () => {
          if (events.length === 0) {
            return res.status(400).json({
              message: 'No valid events found in CSV file.',
            });
          }

          await Event.insertMany(events);
          res.status(200).json({
            message: 'Events uploaded successfully from CSV',
            totalEvents: events.length,
          });
        });
    } else if (
      originalname.endsWith('.xls') ||
      originalname.endsWith('.xlsx')
    ) {
      const tempFilePath = path.join(os.tmpdir(), originalname);
      fs.writeFileSync(tempFilePath, buffer);
      const rows = await readXlsxFile(tempFilePath);

      const header = rows[0];
      console.log('Excel Header Row:', header);

      const events = rows
        .slice(1)
        .map(processEventRow)
        .filter((event, index) => {
          const isValid = validateEvent(event);
          if (!isValid) {
            console.log(`Invalid Excel row ${index + 2}:`, event);
          }
          return isValid;
        });

      if (events.length === 0) {
        return res.status(400).json({
          message: 'No valid events found in Excel file.',
        });
      }

      await Event.insertMany(events);
      res.status(200).json({
        message: 'Events uploaded successfully from Excel',
        totalEvents: events.length,
        details: {
          validEvents: events.length,
          totalRows: rows.length - 1,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid file format' });
    }
  } catch (error) {
    console.error('Error in uploadEvent function:', error);
    res.status(500).json({
      message: 'Error uploading events',
      error: error.message,
      details: error.errors || 'Unknown error',
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'active' });
    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active events found',
      });
    }
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Event.find().distinct('eventCategory');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

const getEventsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const events = await Event.find({
      eventCategory: category,
      status: 'active',
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

const getStatistics = async (req, res) => {
  try {
    // Fetch all participants and registrations
    const [participants, registrations] = await Promise.all([
      Participant.find(),
      Registration.find(),
    ]);

    // Initialize counters for each category
    const stats = {
      ocTeam: {
        totalParticipants: 0,
        totalRegistrations: 0,
        totalPayableAmount: 0,
      },
      universityNonOC: {
        totalParticipants: 0,
        totalRegistrations: 0,
        totalPayableAmount: 0,
      },
      outsiders: {
        totalParticipants: 0,
        totalRegistrations: 0,
        totalPayableAmount: 0,
      },
    };

    // Process participants and registrations
    for (const registration of registrations) {
      const team = await Team.findById(registration.teamId);
      const numOfParticipants = team.participants.length;
      const payable = registration.payable;

      if (registration.userId === '68001a76c128edc088bbf112') {
        // OC Team Participants
        stats.ocTeam.totalParticipants += numOfParticipants;
        stats.ocTeam.totalRegistrations += 1;
        stats.ocTeam.totalPayableAmount += payable;
      } else if (registration.userId === '680745d77903a2355042c655') {
        // University Participants (Non-OC)
        stats.universityNonOC.totalParticipants += numOfParticipants;
        stats.universityNonOC.totalRegistrations += 1;
        stats.universityNonOC.totalPayableAmount += payable;
      } else {
        // Outsiders
        stats.outsiders.totalParticipants += numOfParticipants;
        stats.outsiders.totalRegistrations += 1;
        stats.outsiders.totalPayableAmount += payable;
      }
    }

    // Send the response
    res.json({
      totalParticipants: participants.length,
      totalRegistrations: registrations.length,
      totalPayableAmount: registrations.reduce(
        (sum, registration) => sum + registration.payable,
        0
      ),
      segregatedStats: stats,
    });
  } catch (error) {
    console.error('Error during fetching statistics:', error);
    res.status(500).json({
      message: 'Error during fetching statistics.',
      error: error.message,
    });
  }
};

const createRegistrationAgent = async (req, res) => {
  const { name, email, password, contact, cnic, gender } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = new Agent({
      name,
      email,
      password: hashedPassword,
      contact,
      cnic,
      gender,
    });
    await agent.save();
    res.status(200).json({ message: 'Agent created successfully' });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Error creating agent', error });
  }
};

const detailedStatistics = async (req, res) => {
  try {
    // Fetch ambassador IDs, excluding the image field
    const ambassadors = await Ambassador.find(
      { campusName: 'Chiniot Faisalabad Campus' },
      { _id: 1 }
    );
    const ambassadorIds = ambassadors.map((amb) => amb._id.toString());

    // Calculate totals for external participants
    const externalRegistrations = await Registration.find({
      userId: { $nin: ambassadorIds },
    });
    const externalRegistrationIds = externalRegistrations.map((reg) =>
      reg._id.toString()
    );
    const externalInvoices = await Invoice.find({
      registrationId: { $in: externalRegistrationIds },
    });

    const totalExternalPayable = externalRegistrations.reduce(
      (acc, reg) => acc + reg.payable,
      0
    );
    const totalExternalRevenue = externalInvoices.reduce(
      (acc, inv) => acc + inv.amountPaid,
      0
    );
    const totalExternalDiscounts = externalInvoices.reduce(
      (acc, inv) => acc + inv.discount,
      0
    );

    // Calculate totals for ambassadors
    const ambassadorRegistrations = await Registration.find({
      userId: { $in: ambassadorIds },
    });
    const ambassadorRegistrationIds = ambassadorRegistrations.map((reg) =>
      reg._id.toString()
    );
    const ambassadorInvoices = await Invoice.find({
      registrationId: { $in: ambassadorRegistrationIds },
    });

    const totalAmbassadorPayable = ambassadorRegistrations.reduce(
      (acc, reg) => acc + reg.payable,
      0
    );
    const totalAmbassadorRevenue = ambassadorInvoices.reduce(
      (acc, inv) => acc + inv.amountPaid,
      0
    );
    const totalAmbassadorDiscounts = ambassadorInvoices.reduce(
      (acc, inv) => acc + inv.discount,
      0
    );

    // Prepare the response
    res.status(200).json({
      external: {
        totalPayable: totalExternalPayable,
        revenueGenerated: totalExternalRevenue,
        discountsGiven: totalExternalDiscounts,
      },
      ambassadors: {
        totalPayable: totalAmbassadorPayable,
        revenueGenerated: totalAmbassadorRevenue,
        discountsGiven: totalAmbassadorDiscounts,
      },
    });
  } catch (error) {
    console.error('Failed to retrieve statistics:', error);
    res
      .status(500)
      .send('Failed to retrieve statistics due to an internal error.');
  }
};

// EVENT controller
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update event by ID
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete event by ID
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle event status (active/inactive)
const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Toggle status
    event.status = event.status === 'active' ? 'inactive' : 'active';
    await event.save();

    // Return the updated event
    res.status(200).json({
      success: true,
      data: event,
      message: `Event status changed to ${event.status}`,
    });
  } catch (error) {
    console.error('Error toggling event status:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get events by status
const getEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either active or inactive',
      });
    }

    const events = await Event.find({ status });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  login,
  updateGuideBook,
  upload,
  uploadEvent,
  getEvents,
  getEventById,
  getCategories,
  getEventsByCategory,
  getStatistics,
  createRegistrationAgent,
  detailedStatistics,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  getEventsByStatus,
};
