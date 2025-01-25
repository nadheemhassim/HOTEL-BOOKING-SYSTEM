import mongoose, { Schema, Document } from 'mongoose';

export interface IPromo extends Document {
  title: string;
  subtitle: string;
  description: string;
  perks: string[];
  discount: string;
  validUntil: string;
  image: string;
  code: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a subtitle'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  perks: [{
    type: String,
    required: true
  }],
  discount: {
    type: String,
    required: [true, 'Please specify the discount']
  },
  validUntil: {
    type: Date,
    required: [true, 'Please specify validity date']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  code: {
    type: String,
    required: [true, 'Please add a promo code'],
    unique: true,
    uppercase: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPromo>('Promo', PromoSchema); 