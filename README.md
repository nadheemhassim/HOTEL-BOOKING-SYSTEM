<div align="center">
  <h1>🏨 Luxury Hotel Room Booking System</h1>
  <p>A premium full-stack hotel booking platform built with modern technologies</p>

  ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

## 📋 Table of Contents
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [💻 Development](#-development)
- [🔧 Technical Architecture](#-technical-architecture)
- [📱 Features Overview](#-features-overview)
- [🤝 Contributing](#-contributing)

## ✨ Features

### 🛡️ User Management
- Secure JWT Authentication
- Role-based Authorization (Admin/Customer)
- Profile Management with Avatar
- Password Reset & Recovery

### 🏠 Room Management
- Multiple Room Categories (Suite, Deluxe, Standard)
- Real-time Availability Updates
- Dynamic Pricing System
- Rich Media Gallery
- Virtual Room Tours

### 📅 Booking System
- Real-time Availability Check
- Instant Booking Confirmation
- Flexible Date Selection
- Multiple Payment Options
- Booking History & Status

### 💫 Premium Features
- Real-time Push Notifications
- WebSocket Live Updates
- Responsive Mobile-first Design
- Dark/Light Theme Support
- Multi-language Support
- Interactive UI Components

## 🔧 Technical Architecture

### Frontend Architecture
```typescript
📱 Pages & Routing (Next.js App Router)
├── Public Routes
│   ├── Home (/)
│   ├── Rooms (/rooms)
│   └── About (/about)
├── Protected Routes
│   ├── Profile (/profile)
│   ├── Bookings (/bookings)
│   └── Reviews (/reviews)
└── Admin Routes
    ├── Dashboard (/admin)
    ├── Room Management (/admin/rooms)
    └── User Management (/admin/users)

🎨 Component Structure
├── Layout Components
│   ├── Header
│   └── Footer
├── Feature Components
│   ├── RoomCard
│   ├── BookingForm
│   └── ReviewSection
└── Common Components
    ├── Button
    ├── Input
    └── Modal
```

### Backend Architecture
```typescript
🔌 API Structure
├── Authentication
│   ├── JWT Implementation
│   └── Role-based Access
├── Database Models
│   ├── User Schema
│   ├── Room Schema
│   └── Booking Schema
└── WebSocket Events
    ├── Booking Updates
    ├── Room Status
    └── Notifications
```

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18
Docker Desktop
Git
```

### Installation Steps
```bash
# Clone repository
git clone https://github.com/your-repo/hotel-booking.git
cd hotel-booking

# Start with Docker
docker-compose up --build

# Access Points
Frontend ➜ http://localhost:3000
Backend  ➜ http://localhost:5000
MongoDB  ➜ localhost:27017
```

### Environment Setup
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Hotel Booking System

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## 📱 Features Overview

### Customer Features
| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure login/register with JWT |
| 🏨 Room Booking | Browse and book rooms with real-time availability |
| 💳 Payments | Secure payment processing with multiple options |
| 📅 Bookings | Manage and track booking history |
| ⭐ Reviews | Rate and review your stay |
| 🔔 Notifications | Real-time updates on bookings and offers |

### Admin Features
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Real-time statistics and analytics |
| 🏠 Rooms | Manage room inventory and pricing |
| 📑 Bookings | Overview of all reservations |
| 👥 Users | User management and roles |
| 💰 Revenue | Track payments and revenue |
| 🎯 Promotions | Create and manage special offers |

## 🔧 Troubleshooting

### Common Issues
```bash
# Port Conflicts
netstat -ano | findstr "3000 5000 27017"
taskkill /PID <PID> /F

# Docker Issues
docker-compose down -v
docker system prune -af
docker-compose up --build

# Database Issues
mongo
use admin
db.auth('username', 'password')
show dbs
```

---

<div align="center">
  <p></p>
  <p>
    <a href="https://github.com/your-repo">Github</a> •
    <a href="https://your-demo-url.com">Live Demo</a> •
    <a href="docs/api.md">API Docs</a>
  </p>
</div> 
