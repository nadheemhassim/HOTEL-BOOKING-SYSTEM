import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userImage?: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImage: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    minlength: [10, 'Review must be at least 10 characters long'],
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema); 