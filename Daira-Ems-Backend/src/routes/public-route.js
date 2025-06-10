import express from 'express';
import { getGuideBook } from '../controllers/public-controller.js';

const router = express.Router();

router.get('/get-guidebook', getGuideBook);

export default router;
