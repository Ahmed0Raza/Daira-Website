import express from 'express';
import {
  signup,
  login,
  verifyToken,
  ambassadorsignup,
  ambassadorlogin,
  forgetPassword,
  verifyOTP,
} from '../controllers/auth-controller.js';
import {
  verifyEmail,
  verifyAmbasEmail,
} from '../controllers/verification-controller.js';

const router = express.Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/verifyToken', verifyToken);

router.post('/amabsignup', ambassadorsignup);
router.post('/forgetpass', forgetPassword);
router.post('/verifyotp', verifyOTP);

router.post('/amablogin', ambassadorlogin);
router.get('/amabverify', verifyAmbasEmail);

export default router;
