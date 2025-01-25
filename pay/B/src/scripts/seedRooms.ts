import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room';
import { RoomStatus, RoomType } from '../models/Room';

dotenv.config();

const sampleRooms = [
  {
    name: "Royal Ocean Suite",
    description: "Experience ultimate luxury in our flagship suite featuring panoramic ocean views, private terrace, and exclusive butler service.",
    price: 850,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Parking", "Mini Bar", "Room Service"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39"
    ],
    isAvailable: true,
    roomNumber: "PH01",
    roomType: RoomType.SUITE,
    status: RoomStatus.AVAILABLE,
    lastCleaned: new Date(),
    maintenanceHistory: []
  },
  {
    name: "Premium Mountain View",
    description: "Luxurious room with breathtaking mountain views, featuring modern amenities and elegant décor.",
    price: 450,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Mini Bar"],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      "https://images.unsplash.com/photo-1574643156929-51fa098b0394"
    ],
    isAvailable: true,
    roomNumber: "501",
    roomType: RoomType.PREMIUM,
    status: RoomStatus.CLEANING,
    lastCleaned: new Date(Date.now() - 24 * 60 * 60 * 1000),
    maintenanceHistory: []
  },
  {
    name: "Deluxe Garden Suite",
    description: "Spacious suite with private garden access, perfect for families or extended stays.",
    price: 650,
    capacity: 4,
    amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Parking", "Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
    ],
    isAvailable: true,
    roomNumber: "GS01",
    roomType: RoomType.SUITE,
    status: RoomStatus.AVAILABLE,
    lastCleaned: new Date(),
    maintenanceHistory: []
  },
  {
    name: "Classic City View",
    description: "Comfortable room with city skyline views and essential amenities for a pleasant stay.",
    price: 250,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Bathroom"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658"
    ],
    isAvailable: true,
    roomNumber: "301",
    roomType: RoomType.STANDARD,
    status: RoomStatus.AVAILABLE,
    lastCleaned: new Date(),
    maintenanceHistory: []
  },
  {
    name: "Executive Business Suite",
    description: "Perfect for business travelers, featuring a work area and premium amenities.",
    price: 550,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Coffee Maker", "Bathroom", "Work Desk", "Mini Bar"],
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      "https://images.unsplash.com/photo-1587985064135-0366536eab42"
    ],
    isAvailable: true,
    roomNumber: "601",
    roomType: RoomType.PREMIUM,
    status: RoomStatus.RESERVED,
    currentBooking: {
      checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    lastCleaned: new Date(),
    maintenanceHistory: []
  },
  {
    name: "Family Comfort Suite",
    description: "Spacious suite with two bedrooms, perfect for family vacations.",
    price: 750,
    capacity: 6,
    amenities: ["WiFi", "TV", "AC", "Kitchen", "Bathroom", "Parking", "Washing Machine"],
    images: [
      "https://images.unsplash.com/photo-1576675784201-0e142b423952",
      "https://images.unsplash.com/photo-1576675784432-994941412b3d"
    ],
    isAvailable: true,
    roomNumber: "FS01",
    roomType: RoomType.SUITE,
    status: RoomStatus.AVAILABLE,
    lastCleaned: new Date(),
    maintenanceHistory: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB...');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms...');

    // Insert new rooms
    const rooms = await Room.insertMany(sampleRooms);
    console.log('Sample rooms inserted successfully:', rooms.length, 'rooms');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB(); 