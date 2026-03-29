import express from 'express';
import { getSpotTypes, createSpot, insertRating, getRatings, checkUniqueRating, updateRating } from '../controllers/spotDataController.js';
import { getMap, getSpotMedia } from '../controllers/mapDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/spot-type', requireAuth, getSpotTypes);
router.get('/get-map', requireAuth, getMap);
router.post('/get-spot-media', requireAuth, getSpotMedia);
router.post('/create-spot', upload.array('spotMedia', 8), requireAuth, createSpot);
router.post('/rate', requireAuth, insertRating);
router.post('/get-ratings', requireAuth, getRatings);
router.post('/update-rating', requireAuth, updateRating);
router.post('/check-rating', requireAuth, checkUniqueRating);



export default router;