import express from 'express';
import { getDashboard } from '../controllers/userDataController.js';

const router = express.Router();

router.get('/dashboard-data', getDashboard);

export default router;