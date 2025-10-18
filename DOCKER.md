# Docker Setup Guide

This guide explains how to run the Todo App using Docker and Docker Compose.

## Prerequisites

- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Install Docker Compose](https://docs.docker.com/compose/install/))

## Architecture

The application consists of two containers:

1. **Frontend Container** (Port 8000)
   - Nginx web server serving the Todo App UI
   - Built from `Dockerfile`

2. **Backend Container** (Port 3000)
   - Node.js Express API for managing todos
   - Built from `Dockerfile.backend`

## Quick Start

### Run Both Containers Simultaneously

```bash
docker-compose up -d
```

This will:
- Build both containers
- Start them in detached mode
- Create a network for them to communicate

### Access the Application

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000

### View Logs

```bash
# All containers
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend
```

### Stop the Containers

```bash
docker-compose down
```

### Rebuild Containers

If you make changes to the code:

```bash
docker-compose up -d --build
```

## Manual Docker Commands

### Build Images

```bash
# Frontend
docker build -t todoapp-frontend .

# Backend
docker build -t todoapp-backend -f Dockerfile.backend .
```

### Run Containers Individually

```bash
# Frontend
docker run -d -p 8000:80 --name todoapp-frontend todoapp-frontend

# Backend
docker run -d -p 3000:3000 --name todoapp-backend todoapp-backend
```

### Stop and Remove Containers

```bash
docker stop todoapp-frontend todoapp-backend
docker rm todoapp-frontend todoapp-backend
```

## Backend API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos/completed/clear` - Clear all completed todos
- `GET /health` - Health check endpoint

### Example API Calls

```bash
# Get all todos
curl http://localhost:3000/api/todos

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy groceries", "completed": false}'

# Update a todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/1
```

## Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution**: Stop the Python server or change the port in `docker-compose.yml`:

```bash
# Stop Python server
pkill -f "python3 -m http.server"

# Or change ports in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### Containers Won't Start

**Check logs**:
```bash
docker-compose logs
```

**Common fixes**:
1. Ensure no other services are using ports 8000 or 3000
2. Check Docker daemon is running: `docker info`
3. Rebuild containers: `docker-compose up --build`

### Cannot Connect to Backend from Frontend

**Issue**: Frontend can't reach backend API

**Solution**: Both containers are on the same network. Update your frontend JavaScript to use:
- Inside Docker: `http://backend:3000/api/todos`
- From host browser: `http://localhost:3000/api/todos`

### Clear All Docker Resources

**Warning**: This removes ALL Docker containers, images, and volumes

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi todoapp-frontend todoapp-backend

# Clean all unused resources
docker system prune -a
```

## Production Deployment

For production, consider:

1. **Use environment variables** for configuration
2. **Add a database** (PostgreSQL, MongoDB) instead of in-memory storage
3. **Enable HTTPS** with reverse proxy (nginx/Caddy)
4. **Add health checks** in docker-compose.yml
5. **Use volumes** for persistent data
6. **Implement authentication** for the API

### Example with Health Checks

```yaml
services:
  frontend:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  backend:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## File Structure

```
todoapp/
├── docker-compose.yml       # Orchestrates both containers
├── Dockerfile              # Frontend container
├── Dockerfile.backend      # Backend container
├── .dockerignore          # Files to exclude from builds
├── index.html             # Frontend files
├── style.css
├── script.js
├── backend/               # Backend API
│   ├── package.json
│   └── server.js
├── README.md             # Main documentation
└── DOCKER.md            # This file
```

## Next Steps

1. Start the containers: `docker-compose up -d`
2. Open http://localhost:8000 in your browser
3. Test the backend API at http://localhost:3000
4. Check logs if needed: `docker-compose logs -f`

For standard (non-Docker) setup, see [README.md](README.md).

