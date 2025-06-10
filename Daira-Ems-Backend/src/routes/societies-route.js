import express from 'express';
import {
  login,
  getRegistrationsBySociety,
  verifyToken,
  getParticipantsEventWise,
  getAccomodationCount,
  getParticipantsDetails,
  getUnRegisteredParticipants,
} from '../controllers/society-controller.js';
import { isPresident } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/registration-statistics', isPresident, getRegistrationsBySociety);
router.get('/participants', isPresident, getParticipantsEventWise);
router.get('/verify', verifyToken);
router.get('/accomodation', isPresident, getAccomodationCount);
router.get('/getparticipantsdetails', isPresident, getParticipantsDetails);
router.get(
  '/get-unregistered-participants',
  isPresident,
  getUnRegisteredParticipants
);

export default router;
