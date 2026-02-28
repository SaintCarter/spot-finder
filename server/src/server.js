import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userDataRoutes from './routes/userData.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: process.env.client || 'http://localhost:5173', 
  credentials: true 
}));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/userData', userDataRoutes); 
// Note: This makes the full path: /api/auth/login and /api/userData/dashboard-data

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});