#!/bin/bash

echo "Starting Weather API Backend Server..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    echo "Please run this script from the backend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo
    echo "Please edit .env file and add your OpenWeatherMap API key"
    echo "Get your API key from: https://openweathermap.org/api"
    echo
fi

# Start the server
echo "Starting Weather API Server..."
echo "Backend will be available at: http://localhost:3000"
echo "WebSocket server ready for real-time updates"
echo
echo "Press Ctrl+C to stop the server"
echo

npm start

