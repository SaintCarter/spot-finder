import express from 'express';
import { getDashboard, createAccount, getSettings } from '../controllers/userDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import checkUniqueLogin  from '../middleware/checkUnique.js';
import removeBg  from '../middleware/removeBg.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/dashboard-data', requireAuth, getDashboard);
router.post('/create-account', upload.single('boardImage'), checkUniqueLogin, removeBg, createAccount);
router.get('/settings', requireAuth, getSettings);


export default router;