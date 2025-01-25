import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import Testimonial from '../models/Testimonial';
import { getIO } from '../config/socket';
import { AuthRequest } from '../types/auth';

export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const testimonials = await Testimonial.find({ isApproved: true })
    .sort('-createdAt')
    .select('_id userId userName userImage rating review createdAt')
    .populate('userId', '_id name image');
  
  const formattedTestimonials = testimonials.map(testimonial => ({
    _id: testimonial._id,
    userId: testimonial.userId._id.toString(),
    userName: testimonial.userName,
    userImage: testimonial.userImage,
    rating: testimonial.rating,
    review: testimonial.review,
    createdAt: testimonial.createdAt
  }));

  res.status(200).json({ success: true, data: formattedTestimonials });
});

export const getAllTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const testimonials = await Testimonial.find()
    .sort('-createdAt')
    .populate('userId', 'name image');
  res.status(200).json({ success: true, data: testimonials });
});

export const addTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  req.body.userId = req.user._id;
  req.body.userName = req.user.name;
  
  const testimonial = await Testimonial.create(req.body);

  const populatedTestimonial = await Testimonial.findById(testimonial._id)
    .populate('userId', 'name image');

  if (!populatedTestimonial) {
    return res.status(500).json({
      success: false,
      message: 'Error creating testimonial'
    });
  }
  
  const io = getIO();
  io.emit('testimonialCreated', {
    ...populatedTestimonial.toObject(),
    isApproved: false
  });
  
  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  if (testimonial.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
  }

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    {
      rating: req.body.rating,
      review: req.body.review
    },
    { new: true, runValidators: true }
  );

  getIO().emit('testimonialUpdated', updatedTestimonial);

  res.status(200).json({ success: true, data: updatedTestimonial });
});

export const deleteTestimonial = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  if (testimonial.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
  }

  await testimonial.deleteOne();

  getIO().emit('testimonialDeleted', req.params.id);

  res.status(200).json({ success: true, data: {} });
});


export const approveTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  ).populate('userId', 'name image');

  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  getIO().emit('testimonialUpdated', {
    ...testimonial.toObject(),
    userId: testimonial.userId._id,
    isApproved: true
  });

  res.status(200).json({
    success: true,
    data: testimonial
  });
}); 