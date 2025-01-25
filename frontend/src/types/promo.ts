export interface Promo {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  perks: string[];
  discount: string;
  validUntil: string;
  image: string;
  fallbackImage?: string;
  code: string;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoFormData {
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
} 