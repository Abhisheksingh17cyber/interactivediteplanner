#!/bin/bash

# INTERNITY DIET PLANNER - Quick Start Script
# This script helps set up and run the diet planner application

echo "=============================================="
echo "  INTERNITY DIET PLANNER - QUICK START"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On macOS/Linux: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
    echo ""
    read -p "Press Enter after starting MongoDB, or Ctrl+C to exit..."
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project directory."
    exit 1
fi

echo "✅ Package.json found"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your internet connection."
        exit 1
    fi
    
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment configuration..."
    cp .env.example .env
    echo "✅ Environment file created (.env)"
    echo "   You can edit .env to customize your configuration"
else
    echo "✅ Environment file already exists"
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p temp/pdfs
mkdir -p logs
mkdir -p uploads
echo "✅ Directories created"

echo ""
echo "🚀 Starting INTERNITY DIET PLANNER..."
echo "   The application will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start