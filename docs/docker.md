# 🐳 Docker Setup Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Basic Docker Commands](#basic-docker-commands)
- [Project Setup](#project-setup)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### 1. Install Docker
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Verify installation:
```bash
docker --version
docker-compose --version
```

## Basic Docker Commands

### 1. Container Management
```bash
# Start containers
docker-compose up

# Start and rebuild containers
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running containers
docker ps

# View all containers
docker ps -a
```

### 2. Logs and Monitoring
```bash
# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
```

### 3. Container Operations
```bash
# Enter container shell
docker exec -it hotel-booking-frontend sh
docker exec -it hotel-booking-backend sh

# Restart single service
docker-compose restart frontend
docker-compose restart backend
```

## Project Setup

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd hotel-booking

# Create environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 2. Build & Run
```bash
# First time setup
docker-compose up --build

# Regular startup
docker-compose up

# Access Points
Frontend: http://localhost:3000
Backend:  http://localhost:5000
MongoDB:  localhost:27017
```

### 3. Development Workflow
```bash
# Start with file watching
docker-compose up

# Rebuild after package.json changes
docker-compose up --build

# Clean restart
docker-compose down
docker-compose up --build
```

## Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check ports in use
netstat -ano | findstr "3000"
netstat -ano | findstr "5000"
netstat -ano | findstr "27017"

# Kill process using port
taskkill /PID <PID> /F
```

#### 2. Container Issues
```bash
# Reset all containers
docker-compose down
docker system prune -af
docker volume prune -f
docker-compose up --build

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

#### 3. MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongo

# Access MongoDB shell
docker exec -it hotel-booking-mongo mongosh
```

## Best Practices

### 1. Volume Management
```bash
# List volumes
docker volume ls

# Clean unused volumes
docker volume prune

# Backup volume data
docker run --rm -v hotel-booking_mongodb_data:/data -v $(pwd):/backup alpine tar -czf /backup/mongodb-backup.tar.gz /data
```

### 2. Image Management
```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

### 3. Development Tips
- Use `docker-compose.override.yml` for local settings
- Keep images small by using `.dockerignore`
- Use multi-stage builds for production
- Set resource limits in compose file

### 4. Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Hotel Booking System
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/hotel-booking
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## Docker Compose Configuration
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
```

## Health Checks
```bash
# Frontend health
curl http://localhost:3000

# Backend health
curl http://localhost:5000/api/health

# MongoDB health
docker exec hotel-booking-mongo mongosh --eval "db.adminCommand('ping')"
```

---

<div align="center">
  <p>For more detailed information, check the official <a href="https://docs.docker.com/">Docker documentation</a></p>
</div> 