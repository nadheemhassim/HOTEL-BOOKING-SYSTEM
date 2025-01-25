import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service';

dotenv.config();

const sampleServices = [
  // Spa Services
  {
    title: "Royal Spa Package",
    description: "Ultimate luxury spa experience including massage, facial, and body treatments.",
    icon: "bed",
    price: 350,
    duration: "3 hours",
    isAvailable: true,
    category: "spa"
  },
  {
    title: "Couples Massage Retreat",
    description: "Romantic couples massage in our private suite with champagne service.",
    icon: "bed",
    price: 280,
    duration: "90 minutes",
    isAvailable: true,
    category: "spa"
  },

  // Dining Services
  {
    title: "Private Chef Experience",
    description: "Personalized fine dining experience with our executive chef in your suite.",
    icon: "utensils",
    price: 450,
    duration: "3 hours",
    isAvailable: true,
    category: "dining"
  },
  {
    title: "Sunset Wine & Dine",
    description: "Exclusive rooftop dining with premium wine pairing and ocean views.",
    icon: "utensils",
    price: 300,
    duration: "2.5 hours",
    isAvailable: true,
    category: "dining"
  },

  // Activities
  {
    title: "Private Yacht Tour",
    description: "Luxury yacht excursion with gourmet lunch and water activities.",
    icon: "activity",
    price: 800,
    duration: "6 hours",
    isAvailable: true,
    category: "activities"
  },
  {
    title: "Golf Course Package",
    description: "Premium golf experience with professional instructor and equipment.",
    icon: "activity",
    price: 400,
    duration: "4 hours",
    isAvailable: true,
    category: "activities"
  },

  // Transport Services
  {
    title: "Luxury Airport Transfer",
    description: "Premium car service with professional chauffeur and refreshments.",
    icon: "car",
    price: 150,
    duration: "Per trip",
    isAvailable: true,
    category: "transport"
  },
  {
    title: "Helicopter Tour",
    description: "Scenic helicopter tour of the city with champagne service.",
    icon: "car",
    price: 1200,
    duration: "1 hour",
    isAvailable: true,
    category: "transport"
  },

  // Housekeeping Services
  {
    title: "VIP Suite Preparation",
    description: "Luxury turndown service with premium amenities and aromatherapy.",
    icon: "home",
    price: 80,
    duration: "Daily",
    isAvailable: true,
    category: "housekeeping"
  },
  {
    title: "Express Luxury Laundry",
    description: "Premium garment care with 3-hour express service.",
    icon: "home",
    price: 100,
    duration: "3 hours",
    isAvailable: true,
    category: "housekeeping"
  },

  // Concierge Services
  {
    title: "24/7 Personal Butler",
    description: "Dedicated butler service for the ultimate luxury experience.",
    icon: "headphones",
    price: 500,
    duration: "24 hours",
    isAvailable: true,
    category: "concierge"
  },
  {
    title: "VIP Event Access",
    description: "Exclusive access to local events and premium venue reservations.",
    icon: "headphones",
    price: 200,
    duration: "Per event",
    isAvailable: true,
    category: "concierge"
  }
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB...');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services...');

    // Insert new services
    const services = await Service.insertMany(sampleServices);
    console.log(`${services.length} services inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

seedServices(); 