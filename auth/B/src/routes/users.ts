import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} from '../controllers/userController';

const router = express.Router();

// Protect all routes and allow only admin
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', updateUserRole);

export default router; 