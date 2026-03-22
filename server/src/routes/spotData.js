import express from 'express';
import { getSpotTypes, createSpot } from '../controllers/spotDataController.js';
import { getMap, getSpotMedia } from '../controllers/mapDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/spot-type', requireAuth, getSpotTypes);
router.get('/get-map', requireAuth, getMap);
router.post('/get-spot-media', requireAuth, getSpotMedia);
router.post('/create-spot', upload.array('spotMedia', 8), requireAuth, createSpot);


export default router;