import express from 'express';
import { getDashboard, createAccount, getSettings } from '../controllers/userDataController.js';
import { addBoardCheck, addBoard} from '../controllers/userSettingsController.js';
import { requireAuth } from '../middleware/authCheck.js';
import checkUniqueLogin  from '../middleware/checkUnique.js';
import removeBg  from '../middleware/removeBg.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/dashboard-data', requireAuth, getDashboard);
router.post('/create-account', checkUniqueLogin, createAccount);
router.get('/settings', requireAuth, getSettings);
router.post('/add-board-check', upload.single('boardImage'), requireAuth, removeBg, addBoardCheck);
router.post('/add-board', requireAuth, addBoard);

export default router;