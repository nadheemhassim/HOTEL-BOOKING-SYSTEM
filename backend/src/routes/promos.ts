import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getPromos,
  getAllPromos,
  createPromo,
  updatePromo,
  deletePromo
} from '../controllers/promoController';

const router = express.Router();

// Public routes
router.get('/', getPromos);

// Protected routes
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/all', getAllPromos);
router.post('/', createPromo);
router.put('/:id', updatePromo);
router.delete('/:id', deletePromo);

export default router; 