# 🔄 WebSocket Integration

## Event Types

### 🏨 Room Events
```typescript
// Listen for room updates
socket.on('roomUpdated', (room) => {
  // Handle room update
});

// Listen for new bookings
socket.on('bookingCreated', (booking) => {
  // Handle new booking
});
```

### 🔔 Notification Events
```typescript
// Listen for notifications
socket.on('notification', (notification) => {
  // Handle notification
});
```

## Implementation Example
```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  withCredentials: true
});

// Connection handling
socket.on('connect', () => {
  console.log('Connected to WebSocket');
});
``` 