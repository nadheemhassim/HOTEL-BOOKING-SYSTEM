export enum StaffDepartment {
  MANAGEMENT = 'management',
  HOUSEKEEPING = 'housekeeping',
  RECEPTION = 'reception',
  RESTAURANT = 'restaurant',
  MAINTENANCE = 'maintenance'
}

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: StaffDepartment;
  position: string;
  image: string;
  joinDate: string;
  schedule: {
    workDays: string[];
    shifts: string[];
  };
  isActive: boolean;
  createdAt: string;
} 