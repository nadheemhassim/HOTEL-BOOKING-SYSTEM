import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import Staff from '../models/Staff';
import ErrorResponse from '../utils/errorResponse';
import { getIO } from '../config/socket';

// Get all staff
export const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.find().sort('-createdAt');
  res.status(200).json({ success: true, data: staff });
});

// Create staff
export const createStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.create(req.body);
  
  // Emit socket event
  getIO().emit('staffCreated', staff);
  
  res.status(201).json({ success: true, data: staff });
});

// Update staff
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!staff) {
    throw new ErrorResponse(`Staff not found with id of ${req.params.id}`, 404);
  }

  // Emit socket event
  getIO().emit('staffUpdated', staff);

  res.status(200).json({ success: true, data: staff });
});

// Delete staff
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);

  if (!staff) {
    throw new ErrorResponse(`Staff not found with id of ${req.params.id}`, 404);
  }

  // Emit socket event
  getIO().emit('staffDeleted', req.params.id);

  res.status(200).json({ success: true, data: {} });
});

// Get active staff for public view
export const getActiveStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.find({ isActive: true })
    .select('-schedule')  // Exclude private info
    .sort('department');
  
  res.status(200).json({ success: true, data: staff });
}); 