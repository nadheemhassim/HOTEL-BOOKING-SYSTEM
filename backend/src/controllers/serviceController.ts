import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import Service from '../models/Service';
import { getIO } from '../config/socket';
import ErrorResponse from '../utils/errorResponse';

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find({ isAvailable: true }).sort('-createdAt');
  res.status(200).json({ success: true, data: services });
});

export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find().sort('-createdAt');
  res.status(200).json({ success: true, data: services });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    
    getIO().emit('serviceCreated', service);
    
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    throw new ErrorResponse('Failed to create service', 500);
  }
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new ErrorResponse('Service not found', 404);
    }

    getIO().emit('serviceUpdated', service);

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    throw new ErrorResponse('Failed to update service', 500);
  }
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  getIO().emit('serviceDeleted', req.params.id);

  res.status(200).json({ success: true, data: {} });
}); 