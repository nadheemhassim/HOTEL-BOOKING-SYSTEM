import mongoose from 'mongoose';

export enum RoomType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  SUITE = 'SUITE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  RESERVED = 'RESERVED'
}

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a room name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add room capacity']
  },
  amenities: {
    type: [String],
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true
  },
  roomType: {
    type: String,
    enum: Object.values(RoomType),
    required: [true, 'Please specify room type']
  },
  status: {
    type: String,
    enum: Object.values(RoomStatus),
    default: RoomStatus.AVAILABLE
  },
  currentBooking: {
    checkIn: Date,
    checkOut: Date,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  },
  lastCleaned: {
    type: Date,
    default: Date.now
  },
  maintenanceHistory: [{
    date: Date,
    description: String,
    resolvedDate: Date
  }]
}, {
  timestamps: true
});

export default mongoose.model('Room', RoomSchema);
