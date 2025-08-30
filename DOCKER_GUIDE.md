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


# To run all the images to run container
docker-compose -f docker-compose-with-db.yml up -d

# To check how many continer is running
docker ps


# To see the logs file in the backend folder
docker-compose -f docker-compose-with-db.yml logs backend

# To check the Mysql database from the docker command
# Open a MySQL shell inside the running container:

docker exec -it online-exam-h2-jwt-mysql-1 mysql -u examuser -p examdb

#Enter the password when prompted:
Enter password: exampassword

# Once connected to the MySQL shell, you can run these commands:
# List all tables:
SHOW TABLES;

# View data from a specific table (e.g., users table):
SELECT * FROM users;

# View data from exams table:
SELECT * FROM exams;

# View data from questions table:
SELECT * FROM questions;

# View data from results table:
SELECT * FROM results;

# Check table structure:
DESCRIBE users;

# To exit the MySQL shell:
exit;

# Alternative method using root user:
docker exec -it online-exam-h2-jwt-mysql-1 mysql -u root -p
# Enter the root password when prompted:
Password: rootpassword


# To push the images to the Docker hub flow the steps
# 1. Log in to Docker Hub
docker login

# 2. Tag Images for Your Repository
9741prajwalj/online-exam-conducting

# Backend Image
docker tag online-exam-h2-jwt-backend:latest 9741prajwalj/online-exam-conducting:backend

# Frontend Image
docker tag online-exam-h2-jwt-frontend:latest 9741prajwalj/online-exam-conducting:frontend

# MySQL (Optional – only if you created a custom DB image)
docker tag mysql:8.0 9741prajwalj/online-exam-conducting:mysql

# 3. Push Images
docker push 9741prajwalj/online-exam-conducting:backend
docker push 9741prajwalj/online-exam-conducting:frontend
docker push 9741prajwalj/online-exam-conducting:mysql   # only if needed