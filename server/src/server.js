import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userDataRoutes from './routes/userData.js';
import logHeaderInfo from './middleware/logHeaders.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.client,
  credentials: true 
}));

//custom middleware
app.use(logHeaderInfo);

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/userData', userDataRoutes); 
// Note: This makes the full path: /api/auth/login and /api/userData/dashboard-data

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});