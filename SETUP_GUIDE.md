# 🌤️ Weather App - Complete Setup Guide

## 🚀 Real-Time Weather Application with Backend API

This guide will help you set up the complete weather application with real-time updates, enhanced search functionality, and a robust backend API.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Angular CLI** - `npm install -g @angular/cli`
- **OpenWeatherMap API Key** - [Get free API key](https://openweathermap.org/api)

## 🏗️ Project Structure

```
WeatherApp-2.0-master/
├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── Services/             # Weather, WebSocket, Search services
│   │   ├── Models/              # Data models
│   │   ├── Environment/         # API configuration
│   │   └── Components/          # UI components
├── backend/                      # Node.js Backend
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── start-backend.bat       # Windows startup script
└── SETUP_GUIDE.md              # This guide
```

## 🔧 Backend Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the environment template:
   ```bash
   copy env.example .env
   ```

2. Edit `.env` file and add your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

### Step 3: Start Backend Server

**Windows:**
```bash
start-backend.bat
```

**Linux/Mac:**
```bash
./start-backend.sh
```

**Manual:**
```bash
npm start
```

The backend will start on `http://localhost:3000`

## 🎨 Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
# From project root
npm install
```

### Step 2: Start Angular Development Server

```bash
ng serve
```

The frontend will start on `http://localhost:4200`

## ✨ Features

### 🔍 Enhanced Search Functionality
- **Smart Location Detection**: Automatically detects Indian cities, states, and districts
- **Real-time Suggestions**: Dropdown with popular Indian locations
- **Google-like Search**: Enhanced search experience similar to Google Weather
- **Location Validation**: Validates locations before fetching weather

### ⚡ Real-Time Updates
- **WebSocket Integration**: Real-time weather updates every 5 minutes
- **Auto-refresh**: Automatic data refresh without page reload
- **Live Updates**: Weather data updates in real-time
- **Connection Status**: Shows connection status for real-time updates

### 🌍 Indian Location Support
- **All Indian States**: Maharashtra, Karnataka, Tamil Nadu, Kerala, etc.
- **Major Cities**: Mumbai, Delhi, Bangalore, Chennai, Kolkata, etc.
- **Smart Search**: Handles various city name formats
- **Location Enhancement**: Automatically adds state and country information

### 📱 Modern UI/UX
- **Loading Indicators**: Shows progress during data fetching
- **Error Handling**: Graceful error handling with fallbacks
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Enhanced user experience

## 🚀 How to Use

### 1. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
ng serve
```

### 2. Open the Application

Navigate to `http://localhost:4200`

### 3. Search for Weather

- **Type any Indian city**: Mumbai, Delhi, Bangalore, Chennai, etc.
- **Use suggestions**: Click on suggested locations
- **Current location**: Click the location icon for GPS-based weather
- **Real-time updates**: Weather updates automatically every 5 minutes

## 🔧 API Endpoints

### Backend API Endpoints

- `GET /api/health` - Health check
- `GET /api/weather/:location` - Get current weather
- `GET /api/forecast/:location` - Get weather forecast
- `GET /api/search/:query` - Search locations

### WebSocket Events

- `subscribe-weather` - Subscribe to weather updates
- `unsubscribe-weather` - Unsubscribe from updates
- `weather-update` - Real-time weather data
- `weather-error` - Error notifications

## 🛠️ Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check if Node.js is installed
   - Verify all dependencies are installed
   - Check if port 3000 is available

2. **Frontend not connecting to backend:**
   - Ensure backend is running on port 3000
   - Check CORS settings in backend
   - Verify API endpoints are accessible

3. **Weather data not loading:**
   - Check OpenWeatherMap API key
   - Verify internet connection
   - Check browser console for errors

4. **Real-time updates not working:**
   - Check WebSocket connection
   - Verify backend is running
   - Check browser WebSocket support

### Debug Mode

Enable debug logging by checking browser console and backend terminal for detailed logs.

## 📊 Performance Features

- **Caching**: Weather data is cached for 5 minutes
- **Optimized API Calls**: Reduces unnecessary API requests
- **WebSocket Efficiency**: Real-time updates without polling
- **Error Recovery**: Automatic fallback to direct API calls

## 🔒 Security Features

- **CORS Protection**: Configured for localhost development
- **Input Validation**: Sanitized search inputs
- **Error Handling**: Secure error messages
- **Rate Limiting**: Built-in API rate limiting

## 📈 Monitoring

- **Health Check**: `/api/health` endpoint for monitoring
- **Connection Status**: WebSocket connection monitoring
- **Error Logging**: Comprehensive error logging
- **Performance Metrics**: API response time monitoring

## 🎯 Next Steps

1. **Get OpenWeatherMap API Key**: [Sign up here](https://openweathermap.org/api)
2. **Configure Environment**: Update `.env` file with your API key
3. **Start Backend**: Run the backend server
4. **Start Frontend**: Run the Angular development server
5. **Test Features**: Try searching for different Indian cities
6. **Monitor Updates**: Watch real-time weather updates

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Check the backend terminal for server logs
3. Verify all dependencies are installed
4. Ensure both servers are running
5. Check your OpenWeatherMap API key

## 🎉 Success!

Once everything is set up, you'll have a fully functional real-time weather application with:

- ✅ Enhanced search functionality
- ✅ Real-time weather updates
- ✅ Indian location support
- ✅ Modern UI/UX
- ✅ WebSocket integration
- ✅ Backend API
- ✅ Error handling
- ✅ Performance optimization

Enjoy your new weather application! 🌤️

