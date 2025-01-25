export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
  isAvailable: boolean;
  category: 'spa' | 'dining' | 'activities' | 'transport' | 'housekeeping' | 'concierge';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
  isAvailable: boolean;
  category: 'spa' | 'dining' | 'activities' | 'transport' | 'housekeeping' | 'concierge';
} 