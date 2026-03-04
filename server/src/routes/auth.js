import express from 'express';
import { login, logout } from '../controllers/authController.js';
import checkMaliciousLogin  from '../middleware/checkMalicious.js';
import { requireAuth } from '../middleware/authCheck.js';

const router = express.Router();

router.post('/login', checkMaliciousLogin, login);
router.get('/me', requireAuth, (req, res) => {
    res.status(200).json({ 
    message: "You are authenticated and can access this protected route!",
    user: req.user
    })
});
router.post('/logout', requireAuth, logout);


export default router;