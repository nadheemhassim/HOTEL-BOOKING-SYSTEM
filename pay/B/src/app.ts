import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error';
import roomRoutes from './routes/rooms';
import authRoutes from './routes/auth';
import connectDB from './config/database';
import bookingRoutes from './routes/bookings';
import promoRoutes from './routes/promos';
import testimonialRoutes from './routes/testimonials';
import serviceRoutes from './routes/services';
import staffRoutes from './routes/staff';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);

app.use(errorHandler);

export default app; 