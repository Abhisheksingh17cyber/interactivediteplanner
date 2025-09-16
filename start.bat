@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo   INTERNITY DIET PLANNER - QUICK START
echo ==============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if errorlevel 1 (
    echo ⚠️  MongoDB is not running. Please start MongoDB first.
    echo    On Windows: net start MongoDB
    echo    Or start MongoDB Compass/MongoDB Service
    echo.
    pause
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the project directory.
    pause
    exit /b 1
)

echo ✅ Package.json found

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    
    if errorlevel 1 (
        echo ❌ Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
    
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating environment configuration...
    copy ".env.example" ".env" >nul
    echo ✅ Environment file created (.env)
    echo    You can edit .env to customize your configuration
) else (
    echo ✅ Environment file already exists
)

REM Create required directories
echo 📁 Creating required directories...
if not exist "temp\pdfs" mkdir "temp\pdfs"
if not exist "logs" mkdir "logs"
if not exist "uploads" mkdir "uploads"
echo ✅ Directories created

echo.
echo 🚀 Starting INTERNITY DIET PLANNER...
echo    The application will be available at: http://localhost:3000
echo    Press Ctrl+C to stop the server
echo.

REM Start the application
npm start

pause