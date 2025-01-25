export type BookingStatus = 'pending' | 'accepted' | 'awaiting_confirmation' | 'confirmed' | 'cancelled';

export interface Booking {
  _id: string;
  room: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  user: {
    name?: string;
    email?: string;
  } | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
} 