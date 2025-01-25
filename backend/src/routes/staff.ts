import express from 'express';
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getActiveStaff
} from '../controllers/staffController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/active', getActiveStaff);

router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.route('/')
  .get(getAllStaff)
  .post(createStaff);

router.route('/:id')
  .put(updateStaff)
  .delete(deleteStaff);

export default router; 