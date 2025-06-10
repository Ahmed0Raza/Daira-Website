import express from 'express';
import {
  login,
  verifyToken,
  getConfirmedAccommodations,
  getUnConfirmedAccommodations,
  // confirmAccommodationStatus,
} from '../controllers/accommodations-controller.js';
import { isAccommodations } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.get(
  '/confirm-accommodations',
  isAccommodations,
  getConfirmedAccommodations
);
router.get(
  '/unconfirm-accommodations',
  isAccommodations,
  getUnConfirmedAccommodations
);
// router.put(
//   '/confirm-accommodations-status',
//   isAccomodations,
//   confirmAccommodationStatus
// );
router.get('/verify', verifyToken);

export default router;
