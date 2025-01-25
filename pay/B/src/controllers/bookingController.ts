import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import Booking, { BookingStatus } from '../models/Booking';
import ErrorResponse from '../utils/errorResponse';
import Room from '../models/Room';
import { getIO } from '../config/socket';

export const getRoomBookedDates = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({
    room: req.params.roomId,
    status: BookingStatus.CONFIRMED,
    checkOut: { $gte: new Date() }
  });

  const bookedDates = bookings.map(booking => ({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut
  }));

  res.status(200).json({
    success: true,
    dates: bookedDates
  });
});

export const checkAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { roomId, checkIn, checkOut } = req.body;

  const conflictingBookings = await Booking.find({
    room: roomId,
    status: BookingStatus.CONFIRMED,
    $or: [
      {
        checkIn: { $lte: new Date(checkOut) },
        checkOut: { $gte: new Date(checkIn) }
      }
    ]
  });

  res.status(200).json({
    success: true,
    available: conflictingBookings.length === 0
  });
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { roomId, checkIn, checkOut, guests, totalAmount } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dates provided'
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const conflictingBookings = await Booking.find({
      room: roomId,
      status: BookingStatus.CONFIRMED,
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for selected dates'
      });
    }

    const booking = await Booking.create({
      user: req.user!.id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalAmount
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('room', 'name roomNumber price images');

    getIO().emit('bookingCreated', populatedBooking);

    setTimeout(async () => {
      const unconfirmedBooking = await Booking.findById(booking._id);
      if (unconfirmedBooking && unconfirmedBooking.status === BookingStatus.PENDING) {
        unconfirmedBooking.status = BookingStatus.CANCELLED;
        await unconfirmedBooking.save();
        
        getIO().emit('bookingUpdated', unconfirmedBooking);
      }
    }, 30 * 60 * 1000); // 30 minutes

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully. Please complete payment within 30 minutes.'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
});

export const confirmBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber price images');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.status !== BookingStatus.PENDING) {
    return res.status(400).json({
      success: false,
      message: 'Booking cannot be confirmed'
    });
  }

  booking.status = BookingStatus.ACCEPTED;
  await booking.save();

  const stats = await getDashboardStats();

  const io = getIO();
  io.emit('bookingUpdated', booking);
  io.emit('statsUpdated', stats);

  res.status(200).json({
    success: true,
    data: booking
  });
});

async function getDashboardStats() {
  const totalBookings = await Booking.countDocuments({
    status: { $in: ['confirmed', 'completed'] }
  });

  const revenueAggregation = await Booking.aggregate([
    {
      $match: {
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('room', 'name price');

  return {
    totalBookings,
    totalRevenue: revenueAggregation[0]?.totalRevenue || 0,
    recentBookings
  };
}

export const handlePayment = asyncHandler(async (req: Request, res: Response) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    return res.status(400).json({
      success: false,
      message: 'Booking is not ready for payment'
    });
  }

  booking.status = BookingStatus.AWAITING_CONFIRMATION;
  await booking.save();

  booking = await Booking.findById(booking._id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber price images');

  const stats = await getDashboardStats();
  
  const io = getIO();
  io.emit('bookingUpdated', booking);
  io.emit('statsUpdated', stats);

  res.status(200).json({
    success: true,
    data: booking
  });
});

export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber price images');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.status !== BookingStatus.AWAITING_CONFIRMATION) {
    return res.status(400).json({
      success: false,
      message: 'Booking is not awaiting payment confirmation'
    });
  }

  booking.status = BookingStatus.CONFIRMED;
  await booking.save();

  const stats = await getDashboardStats();
  
  const io = getIO();
  io.emit('bookingUpdated', booking);
  io.emit('statsUpdated', stats);

  res.status(200).json({
    success: true,
    data: booking
  });
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({ user: req.user!.id })
    .populate('room')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: bookings
  });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('room', 'name roomNumber price images');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (booking.user._id.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    });
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled'
    });
  }

  booking.status = BookingStatus.CANCELLED;
  await booking.save();

  getIO().emit('bookingUpdated', booking);

  res.status(200).json({
    success: true,
    data: booking
  });
});

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('room', 'name roomNumber price images')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: bookings
  });
});

export const getBookingStats = asyncHandler(async (req: Request, res: Response) => {
  const totalBookings = await Booking.countDocuments({
    status: { $in: ['confirmed', 'completed'] }
  });

  const revenueAggregation = await Booking.aggregate([
    {
      $match: {
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('room', 'name price');

  res.status(200).json({
    success: true,
    totalBookings,
    totalRevenue: revenueAggregation[0]?.totalRevenue || 0,
    recentBookings
  });
}); 