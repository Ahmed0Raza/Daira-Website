import express from 'express';
import { login } from '../controllers/invitations-controller.js';
import { isInvitations } from '../middlewares/auth.js';
const router = express.Router();

router.post('/login', login);
router.get('/', isInvitations, (req, res) => {
  res.send('Invitations Route');
});

export default router;
