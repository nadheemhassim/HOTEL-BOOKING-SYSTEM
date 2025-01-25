# 🚀 Installation Guide

## Prerequisites
- Node.js 18+
- Docker Desktop
- Git

## Step-by-Step Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-repo/hotel-booking.git
cd hotel-booking
```

### 2️⃣ Environment Setup
```bash
# Frontend Setup
cd frontend
cp .env.example .env.local
npm install

# Backend Setup
cd ../backend
cp .env.example .env
npm install
```

### 3️⃣ Docker Deployment
```bash
# Start all services
docker-compose up --build

# Access Points:
Frontend: http://localhost:3000
Backend:  http://localhost:5000
MongoDB:  localhost:27017
``` 