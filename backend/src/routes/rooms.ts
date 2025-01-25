import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  seedRooms,
  getRoomStats
} from '../controllers/roomController';

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoom);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.post('/seed', seedRooms);
router.get('/stats', protect, authorize(UserRole.ADMIN), getRoomStats);

export default router; 