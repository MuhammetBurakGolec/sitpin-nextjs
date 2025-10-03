# Docker Setup Guide

This guide explains how to run the Bookmark Manager application using Docker.

## 🐳 Prerequisites

- Docker installed on your system
- Docker Compose installed
- Go Fiber API code in `./api` directory (for backend)

## 🚀 Quick Start

### Production Setup

1. **Clone the repository and set up environment:**
   ```bash
   git clone <your-repo>
   cd bookmark-manager
   cp env.example.txt .env
   ```

2. **Configure environment variables in `.env`:**
   ```bash
   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   CLERK_DOMAIN=your-clerk-domain.clerk.accounts.dev
   
   # Optional: Sentry Configuration
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - MongoDB Admin: http://localhost:8081 (admin/admin123)

### Development Setup

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Access development services:**
   - Frontend (dev): http://localhost:3000
   - MongoDB Admin: http://localhost:8081

## 📁 Project Structure

```
.
├── Dockerfile              # Production frontend build
├── Dockerfile.dev          # Development frontend
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── mongo-init.js           # MongoDB initialization
├── .dockerignore           # Docker ignore file
└── api/                    # Go Fiber API code (create this)
    ├── main.go
    ├── go.mod
    └── ...
```

## 🔧 Services

### Frontend (Next.js)
- **Port:** 3000
- **Environment:** Production optimized with standalone output
- **Dependencies:** API service, MongoDB

### API (Go Fiber)
- **Port:** 3001
- **Environment:** Go 1.21 Alpine
- **Dependencies:** MongoDB
- **Note:** You need to create the `./api` directory with your Go code

### MongoDB
- **Port:** 27017
- **Database:** bookmarks
- **Admin:** admin/password123
- **Initialization:** Automatic with sample data

### Mongo Express (Admin UI)
- **Port:** 8081
- **Login:** admin/admin123
- **Purpose:** Database management interface

## 🛠️ Commands

### Start Services
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/bookmarks"

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/bookmarks" /backup
```

### Development
```bash
# Rebuild frontend
docker-compose build frontend

# View frontend logs
docker-compose logs -f frontend

# Access frontend container
docker-compose exec frontend sh
```

## 🔐 Environment Variables

### Required
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `CLERK_DOMAIN`: Your Clerk domain

### Optional
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry error tracking
- `NEXT_PUBLIC_SENTRY_ORG`: Sentry organization
- `NEXT_PUBLIC_SENTRY_PROJECT`: Sentry project

## 📊 Monitoring

### Health Checks
- Frontend: http://localhost:3000
- API: http://localhost:3001/health
- MongoDB: http://localhost:8081

### Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs api
docker-compose logs mongodb
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"  # Use different external port
   ```

2. **MongoDB connection issues:**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **API not starting:**
   ```bash
   # Ensure ./api directory exists with Go code
   ls -la ./api
   
   # Check API logs
   docker-compose logs api
   ```

### Clean Reset
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## 🔄 Updates

### Update Frontend
```bash
# Rebuild and restart
docker-compose build frontend
docker-compose up -d frontend
```

### Update API
```bash
# API updates automatically from ./api volume
# Just restart the service
docker-compose restart api
```

## 📝 Notes

- MongoDB data persists in Docker volumes
- Frontend uses Next.js standalone output for optimal Docker performance
- API code should be placed in `./api` directory
- Development setup includes hot reloading for frontend
- All services are connected via Docker network for internal communication

## 🎯 Next Steps

1. Create your Go Fiber API in `./api` directory
2. Configure Clerk authentication
3. Set up your domain and SSL (for production)
4. Configure monitoring and logging
5. Set up CI/CD pipeline

Happy coding! 🚀