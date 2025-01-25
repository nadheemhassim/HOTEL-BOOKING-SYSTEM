import express from 'express';
import { protect } from '../middleware/auth';
import {
  createBooking,
  checkAvailability,
  getRoomBookedDates,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  handlePayment,
  confirmPayment,
  getBookingStats
} from '../controllers/bookingController';
import { authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Protect all booking routes
router.use(protect);

router.post('/', createBooking);
router.post('/check-availability', checkAvailability);
router.get('/room/:roomId/dates', getRoomBookedDates);
router.patch('/:id/confirm', confirmBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);
router.get('/all', protect, authorize(UserRole.ADMIN), getAllBookings);
router.patch('/:id/pay', protect, handlePayment);
router.patch('/:id/confirm-payment', protect, authorize(UserRole.ADMIN), confirmPayment);
router.get('/stats', protect, authorize(UserRole.ADMIN), getBookingStats);

export default router; 