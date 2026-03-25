import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userDataRoutes from './routes/userData.js';
import spotDataRoutes from './routes/spotData.js';
import postDataRoutes from './routes/postData.js';
import logHeaderInfo from './middleware/logHeaders.js';
import cookieParser from 'cookie-parser';

dotenv.config();

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
app.use('/api/spotData', spotDataRoutes); 
app.use('/api/postData', postDataRoutes); 

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});