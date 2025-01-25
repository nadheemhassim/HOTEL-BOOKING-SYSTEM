import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { getDashboardStats } from '../controllers/adminController';
import { UserRole } from '../models/User';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/stats', getDashboardStats);

export default router; 