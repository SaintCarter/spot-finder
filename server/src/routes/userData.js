import express from 'express';
import { getDashboard, createAccount, getSettings } from '../controllers/userDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import checkUniqueLogin  from '../middleware/checkUnique.js';
import checkMaliciousLogin  from '../middleware/checkMalicious.js';


const router = express.Router();

router.get('/dashboard-data', requireAuth, getDashboard);
router.post('/create-account', checkMaliciousLogin, checkUniqueLogin, createAccount);
router.get('/settings', requireAuth, getSettings);


export default router;