import { Request, Response } from 'express';
import Room from '../models/Room';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { getIO } from '../config/socket';
import Booking from '../models/Booking';


export const getAllRooms = asyncHandler(async (req: Request, res: Response) => {
  const rooms = await Room.find();
  res.status(200).json({ success: true, data: rooms });
});

export const getRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    throw new ErrorResponse(`Room not found with id of ${req.params.id}`, 404);
  }
  res.status(200).json({ success: true, data: room });
});

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
  if (existingRoom) {
    return res.status(409).json({
      success: false,
      message: 'A room with this room number already exists'
    });
  }

  const requiredFields = ['name', 'roomNumber', 'price', 'capacity', 'description'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      });
    }
  }

  if (req.body.price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be greater than 0'
    });
  }

  if (req.body.capacity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Capacity must be greater than 0'
    });
  }

  const room = await Room.create(req.body);

  getIO().emit('roomCreated', room);

  res.status(201).json({
    success: true,
    data: room,
    message: 'Room created successfully'
  });
});

export const seedRooms = asyncHandler(async (req: Request, res: Response) => {
  const sampleRooms = [
    {
      name: "Deluxe Ocean View Suite",
      description: "Luxurious suite with panoramic ocean views, king-size bed, and private balcony",
      price: 450,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      isAvailable: true,
      roomNumber: "501",
      roomType: "SUITE"
    },
    {
      name: "Premium Mountain View Room",
      description: "Spacious room featuring stunning mountain views and modern amenities",
      price: 350,
      capacity: 3,
      amenities: ["WiFi", "TV", "AC", "Bathroom", "Coffee Maker"],
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      isAvailable: true,
      roomNumber: "402",
      roomType: "PREMIUM"
    },
    {
      name: "Family Suite",
      description: "Perfect for families, featuring two bedrooms and a spacious living area",
      price: 550,
      capacity: 4,
      amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        "https://images.unsplash.com/photo-1574643156929-51fa098b0394"
      ],
      isAvailable: true,
      roomNumber: "601",
      roomType: "SUITE"
    },
    {
      name: "Standard Double Room",
      description: "Comfortable room with essential amenities for a pleasant stay",
      price: 250,
      capacity: 2,
      amenities: ["WiFi", "TV", "AC", "Bathroom"],
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
        "https://images.unsplash.com/photo-1631049552057-403cdb8f0658"
      ],
      isAvailable: true,
      roomNumber: "301",
      roomType: "STANDARD"
    }
  ];

  await Room.deleteMany({});
  
  // Insert sample rooms
  const rooms = await Room.insertMany(sampleRooms);
  
  res.status(201).json({
    success: true,
    data: rooms,
    message: 'Sample rooms data seeded successfully'
  });
});

export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!room) {
    throw new ErrorResponse(`Room not found with id of ${req.params.id}`, 404);
  }

  const totalRooms = await Room.countDocuments();
  const bookedRooms = await Booking.distinct('room', {
    status: 'confirmed',
    checkOut: { $gte: new Date() },
    checkIn: { $lte: new Date() }
  });

  const availableRooms = totalRooms - bookedRooms.length;

  const io = getIO();
  io.emit('roomUpdated', {
    room,
    availableRooms,
    totalRooms,
    occupancyRate: ((bookedRooms.length / totalRooms) * 100).toFixed(1)
  });

  res.status(200).json({
    success: true,
    data: room,
    message: 'Room updated successfully'
  });
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    getIO().emit('roomDeleted', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room'
    });
  }
});

export const getRoomStats = asyncHandler(async (req: Request, res: Response) => {
  const totalRooms = await Room.countDocuments();
  const bookedRooms = await Booking.distinct('room', {
    status: 'confirmed',
    checkOut: { $gte: new Date() },
    checkIn: { $lte: new Date() }
  });

  const availableRooms = totalRooms - bookedRooms.length;

  res.status(200).json({
    success: true,
    totalRooms,
    availableRooms,
    occupancyRate: ((bookedRooms.length / totalRooms) * 100).toFixed(1)
  });
});
