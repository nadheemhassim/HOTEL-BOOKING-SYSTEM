import express, { Router, Request, Response, NextFunction } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import User, { UserRole } from '../models/User';
import { asyncHandler } from '../middleware/async';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/create-test-user', async (req, res, next) => {
  try {
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: UserRole.ADMIN
    });

    res.status(201).json({
      success: true,
      message: 'Test user created',
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

router.get('/users/count', protect, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const count = await User.countDocuments({ role: UserRole.CUSTOMER });
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', protect, authorize(UserRole.ADMIN), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/users/:id/role',
  protect,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;
    
    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  })
);

router.delete(
  '/users/:id',
  protect,
  authorize(UserRole.ADMIN),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

export default router;
