import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
  isAvailable: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon name'],
    enum: ['bed', 'utensils', 'activity', 'car', 'home', 'headphones'],
    default: 'bed'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: String,
    required: [true, 'Please specify duration']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['spa', 'dining', 'activities', 'transport', 'housekeeping', 'concierge']
  }
}, {
  timestamps: true
});

export default mongoose.model<IService>('Service', ServiceSchema); 