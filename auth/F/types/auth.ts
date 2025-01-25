export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    users: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  }
} 