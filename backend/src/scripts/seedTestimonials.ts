import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Testimonial from '../models/Testimonial';
import User from '../models/User';

dotenv.config();

const seedTestimonials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB...');

    const users = await User.find().limit(3);
    
    if (users.length < 3) {
      throw new Error('Not enough users in database. Please create some users first.');
    }

    const sampleTestimonials = [
      {
        userId: users[0]._id,
        userName: users[0].name,
        rating: 5,
        review: 'Amazing experience! The service was exceptional and the rooms were luxurious.',
        isApproved: true
      },
      {
        userId: users[1]._id,
        userName: users[1].name,
        rating: 4,
        review: 'Beautiful hotel with great amenities. Staff was very helpful.',
        isApproved: true
      },
      {
        userId: users[2]._id,
        userName: users[2].name,
        rating: 5,
        review: 'Perfect stay for our honeymoon. Will definitely come back!',
        isApproved: true
      }
    ];

    await Testimonial.deleteMany({});
    console.log('Existing testimonials deleted...');

    const testimonials = await Testimonial.insertMany(sampleTestimonials);
    console.log(`${testimonials.length} testimonials inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
};

seedTestimonials(); 