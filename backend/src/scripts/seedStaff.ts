import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff, { StaffDepartment } from '../models/Staff';

dotenv.config();

const sampleStaff = [
  {
    name: 'Nadeem',
    email: 'nadeem@example.com',
    phone: '+94 71 234 5678',
    department: StaffDepartment.MANAGEMENT,
    position: 'Hotel Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['9:00 AM - 6:00 PM']
    },
    isActive: true
  },
  {
    name: 'Nihidu',
    email: 'nihidu@example.com', 
    phone: '+94 72 345 6789',
    department: StaffDepartment.RECEPTION,
    position: 'Front Desk Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['8:00 AM - 4:00 PM']
    },
    isActive: true
  },
  {
    name: 'Selith',
    email: 'selith@example.com',
    phone: '+94 73 456 7890',
    department: StaffDepartment.HOUSEKEEPING,
    position: 'Housekeeping Supervisor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['7:00 AM - 3:00 PM']
    },
    isActive: true
  },
  {
    name: 'Sadali',
    email: 'sadali@example.com',
    phone: '+94 74 567 8901',
    department: StaffDepartment.RESTAURANT,
    position: 'Restaurant Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    schedule: {
      workDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shifts: ['2:00 PM - 10:00 PM']
    },
    isActive: true
  },
  {
    name: 'Sandumini',
    email: 'sandumini@example.com',
    phone: '+94 75 678 9012',
    department: StaffDepartment.MAINTENANCE,
    position: 'Maintenance Supervisor',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['9:00 AM - 5:00 PM']
    },
    isActive: true
  },
  {
    name: 'Thiranya',
    email: 'hiranya@example.com',
    phone: '+94 76 789 0123',
    department: StaffDepartment.MANAGEMENT,
    position: 'Assistant Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['9:00 AM - 6:00 PM']
    },
    isActive: true
  },
  {
    name: 'Hirushi',
    email: 'hirushi@example.com',
    phone: '+94 77 890 1234',
    department: StaffDepartment.RECEPTION,
    position: 'Front Desk Supervisor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['8:00 AM - 4:00 PM']
    },
    isActive: true
  },
  {
    name: 'Sithara',
    email: 'sithara@example.com',
    phone: '+94 78 901 2345',
    department: StaffDepartment.HOUSEKEEPING,
    position: 'Housekeeping Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    schedule: {
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shifts: ['7:00 AM - 3:00 PM']
    },
    isActive: true
  }
];

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB...');

    await Staff.deleteMany({});
    console.log('Cleared existing staff data...');

    const staff = await Staff.insertMany(sampleStaff);
    console.log(`${staff.length} staff members inserted successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding staff:', error);
    process.exit(1);
  }
};

seedStaff();