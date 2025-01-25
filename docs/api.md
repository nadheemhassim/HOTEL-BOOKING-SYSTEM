# 🔌 API Documentation

## 🔐 Authentication
### Login
```http
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Register
```http
POST /api/auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

## 🛏️ Rooms
### Get All Rooms
```http
GET /api/rooms
```

### Get Room by ID
```http
GET /api/rooms/:id
```

### Create Room (Admin)
```http
POST /api/rooms
```

**Request:**
```json
{
  "name": "Deluxe Suite",
  "description": "Luxury room with ocean view",
  "price": 299.99,
  "capacity": 2,
  "amenities": ["WiFi", "TV", "Mini Bar"],
  "images": ["url1", "url2"],
  "roomNumber": "501",
  "roomType": "SUITE"
}
```

### Update Room (Admin)
```http
PUT /api/rooms/:id
```

### Delete Room (Admin)
```http
DELETE /api/rooms/:id
```

## 📅 Bookings
### Create Booking
```http
POST /api/bookings
```

**Request:**
```json
{
  "roomId": "room_id",
  "checkIn": "2024-03-20",
  "checkOut": "2024-03-25",
  "guests": 2,
  "totalAmount": 1499.95
}
```

### Get User's Bookings
```http
GET /api/bookings/my-bookings
```

### Get All Bookings (Admin)
```http
GET /api/bookings
```

### Update Booking Status
```http
PATCH /api/bookings/:id/status
```

**Request:**
```json
{
  "status": "CONFIRMED"
}
```

## 🎁 Promotions
### Get Active Promos
```http
GET /api/promos
```

### Create Promo (Admin)
```http
POST /api/promos
```

**Request:**
```json
{
  "title": "Summer Special",
  "description": "20% off on all suites",
  "code": "SUMMER20",
  "discount": "20%",
  "validUntil": "2024-08-31"
}
```

## 👥 Staff Management
### Get Active Staff
```http
GET /api/staff
```

### Create Staff (Admin)
```http
POST /api/staff
```

**Request:**
```json
{
  "name": "Jane Smith",
  "position": "Manager",
  "department": "Front Desk",
  "image": "staff_image_url",
  "schedule": ["MON", "TUE", "WED"]
}
```

## 📝 Testimonials
### Get Approved Testimonials
```http
GET /api/testimonials
```

### Add Testimonial
```http
POST /api/testimonials
```

**Request:**
```json
{
  "rating": 5,
  "review": "Excellent service and beautiful rooms!"
}
```

## 🛎️ Services
### Get Available Services
```http
GET /api/services
```

### Create Service (Admin)
```http
POST /api/services
```

**Request:**
```json
{
  "name": "Room Service",
  "description": "24/7 in-room dining",
  "price": 0,
  "category": "DINING",
  "image": "service_image_url"
}
```

## 📊 Admin Dashboard
### Get Dashboard Stats
```http
GET /api/admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalRooms": 50,
    "totalBookings": 300,
    "totalRevenue": 45000,
    "recentBookings": []
  }
}
```

## 🔄 WebSocket Events
```typescript
// Room Events
socket.on('roomUpdated', (room) => {})
socket.on('roomDeleted', (roomId) => {})

// Booking Events
socket.on('bookingCreated', (booking) => {})
socket.on('bookingUpdated', (booking) => {})

// Notification Events
socket.on('notification', (notification) => {})
```

## 🔒 Authentication Headers
```http
Authorization: Bearer <jwt_token>
```

## 📝 Response Formats
### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "field": "field_name" // Optional, for validation errors
}
``` 