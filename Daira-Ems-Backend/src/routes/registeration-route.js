import {
  getEventsByCategory,
  getEvents,
  getCategoies,
  addParticipant,
  getParticipantsByiD,
  registerTeam,
  deleteSingleParticipantByiD,
  getRegistrationsByUserId,
  deleteSpecificRegistrationANDteam,
  getEventsByName,
  getRegisterationInfo,
  getAmountPayable,
  generateInvoice,
  getDashboardStatistics,
  getParticipantsByDay,
  getAmbassadorStatistics,
} from '../controllers/registeration-controller.js';
import { isLogin, isAdminOrInvitation } from '../middlewares/auth.js';
import express from 'express';

const router = express.Router();

router.get('/', isLogin, (req, res) => {
  res.send('Event Route');
});
router.get('/event-categories', isLogin, getCategoies);
router.get('/events', isLogin, getEvents);
router.get('/events/:category', isLogin, getEventsByCategory);
router.get('/eventsdetails/:name', isLogin, getEventsByName);
router.post('/add-participant', addParticipant);
// /* New routes*/
// router.post('/add-participant', isLogin, addParticipant);
router.get('/participants/:id', isLogin, getParticipantsByiD);
router.post('/register-team', isLogin, registerTeam);
router.delete('/delete-participant/:id', isLogin, deleteSingleParticipantByiD);
router.get('/registrations/:userId', isLogin, getRegistrationsByUserId);
router.delete(
  '/delete-registration/:registrationId',
  isLogin,
  deleteSpecificRegistrationANDteam
);
router.get('/registration-info/:registrationId', isLogin, getRegisterationInfo);
router.get('/generate-invoice/:userId', generateInvoice);
router.post('/amount-payable', isLogin, getAmountPayable);
router.get('/dashboard-statistics/:userId', isLogin, getDashboardStatistics);
router.get('/participants-by-day/:userId', isLogin, getParticipantsByDay);
router.get(
  '/ambassador-statistics/:ambassadorId',
  isAdminOrInvitation,
  getAmbassadorStatistics
);

export default router;

// router.post('/create-team', isLogin, createTeam);
