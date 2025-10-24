const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '8d63438cede04244bf575812252410';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '913e57de3dmsh90022ec7950ea41p18b12fjsne4d11d08ab13';

// Store active weather subscriptions
const activeSubscriptions = new Map();
const weatherCache = new Map();

// Weather API endpoints
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const RAPIDAPI_BASE_URL = 'https://weather338.p.rapidapi.com';

// Enhanced search for global locations
const globalCities = {
  // Indian cities
  'mumbai': 'Mumbai, Maharashtra, India',
  'delhi': 'Delhi, India',
  'bangalore': 'Bangalore, Karnataka, India',
  'chennai': 'Chennai, Tamil Nadu, India',
  'kolkata': 'Kolkata, West Bengal, India',
  'hyderabad': 'Hyderabad, Telangana, India',
  'pune': 'Pune, Maharashtra, India',
  'ahmedabad': 'Ahmedabad, Gujarat, India',
  'jaipur': 'Jaipur, Rajasthan, India',
  'lucknow': 'Lucknow, Uttar Pradesh, India',
  'kanpur': 'Kanpur, Uttar Pradesh, India',
  'nagpur': 'Nagpur, Maharashtra, India',
  'indore': 'Indore, Madhya Pradesh, India',
  'bhopal': 'Bhopal, Madhya Pradesh, India',
  'visakhapatnam': 'Visakhapatnam, Andhra Pradesh, India',
  'patna': 'Patna, Bihar, India',
  'vadodara': 'Vadodara, Gujarat, India',
  'ludhiana': 'Ludhiana, Punjab, India',
  'agra': 'Agra, Uttar Pradesh, India',
  'nashik': 'Nashik, Maharashtra, India',
  'faridabad': 'Faridabad, Haryana, India',
  'meerut': 'Meerut, Uttar Pradesh, India',
  'rajkot': 'Rajkot, Gujarat, India',
  'varanasi': 'Varanasi, Uttar Pradesh, India',
  'srinagar': 'Srinagar, Jammu and Kashmir, India',
  'aurangabad': 'Aurangabad, Maharashtra, India',
  'solapur': 'Solapur, Maharashtra, India',
  'vijayawada': 'Vijayawada, Andhra Pradesh, India',
  'amritsar': 'Amritsar, Punjab, India',
  
  // International cities
  'new york': 'New York, NY, USA',
  'london': 'London, UK',
  'tokyo': 'Tokyo, Japan',
  'paris': 'Paris, France',
  'sydney': 'Sydney, Australia',
  'dubai': 'Dubai, UAE',
  'singapore': 'Singapore',
  'hong kong': 'Hong Kong',
  'toronto': 'Toronto, Canada',
  'berlin': 'Berlin, Germany',
  'rome': 'Rome, Italy',
  'madrid': 'Madrid, Spain',
  'moscow': 'Moscow, Russia',
  'beijing': 'Beijing, China',
  'seoul': 'Seoul, South Korea',
  'bangkok': 'Bangkok, Thailand',
  'cairo': 'Cairo, Egypt',
  'nairobi': 'Nairobi, Kenya',
  'cape town': 'Cape Town, South Africa',
  'sao paulo': 'São Paulo, Brazil',
  'mexico city': 'Mexico City, Mexico',
  'buenos aires': 'Buenos Aires, Argentina',
  'lima': 'Lima, Peru',
  'bogota': 'Bogotá, Colombia'
};

// Enhanced search query function
function enhanceSearchQuery(query) {
  const lowerQuery = query.toLowerCase().trim();
  
  // Check if it's a known global city
  for (const [key, value] of Object.entries(globalCities)) {
    if (lowerQuery.includes(key)) {
      return value;
    }
  }
  
  // Return query as-is for global search
  return query;
}

// Get weather data from OpenWeatherMap
async function getWeatherData(location) {
  try {
    const enhancedLocation = enhanceSearchQuery(location);
    console.log(`Fetching weather for: ${enhancedLocation}`);
    
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: enhancedLocation,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000
    });
    
    return processWeatherData(response.data);
  } catch (error) {
    console.error('OpenWeatherMap API error:', error.message);
    throw error;
  }
}

// Process weather data into our format
function processWeatherData(data) {
  return {
    location: {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      }
    },
    current: {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert to km
      uvIndex: 5, // Default value
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      rain: data.rain ? data.rain['1h'] || 0 : 0
    },
    sun: {
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    timestamp: new Date().toISOString()
  };
}

// Get forecast data
async function getForecastData(location) {
  try {
    const enhancedLocation = enhanceSearchQuery(location);
    
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: enhancedLocation,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 40 // 5 days * 8 intervals per day
      },
      timeout: 10000
    });
    
    return processForecastData(response.data);
  } catch (error) {
    console.error('Forecast API error:', error.message);
    throw error;
  }
}

// Process forecast data
function processForecastData(data) {
  const dailyForecast = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyForecast[date]) {
      dailyForecast[date] = {
        date: date,
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: item.main.temp_max,
        tempMin: item.main.temp_min,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        hourly: []
      };
    }
    
    dailyForecast[date].hourly.push({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon
    });
  });
  
  return Object.values(dailyForecast).slice(0, 7); // Return 7 days
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeConnections: io.engine.clientsCount
  });
});

// Get current weather
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const weatherData = await getWeatherData(location);
    
    // Cache the data
    weatherCache.set(location.toLowerCase(), {
      data: weatherData,
      timestamp: Date.now()
    });
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// Get weather forecast
app.get('/api/forecast/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const forecastData = await getForecastData(location);
    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch forecast data',
      message: error.message 
    });
  }
});

// Search locations
app.get('/api/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const suggestions = [];
    
    // Filter global cities based on query
    Object.entries(globalCities).forEach(([key, value]) => {
      if (key.toLowerCase().includes(query.toLowerCase()) || 
          value.toLowerCase().includes(query.toLowerCase())) {
        const country = value.split(',').pop()?.trim() || 'Unknown';
        suggestions.push({
          name: value,
          key: key,
          country: country
        });
      }
    });
    
    res.json(suggestions.slice(0, 15)); // Return top 15 suggestions for global coverage
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ 
      error: 'Failed to search locations',
      message: error.message 
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Subscribe to weather updates for a location
  socket.on('subscribe-weather', async (data) => {
    const { location } = data;
    console.log(`Client ${socket.id} subscribed to weather for: ${location}`);
    
    try {
      // Get initial weather data
      const weatherData = await getWeatherData(location);
      socket.emit('weather-update', weatherData);
      
      // Store subscription
      activeSubscriptions.set(socket.id, { location, lastUpdate: Date.now() });
      
    } catch (error) {
      socket.emit('weather-error', { 
        error: 'Failed to fetch weather data',
        message: error.message 
      });
    }
  });
  
  // Unsubscribe from weather updates
  socket.on('unsubscribe-weather', () => {
    console.log(`Client ${socket.id} unsubscribed from weather updates`);
    activeSubscriptions.delete(socket.id);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    activeSubscriptions.delete(socket.id);
  });
});

// Real-time weather updates every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled weather updates...');
  
  for (const [socketId, subscription] of activeSubscriptions) {
    try {
      const weatherData = await getWeatherData(subscription.location);
      
      // Emit update to specific client
      io.to(socketId).emit('weather-update', weatherData);
      
      // Update subscription timestamp
      subscription.lastUpdate = Date.now();
      
    } catch (error) {
      console.error(`Failed to update weather for ${subscription.location}:`, error);
      io.to(socketId).emit('weather-error', { 
        error: 'Failed to update weather data',
        message: error.message 
      });
    }
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🌤️  Weather API Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time updates`);
  console.log(`🔍 Enhanced search for Indian locations enabled`);
});

// Graceful shutdown
// Set up real-time weather updates
setInterval(() => {
  for (const [location, subscribers] of activeSubscriptions.entries()) {
    if (subscribers.size > 0) {
      fetchWeatherAndEmit(location);
    }
  }
}, 120000); // Every 2 minutes for real-time updates

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

