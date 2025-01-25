import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getTestimonials,
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial
} from '../controllers/testimonialController';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes
router.use(protect);
router.post('/', addTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/approve', protect, authorize(UserRole.ADMIN), approveTestimonial);

// Admin only routes
router.use(authorize(UserRole.ADMIN));
router.get('/all', getAllTestimonials);

export default router; 