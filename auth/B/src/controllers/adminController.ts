import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Room from '../models/Room';
import Booking from '../models/Booking';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all stats
    const [totalUsers, totalRooms, totalBookings, recentBookings, revenueData] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Room.countDocuments(),
      Booking.countDocuments(),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .populate('room', 'name price'),
      Booking.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        totalBookings,
        totalRevenue: revenueData[0]?.total || 0,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
}; 