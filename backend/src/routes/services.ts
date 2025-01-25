import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getServices,
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Protected routes
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/all', getAllServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router; 