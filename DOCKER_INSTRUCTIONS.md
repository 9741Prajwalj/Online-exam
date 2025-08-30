# Docker Setup for Online Exam System

This document provides instructions for running the Online Exam System using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

## Project Structure

- **Backend**: Spring Boot application (port 8080)
- **Frontend**: React application (port 3000)

## Docker Commands

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This command will:
- Build both backend and frontend Docker images
- Start both containers
- The backend will be available at `http://localhost:8080`
- The frontend will be available at `http://localhost:3000`

### 2. Start Services in Detached Mode

```bash
docker-compose up --build -d
```

### 3. Stop Services

```bash
docker-compose down
```

### 4. View Logs

```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```

### 5. Rebuild Specific Service

```bash
# Rebuild and restart backend only
docker-compose up --build backend

# Rebuild and restart frontend only
docker-compose up --build frontend
```

## Individual Docker Commands

### Build Backend Only

```bash
docker build -t online-exam-backend -f Dockerfile.backend .
```

### Build Frontend Only

```bash
docker build -t online-exam-frontend -f Dockerfile.frontend .
```

### Run Backend Container

```bash
docker run -p 8080:8080 online-exam-backend
```

### Run Frontend Container

```bash
docker run -p 3000:80 online-exam-frontend
```

## Environment Variables

The backend service uses the following environment variables (configured in docker-compose.yml):

- `SPRING_DATASOURCE_URL`: JDBC URL for H2 database
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Hibernate DDL auto setting
- `SPRING_H2_CONSOLE_ENABLED`: Enable H2 console
- `APP_JWT_SECRET`: JWT secret key
- `APP_JWT_EXPIRATION`: JWT expiration time in milliseconds

## Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:examdb`
  - Username: `sa`
  - Password: (empty)

## Troubleshooting

1. **Port conflicts**: Make sure ports 8080 and 3000 are not in use
2. **Build issues**: Check if all dependencies are properly included
3. **Network issues**: Ensure containers can communicate with each other

## Development vs Production

- In development, the frontend connects to `http://localhost:8080/api`
- In production (Docker), the frontend connects to `http://backend:8080/api`

The API URL is automatically configured based on the environment.
