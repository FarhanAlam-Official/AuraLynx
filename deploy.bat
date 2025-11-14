@echo off
REM AuraLynx Production Deployment Script for Windows

echo 🎵 Starting AuraLynx Production Deployment...

REM Check if required files exist
if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml not found! Please run this script from the project root.
    exit /b 1
)

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running! Please start Docker Desktop.
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "ssl" mkdir ssl
if not exist "logs" mkdir logs

REM Copy production environment files
echo 📋 Setting up environment files...
if exist "backend\.env.production" copy "backend\.env.production" "backend\.env"
if exist "frontend\.env.production" copy "frontend\.env.production" "frontend\.env"

REM Build and start services
echo 🐳 Building and starting Docker containers...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Some services failed to start. Check logs:
    docker-compose logs
    exit /b 1
) else (
    echo ✅ Services are running!
)

REM Run database migrations
echo 🗄️  Running database migrations...
docker-compose exec backend python manage.py migrate

REM Collect static files
echo 📦 Collecting static files...
docker-compose exec backend python manage.py collectstatic --noinput

REM Test API endpoint
echo 🧪 Testing API endpoint...
curl -f http://localhost:8000/api/health/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API is not responding!
    exit /b 1
) else (
    echo ✅ Backend API is responding!
)

REM Test frontend
echo 🧪 Testing frontend...
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is not responding!
    exit /b 1
) else (
    echo ✅ Frontend is responding!
)

echo.
echo 🎉 AuraLynx deployed successfully!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000/api
echo 📊 Admin: http://localhost:8000/admin
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart: docker-compose restart
echo   Update: deploy.bat
echo.
echo ⚠️  Don't forget to:
echo   1. Set up SSL certificates in .\ssl\
echo   2. Configure your domain in nginx.conf
echo   3. Set proper environment variables
echo   4. Set up monitoring and backups

pause