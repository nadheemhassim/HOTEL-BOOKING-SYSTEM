import mongoose, { Schema, Document } from 'mongoose';

export enum StaffDepartment {
  MANAGEMENT = 'management',
  HOUSEKEEPING = 'housekeeping',
  RECEPTION = 'reception',
  RESTAURANT = 'restaurant',
  MAINTENANCE = 'maintenance'
}

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  department: StaffDepartment;
  position: string;
  image: string;
  joinDate: Date;
  schedule: {
    workDays: string[];
    shifts: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add staff name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  department: {
    type: String,
    enum: Object.values(StaffDepartment),
    required: [true, 'Please specify department']
  },
  position: {
    type: String,
    required: [true, 'Please add position']
  },
  image: {
    type: String,
    default: 'default-avatar.png'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  schedule: {
    workDays: [String],
    shifts: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IStaff>('Staff', StaffSchema); 