import express from 'express';
import {
  getAmbassadors,
  getAmbassador,
  getRegistrationStats,
  getAmbassadorParticipants,
} from '../controllers/ambassador-controller.js';
import { isAdmin, isAdminOrInvitation } from '../middlewares/auth.js';
const router = express.Router();

router.get('/ambassadors', isAdminOrInvitation, getAmbassadors);
router.get(
  '/getAmbassadorParticipants',
  isAdminOrInvitation,
  getAmbassadorParticipants
);
router.get('/ambassador/:id', isAdmin, getAmbassador);

export default router;

// router.get('/registrationStats/:userId', getRegistrationStats);
