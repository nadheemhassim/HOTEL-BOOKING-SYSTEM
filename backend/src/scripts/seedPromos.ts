import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Promo from '../models/Promo';

dotenv.config();

const samplePromos = [
  {
    title: "Early Bird Special",
    subtitle: "20% off for this week",
    description: "Get 20% off on all room bookings this week. Offer valid for a limited time only!",
    perks: ["Free breakfast", "Late checkout", "Complimentary Wi-Fi"],
    discount: "20%",
    validUntil: new Date("2024-12-27"),
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80",
    code: "EARLYBIRD20",
    featured: true,
    isActive: true
  },
  {
    title: "Weekend Getaway Deal",
    subtitle: "Save 25% on weekends",
    description: "Enjoy a relaxing weekend with a 25% discount on all our deluxe rooms.",
    perks: ["Access to spa facilities", "Welcome drink", "Late-night room service"],
    discount: "25%",
    validUntil: new Date("2024-12-31"),
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80",
    code: "WEEKEND25",
    featured: false,
    isActive: true
  },
  {
    title: "Festive Season Offer",
    subtitle: "30% off during the holidays",
    description: "Celebrate the festive season with exclusive discounts on your stay.",
    perks: ["Complimentary dinner", "Holiday-themed decorations", "Special gift hamper"],
    discount: "30%",
    validUntil: new Date("2025-01-05"),
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
    code: "FESTIVE30",
    featured: true,
    isActive: true
  }
];

const seedPromos = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB...');

    // Delete existing promos
    await Promo.deleteMany({});
    console.log('Existing promos deleted...');

    // Insert new promos
    const promos = await Promo.insertMany(samplePromos);
    console.log(`${promos.length} promos inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding promos:', error);
    process.exit(1);
  }
};

seedPromos(); 