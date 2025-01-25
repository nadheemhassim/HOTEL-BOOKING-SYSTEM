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

export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  roomNumber: string;
  roomType: RoomType;
  status: RoomStatus;
  isAvailable: boolean;
  lastCleaned: string;
}

export interface RoomFormData {
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  roomNumber: string;
  roomType: RoomType;
  status: RoomStatus;
  isAvailable: boolean;
  lastCleaned: string;
} 