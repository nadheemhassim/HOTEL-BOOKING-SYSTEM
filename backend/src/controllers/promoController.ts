import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import Promo from '../models/Promo';
import { getIO } from '../config/socket';

export const getPromos = asyncHandler(async (req: Request, res: Response) => {
  const promos = await Promo.find({ isActive: true }).sort('-createdAt');
  res.status(200).json({ success: true, data: promos });
});

export const getAllPromos = asyncHandler(async (req: Request, res: Response) => {
  const promos = await Promo.find().sort('-createdAt');
  res.status(200).json({ success: true, data: promos });
});

export const createPromo = asyncHandler(async (req: Request, res: Response) => {
  const promo = await Promo.create(req.body);

  getIO().emit('promoCreated', promo);
  
  res.status(201).json({ success: true, data: promo });
});

export const updatePromo = asyncHandler(async (req: Request, res: Response) => {
  const promo = await Promo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!promo) {
    return res.status(404).json({ success: false, message: 'Promo not found' });
  }

  getIO().emit('promoUpdated', promo);

  res.status(200).json({ success: true, data: promo });
});

export const deletePromo = asyncHandler(async (req: Request, res: Response) => {
  const promo = await Promo.findByIdAndDelete(req.params.id);

  if (!promo) {
    return res.status(404).json({ success: false, message: 'Promo not found' });
  }

  getIO().emit('promoDeleted', req.params.id);

  res.status(200).json({ success: true, data: {} });
}); 