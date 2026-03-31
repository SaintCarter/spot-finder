import express from 'express';
import { createPost, getPosts, getPostDetails, getSpotPosts } from '../controllers/postDataController.js';
import { requireAuth } from '../middleware/authCheck.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create-post', upload.array('spotMedia', 8), requireAuth, createPost);
router.get('/posts', requireAuth, getPosts);
router.post('/post-details', requireAuth, getPostDetails);
router.post('/get-spot-posts', requireAuth, getSpotPosts);


export default router;