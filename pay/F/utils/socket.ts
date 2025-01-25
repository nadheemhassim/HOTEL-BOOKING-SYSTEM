import { io } from 'socket.io-client';

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

let activeConnections = 0;

// Connect socket
export const connectSocket = (): void => {
  activeConnections++;
  if (!socket.connected) {
    socket.connect();
    console.log('Socket connected');
  }
};

// Disconnect socket
export const disconnectSocket = (): void => {
  activeConnections--;
  if (activeConnections === 0 && socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
};

// Socket event listeners
socket.on('connect', () => {
  console.log('Socket connected');
  reconnectAttempts = 0;
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error: Error) => {
  console.error('Socket connection error:', error);
  reconnectAttempts++;
  
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('Max reconnection attempts reached');
    socket.disconnect();
  }
});

// Testimonial events
interface TestimonialData {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  isApproved: boolean;
}

socket.on('testimonialUpdated', (data: TestimonialData) => {
  console.log('Socket: testimonial updated', data);
});

socket.on('testimonialDeleted', (id: string) => {
  console.log('Socket: testimonial deleted', id);
});

socket.on('testimonialCreated', (data: TestimonialData) => {
  console.log('Socket: new testimonial created', data);
});

// Service events
interface ServiceData {
  _id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
  isAvailable: boolean;
  category: string;
}

socket.on('serviceUpdated', (data: ServiceData) => {
  console.log('Socket: service updated', data);
});

socket.on('serviceDeleted', (id: string) => {
  console.log('Socket: service deleted', id);
});

socket.on('serviceCreated', (data: ServiceData) => {
  console.log('Socket: new service created', data);
});

// Add staff event interfaces
interface StaffData {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
}

// Add staff event listeners
socket.on('staffUpdated', (data: StaffData) => {
  console.log('Socket: staff updated', data);
});

socket.on('staffDeleted', (id: string) => {
  console.log('Socket: staff deleted', id);
});

socket.on('staffCreated', (data: StaffData) => {
  console.log('Socket: new staff created', data);
});

export { socket }; 