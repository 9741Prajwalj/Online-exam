# Docker Setup and Troubleshooting Guide

## Quick Start Commands

### Start All Services
```bash
docker-compose -f docker-compose-with-db.yml up -d
```

### Stop All Services
```bash
docker-compose -f docker-compose-with-db.yml down
```

### Rebuild and Restart Specific Service
```bash
# Rebuild backend only
docker-compose -f docker-compose-with-db.yml up --build -d backend

# Rebuild frontend only  
docker-compose -f docker-compose-with-db.yml up --build -d frontend

# Rebuild MySQL only
docker-compose -f docker-compose-with-db.yml up --build -d mysql
```

### View Logs
```bash
# All services
docker-compose -f docker-compose-with-db.yml logs

# Specific service
docker-compose -f docker-compose-with-db.yml logs backend
docker-compose -f docker-compose-with-db.yml logs frontend
docker-compose -f docker-compose-with-db.yml logs mysql
```

### Check Container Status
```bash
docker ps
```

## Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **MySQL Database**: localhost:3306

## Login Credentials

**Application Users:**
- Admin: username `admin`, password `12345678`
- Faculty: username `faculty1`, password `12345678`
- Student: username `student1`, password `12345678`

**MySQL Database:**
- Username: `examuser`
- Password: `exampassword`
- Database: `examdb`
- Root: username `root`, password `rootpassword`

## Common Issues and Solutions

### 1. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306

# Stop the conflicting process or use different ports
```

### 2. Frontend Cannot Connect to Backend (ERR_NAME_NOT_RESOLVED)
This happens when the frontend tries to connect to `backend:8080` but your browser can't resolve the Docker service name.

**Solution**: The frontend has been configured to use `localhost:8080` for development.

### 3. Database Connection Issues
```bash
# Test MySQL connection
docker exec -it online-exam-h2-jwt-mysql-1 mysql -u examuser -pexampassword examdb

# Check if tables exist
SHOW TABLES;
```

### 4. Rebuild After Code Changes
```bash
# After modifying backend code
docker-compose -f docker-compose-with-db.yml up --build -d backend

# After modifying frontend code  
docker-compose -f docker-compose-with-db.yml up --build -d frontend
```

### 5. Reset Database
```bash
# Stop and remove containers with volumes
docker-compose -f docker-compose-with-db.yml down -v

# Start fresh
docker-compose -f docker-compose-with-db.yml up -d

# Reload sample data
Get-Content sample_data_insert.sql | docker exec -i online-exam-h2-jwt-mysql-1 mysql -u examuser -pexampassword examdb
```

## File Structure

- `docker-compose-with-db.yml` - Main Docker Compose file with MySQL
- `Dockerfile.backend` - Backend Spring Boot application
- `Dockerfile.frontend` - Frontend React application  
- `sample_data_insert.sql` - Sample database data
- `.dockerignore` - Files to exclude from Docker builds

## Environment Variables

**Backend Environment Variables:**
- `SPRING_DATASOURCE_URL`: MySQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `APP_JWT_SECRET`: JWT secret key
- `APP_JWT_EXPIRATION`: JWT expiration time

**Frontend Environment Variables:**
- `REACT_APP_API_URL`: Backend API URL (set to http://localhost:8080/api)

## Monitoring and Debugging

```bash
# View resource usage
docker stats

# Enter container shell
docker exec -it online-exam-h2-jwt-backend-1 /bin/sh
docker exec -it online-exam-h2-jwt-frontend-1 /bin/sh
docker exec -it online-exam-h2-jwt-mysql-1 mysql -u root -prootpassword

# Check container health
docker inspect online-exam-h2-jwt-mysql-1 --format='{{.State.Health.Status}}'
```

## Production Deployment

For production, you should:
1. Change all passwords from default values
2. Use proper SSL certificates
3. Set up database backups
4. Configure proper logging and monitoring
5. Use environment-specific configuration files

## Support

If you encounter issues:
1. Check the logs using the commands above
2. Verify all containers are running with `docker ps`
3. Ensure ports are not conflicting
4. Check if the database is accessible
