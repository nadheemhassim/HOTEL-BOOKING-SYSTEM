# 📁 Folder Structure Guide

## Root Structure
```
hotel-room-booking/
├── 📁 frontend/     # Next.js frontend application
├── 📁 backend/      # Express backend application
└── 📝 config files  # Root configuration files
```

## Frontend Structure (/frontend)

### 📱 Pages (/src/app)
```
app/
├── (auth)/          # Authentication related pages
│   ├── login/       # Login page
│   └── register/    # Registration page
├── admin/           # Admin dashboard & management
│   ├── rooms/       # Room management
│   ├── bookings/    # Booking management
│   ├── users/       # User management
│   └── ...         # Other admin sections
├── rooms/           # Room listing & details
├── profile/         # User profile page
└── team/            # Team/Staff page
```

### 🧩 Components (/src/components)
```
components/
├── admin/           # Admin-specific components
│   ├── AdminSidebar       # Admin navigation
│   └── DeleteConfirmModal # Deletion confirmation
├── common/          # Shared components
│   ├── Header      # Site header
│   ├── Footer      # Site footer
│   └── Toast       # Notifications
├── home/           # Homepage components
│   ├── HeroSection
│   └── PopularRooms
└── rooms/          # Room-related components
    ├── RoomCard
    └── BookingModal
```

### 🔧 Core Utilities

#### Contexts (/src/contexts)
- `AuthContext`: User authentication state
- `LoadingContext`: Loading states
- `ThemeContext`: Dark/light theme

#### Types (/src/types)
- `auth.ts`: Authentication types
- `room.ts`: Room-related types
- `booking.ts`: Booking types

#### Utils (/src/utils)
- `socket.ts`: WebSocket configuration
- `validation.ts`: Form validation helpers

## Backend Structure (/backend)

### Core Components
```
src/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API routes
├── middleware/     # Custom middleware
└── config/         # Configuration files
```

### Key Files Explained

#### Frontend Config Files
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `.env.local`: Environment variables

#### Backend Config Files
- `nodemon.json`: Development server config
- `.env`: Backend environment variables
- `Dockerfile`: Container configuration

## 🔑 Key Files & Their Purpose

### Frontend Files
| File | Purpose |
|------|---------|
| `layout.tsx` | Main layout wrapper |
| `page.tsx` | Page component |
| `globals.css` | Global styles |
| `middleware.ts` | Request middleware |

### Backend Files
| File | Purpose |
|------|---------|
| `app.ts` | Express application setup |
| `server.ts` | Server entry point |
| `database.ts` | Database connection |
| `socket.ts` | WebSocket setup |

## 📦 Component Categories

### Admin Components
- Room management
- User management
- Booking management
- Staff management

### Common Components
- Navigation
- Forms
- Loading states
- Notifications

### Feature Components
- Room booking
- User reviews
- Payment processing
- Profile management

## 🔄 Data Flow

1. **Frontend Pages** (`/app/*`)
   - User interface
   - Route handling
   - Component rendering

2. **API Calls** (`/utils/*`)
   - Data fetching
   - Error handling
   - State management

3. **Backend Processing** (`/backend/src/*`)
   - Data validation
   - Business logic
   - Database operations

## 📱 Page Types

### Public Pages
- Home page
- Room listings
- About/Team pages

### Protected Pages
- User profile
- Booking management
- Reviews/Ratings

### Admin Pages
- Dashboard
- User management
- Room management

## 🛠️ Development Tools

### Frontend Tools
- Next.js 15
- TypeScript
- Tailwind CSS
- Socket.io client

### Backend Tools
- Express
- MongoDB
- JWT Authentication
- Socket.io

---

<div align="center">
  <p>This structure follows modern best practices for a full-stack application</p>
  <p>
    <a href="./README.md">Back to Main Docs</a> •
    <a href="./api.md">API Documentation</a>
  </p>
</div> 