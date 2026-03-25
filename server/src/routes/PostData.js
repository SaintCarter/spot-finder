import express from 'express';
import { createPost } from '../controllers/postDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create-post', upload.array('spotMedia', 8), requireAuth, createPost);


export default router;