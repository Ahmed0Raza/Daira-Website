import {
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
} from '../controllers/admin-controller.js';
import express from 'express';
import { isAdmin, isAdminOrInvitation } from '../middlewares/auth.js';
const router = express.Router();

// Public route - no auth required
router.post('/login', login);

// Protected routes - require admin authentication
router.get('/', isAdmin, (req, res) => {
  res.send('Admin Route');
});

router.post(
  '/updateGuideBook',
  isAdmin,
  upload.single('pdfFile'),
  updateGuideBook
);

router.post('/create-registration-agent', isAdmin, createRegistrationAgent);

router.post('/upload-event', isAdmin, upload.single('file'), uploadEvent);

router.get('/get-events', isAdmin, getEvents);

router.get('/get-event/:id', getEventById);

router.get('/get-categories',  getCategories);

router.get('/categories/:category', getEventsByCategory);

router.get('/statistics', isAdminOrInvitation, getStatistics);

router.get('/detailed-statistics', isAdmin, detailedStatistics);

router.get('/get-all-events', isAdmin, getAllEvents);

router.post('/create-event', isAdmin, createEvent);

router.patch('/update-event/:id', isAdmin, updateEvent);

router.delete('/delete-event/:id', isAdmin, deleteEvent);

router.patch('/toggle-event-status/:id', isAdmin, toggleEventStatus);

router.get('/get-event-status', isAdmin, getEventsByStatus);

export default router;
