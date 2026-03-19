import express from 'express';
import { getSpotTypes, createSpot } from '../controllers/spotDataController.js';
import { getMap } from '../controllers/mapDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/spot-type', requireAuth, getSpotTypes);
router.get('/get-map', requireAuth, getMap);
router.post('/create-spot', upload.single('spotMedia'), requireAuth, createSpot);


export default router;