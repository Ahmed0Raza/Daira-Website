import express from 'express';
import {
  registerAmbassador,
  getAmbassadors,
  getAmbassador,
  approveAmbassador,
  verifyToken,
  AmbassadorSignup,
  updateAmbassadorNomination,
  getActiveAmbassadors,
} from '../controllers/ambassador-nomination-controller.js';
import { isAdminOrInvitation } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', registerAmbassador);
router.get('/', getAmbassadors);
router.get('/getAmbassador/:id', getAmbassador);
router.post('/approve', isAdminOrInvitation, approveAmbassador);
router.get('/verify', verifyToken);
router.post('/ambassadorSignup', AmbassadorSignup);
router.put('/update/:id', isAdminOrInvitation, updateAmbassadorNomination);
router.get('/activeAmbassadors', getActiveAmbassadors);

export default router;
