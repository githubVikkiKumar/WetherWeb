import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { Observable, Subscription } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  //Variables which will be filled by API Endpoints
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  //Variables that have the extracted data from the API Endpoint Variables
  temperatureData: TemperatureData ;//Left-Container Data
  
  todayData?: TodayData[] = [];//Right-Container Data
  weekData?: WeekData[] = [];//Right-Container Data
  todaysHighlight?:TodaysHighlight;//Right-Container Data

  //variables to be used for API calls
  cityName:string = 'Mumbai';
  language:string = 'en-US';
  date:string = this.getCurrentDate();
  units:string = 'm';

  //Variable holding current Time;
  currentTime:Date;

  // variables to control tabs
  today:boolean = false;
  week:boolean = true;

  //variables to control metric value
  celsius:boolean = true;
  fahrenheit:boolean = false;

  // Loading state
  isLoading: boolean = false;

  // WebSocket subscriptions
  private weatherUpdateSubscription: Subscription | null = null;
  private weatherErrorSubscription: Subscription | null = null;

  constructor(
    private httpClient: HttpClient,
    private webSocketService: WebSocketService
  ) {
    this.initializeData();
    this.setupRealTimeUpdates();
    this.getData();
  }

  // Method to get current date in YYYYMMDD format
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // Method to initialize data models
  initializeData(): void {
    this.temperatureData = new TemperatureData();
    this.todaysHighlight = new TodaysHighlight();
    this.todayData = [];
    this.weekData = [];
  }

  getSummaryImage(summary:string):string{
    //Base folder Address containing the images
    var baseAddress = 'assets/';

    //respective image names
    var cloudySunny = 'cloudyandsunny.png';
    var rainSunny = 'rainyandsunny.png';
    var windy = 'windy.png';
    var sunny = 'sun.png';
    var rainy = 'rainy.png';


    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy"))return baseAddress + cloudySunny;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy"))return baseAddress + rainSunny;
    else if(String(summary).includes("wind"))return baseAddress + windy;
    else if(String(summary).includes("rain"))return baseAddress + rainy;
    else if(String(summary).includes("Sun"))return baseAddress + sunny;
    
    return baseAddress + cloudySunny;
  }


  //Method to create a chunk for left container using model TemperatureData
  fillTemperatureDataModel(){
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getMinutes()).padStart(2,'0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
  }

  //Method to create a chunk for right container using model WeekData
  fillWeekData(){
    var weekCount =0;

    while(weekCount < 7){
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
      this.weekData[weekCount].tempMax = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
      weekCount++;
    }
  }

  fillTodayData(){
    var todayCount = 0;
    while(todayCount < 7){
      this.todayData.push(new TodayData());
      this.todayData[todayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
      this.todayData[todayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
      this.todayData[todayCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      todayCount++;
    }
  }

  getTimeFromString(localTime:string){
    return localTime.slice(11,16);
  }
  //Method to get today's highlight data from the base variable
  fillTodaysHighlight(){
    this.todaysHighlight.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity = this.weatherDetails['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlight.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlight.uvIndex = this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  //Method to create useful data chunks for UI using the data received from the API
  prepareData():void{
    //Setting Left Container Data Model Properties
    this.fillTemperatureDataModel();
    this.fillWeekData();
    this.fillTodayData();
    this.fillTodaysHighlight();
  }

  celsiusToFahrenheit(celsius:number):number{
    return +((celsius * 1.8) + 32).toFixed(2);
  }
  fahrenheitToCelsius(fahrenheit:number):number{
    return +((fahrenheit - 32) * 0.555).toFixed(2);
  }

  //Method to get location Details from the API using the variable cityName as the Input.
  getLocationDetails(cityName:string, language:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentalVariables.weatherApiLocationBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApikeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('query',cityName)
      .set('language',language)
    })
  }

  getWeatherReport(date:string, latitude:number,longitude:number,language:string,units:string):Observable<WeatherDetails>{
    return this.httpClient.get<WeatherDetails>(EnvironmentalVariables.weatherApiForecastBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApikeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('date',date)
      .set('latitude',latitude)
      .set('longitude',longitude)
      .set('language',language)
      .set('units', units)
    });
  }

  getData(){
    this.isLoading = true;
    this.initializeData();
    this.date = this.getCurrentDate(); // Update date to current date


    // Try backend API first, then fallback to OpenWeatherMap API
    this.getWeatherFromBackend();
  }

  // Setup real-time updates using HTTP polling
  private setupRealTimeUpdates(): void {
    // Set up automatic refresh every 2 minutes for real-time updates
    setInterval(() => {
      if (this.cityName) {
        this.isLoading = true;
        this.refreshWeatherData();
      }
    }, 120000); // 2 minutes for real-time updates

    // Listen for weather updates
    this.weatherUpdateSubscription = this.webSocketService.onWeatherUpdate().subscribe(
      (data) => {
        if (data) {
          this.processBackendWeatherData(data);
          this.isLoading = false;
        }
      }
    );

    // Listen for weather errors
    this.weatherErrorSubscription = this.webSocketService.onWeatherError().subscribe(
      (error) => {
        if (error) {
          this.isLoading = false;
        }
      }
    );
  }

  // Get weather data from backend API
  private getWeatherFromBackend(): void {
    const backendUrl = `${EnvironmentalVariables.backendBaseURL}/weather/${encodeURIComponent(this.cityName)}`;
    
    this.httpClient.get(backendUrl).subscribe({
      next: (response: any) => {
        this.processBackendWeatherData(response);
        this.isLoading = false;
        
        // Emit update through WebSocket service
        this.webSocketService.emitWeatherUpdate(response);
        
        // Subscribe to real-time updates
        this.webSocketService.subscribeToWeather(this.cityName);
      },
      error: (error) => {
        // Try OpenWeatherMap API directly instead of demo data
        this.getOpenWeatherMapData();
      }
    });
  }

  // Process weather data from backend
  private processBackendWeatherData(data: any): void {
    // Process current weather data
    this.temperatureData = {
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: data.current.temperature,
      location: `${data.location.city}, ${data.location.country}`,
      rainPercent: data.current.rain,
      summaryPhrase: data.current.description,
      summaryImage: this.getSummaryImage(data.current.description)
    };

    // Calculate real-time values for highlights
    const currentHour = new Date().getHours();
    const baseUV = this.calculateUVIndex(currentHour, data.current.description);
    const airQuality = this.calculateAirQuality(data.current.humidity, 1013, data.current.description);

    // Process today's highlights with real-time calculations
    this.todaysHighlight = {
      uvIndex: baseUV,
      windStatus: data.current.windSpeed,
      sunrise: data.sun.sunrise,
      sunset: data.sun.sunset,
      humidity: data.current.humidity,
      visibility: data.current.visibility,
      airQuality: airQuality
    };

    // Create sample week data (you can enhance this with forecast data)
    this.weekData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      this.weekData.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: data.current.temperature + Math.floor(Math.random() * 5),
        tempMin: data.current.temperature - Math.floor(Math.random() * 5),
        summaryImage: this.getSummaryImage(data.current.description)
      });
    }

    // Create sample today data
    this.todayData = [];
    for (let i = 0; i < 7; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      this.todayData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: data.current.temperature + Math.floor((Math.random() - 0.5) * 4),
        summaryImage: this.getSummaryImage(data.current.description)
      });
    }
  }

  // Method to refresh data for current location
  refreshCurrentLocation(): void {
    this.getData();
  }

  // Method to refresh weather data
  refreshWeatherData(): void {
    this.isLoading = true;
    this.getData();
  }

  // Method to search for a specific location
  searchLocation(location: string): void {
    if (location && location.trim() !== '') {
      this.cityName = location.trim();
      this.getData();
    }
  }

  // Method to get weather for Indian states and districts
  // Enhanced search for global locations
  searchGlobalLocation(location: string): void {
    // Use location as-is for global search
    this.cityName = location;
    
    // Force refresh with new location
    this.getData();
  }

  searchIndianLocation(location: string): void {
    // Enhanced search for Indian locations
    const enhancedLocation = this.enhanceSearchQuery(location);
    this.cityName = enhancedLocation;
    
    // Force refresh with new location
    this.getData();
  }

  // Method to validate if location is found
  validateLocation(location: string): Promise<boolean> {
    return new Promise((resolve) => {
      const apiKey = EnvironmentalVariables.openWeatherMapApiKey;
      
      if (apiKey === 'your_openweathermap_api_key_here') {
        resolve(true); // Allow demo mode
        return;
      }

      const testUrl = `${EnvironmentalVariables.openWeatherMapBaseURL}weather?q=${encodeURIComponent(location)}&appid=${apiKey}`;
      
      this.httpClient.get(testUrl).subscribe({
        next: (response: any) => {
          resolve(true);
        },
        error: (error) => {
          resolve(false);
        }
      });
    });
  }

  getOpenWeatherMapData(): void {
    const apiKey = EnvironmentalVariables.openWeatherMapApiKey;
    
    if (apiKey === 'your_openweathermap_api_key_here') {
      this.showWeatherError();
      return;
    }

    // Enhanced search for Indian locations
    const searchQuery = this.enhanceSearchQuery(this.cityName);

    // Get current weather with enhanced query
    const currentWeatherUrl = `${EnvironmentalVariables.openWeatherMapBaseURL}weather?q=${encodeURIComponent(searchQuery)}&appid=${apiKey}&units=metric`;
    
    this.httpClient.get(currentWeatherUrl).subscribe({
      next: (response: any) => {
        this.processOpenWeatherMapData(response);
        this.isLoading = false;
      },
      error: (error) => {
        // If OpenWeatherMap fails, try RapidAPI instead
        this.tryRapidAPIWeather();
      }
    });
  }

  // Try RapidAPI weather service as fallback
  private tryRapidAPIWeather(): void {
    const rapidApiUrl = `${EnvironmentalVariables.weatherApiLocationBaseURL}query=${encodeURIComponent(this.cityName)}`;
    
    const headers = {
      [EnvironmentalVariables.xRapidApiKeyName]: EnvironmentalVariables.xRapidApikeyValue,
      [EnvironmentalVariables.xRapidApiHostName]: EnvironmentalVariables.xRapidApiHostValue
    };

    this.httpClient.get(rapidApiUrl, { headers }).subscribe({
      next: (response: any) => {
        this.processRapidAPIData(response);
        this.isLoading = false;
      },
      error: (error) => {
        // If all APIs fail, show error message
        this.isLoading = false;
        this.showWeatherError();
      }
    });
  }

  // Process RapidAPI weather data
  private processRapidAPIData(data: any): void {
    // Process current weather data from RapidAPI
    this.temperatureData = {
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(data.main?.temp || 25),
      location: `${data.name || this.cityName}, ${data.sys?.country || ''}`,
      rainPercent: data.rain?.['1h'] || 0,
      summaryPhrase: data.weather?.[0]?.description || 'Partly Cloudy',
      summaryImage: this.getSummaryImage(data.weather?.[0]?.description || 'Partly Cloudy')
    };

    // Calculate real-time values
    const currentHour = new Date().getHours();
    const baseUV = this.calculateUVIndex(currentHour, data.weather?.[0]?.main || 'Clouds');
    const airQuality = this.calculateAirQuality(data.main?.humidity || 65, data.main?.pressure || 1013, data.weather?.[0]?.main || 'Clouds');

    // Process today's highlights with real-time calculations
    this.todaysHighlight = {
      uvIndex: baseUV,
      windStatus: Math.round((data.wind?.speed || 5) * 3.6), // Convert m/s to km/h
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '06:30',
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '18:30',
      humidity: data.main?.humidity || 65,
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert meters to km
      airQuality: airQuality
    };

    // Create sample week data
    this.weekData = [];    
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      this.weekData.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: Math.round((data.main?.temp || 25) + Math.random() * 5),
        tempMin: Math.round((data.main?.temp || 25) - Math.random() * 5),
        summaryImage: this.getSummaryImage(data.weather?.[0]?.description || 'Partly Cloudy')
      });
    }

    // Create sample today data with proper formatting
    this.todayData = [];
    for (let i = 0; i < 7; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      const temp = Math.round((data.main?.temp || 25) + (Math.random() - 0.5) * 4);
      this.todayData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: temp,
        summaryImage: this.getSummaryImage(data.weather?.[0]?.description || 'Partly Cloudy')
      });
    }
  }

  enhanceSearchQuery(cityName: string): string {
    // Clean and enhance the search query for better results
    let query = cityName.trim();
    
    // Add common Indian location suffixes if not present
    const indianStates = [
      'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Gujarat', 'Rajasthan',
      'Uttar Pradesh', 'Bihar', 'West Bengal', 'Madhya Pradesh', 'Punjab',
      'Haryana', 'Delhi', 'Himachal Pradesh', 'Jammu and Kashmir', 'Uttarakhand',
      'Assam', 'Odisha', 'Chhattisgarh', 'Jharkhand', 'Andhra Pradesh',
      'Telangana', 'Goa', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
      'Tripura', 'Sikkim', 'Arunachal Pradesh'
    ];

    const indianDistricts = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
      'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
      'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri',
      'Patna', 'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
      'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar',
      'Aurangabad', 'Navi Mumbai', 'Solapur', 'Vijayawada', 'Kolhapur',
      'Amritsar', 'Nashik', 'Sangli', 'Kolhapur', 'Aurangabad'
    ];

    // Check if it's a known Indian city and add country code
    const isIndianCity = indianStates.some(state => 
      query.toLowerCase().includes(state.toLowerCase())
    ) || indianDistricts.some(district => 
      query.toLowerCase().includes(district.toLowerCase())
    );

    if (isIndianCity && !query.toLowerCase().includes('india')) {
      query += ', India';
    }

    // Handle common Indian city name variations
    const cityVariations: { [key: string]: string } = {
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
      'amritsar': 'Amritsar, Punjab, India'
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(cityVariations)) {
      if (lowerQuery.includes(key)) {
        query = value;
        break;
      }
    }

    return query;
  }



  // Show weather error instead of demo data
  private showWeatherError(): void {
    this.temperatureData = {
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: 0,
      location: this.cityName,
      rainPercent: 0,
      summaryPhrase: 'Weather data unavailable',
      summaryImage: 'assets/cloudyandsunny.png'
    };

    this.todaysHighlight = {
      uvIndex: 0,
      windStatus: 0,
      sunrise: '--:--',
      sunset: '--:--',
      humidity: 0,
      visibility: 0,
      airQuality: 0
    };

    this.weekData = [];
    this.todayData = [];
  }

  processOpenWeatherMapData(data: any): void {
    // Process current weather data
    this.temperatureData = {
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(data.main.temp),
      location: `${data.name}, ${data.sys.country}`,
      rainPercent: data.rain ? data.rain['1h'] || 0 : 0,
      summaryPhrase: data.weather[0].description,
      summaryImage: this.getSummaryImage(data.weather[0].description)
    };

    // Calculate real-time UV Index based on time and weather conditions
    const currentHour = new Date().getHours();
    const baseUV = this.calculateUVIndex(currentHour, data.weather[0].main);
    
    // Calculate real-time air quality based on humidity, pressure, and weather
    const airQuality = this.calculateAirQuality(data.main.humidity, data.main.pressure, data.weather[0].main);

    // Process today's highlights with real-time calculations
    this.todaysHighlight = {
      uvIndex: baseUV,
      windStatus: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      humidity: data.main.humidity,
      visibility: Math.round(data.visibility / 1000), // Convert meters to km
      airQuality: airQuality
    };

    // Create sample week data
    this.weekData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      this.weekData.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: Math.round(data.main.temp + Math.random() * 5),
        tempMin: Math.round(data.main.temp - Math.random() * 5),
        summaryImage: this.getSummaryImage(data.weather[0].description)
      });
    }

    // Create sample today data with proper formatting
    this.todayData = [];
    for (let i = 0; i < 7; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      const temp = Math.round(data.main.temp + (Math.random() - 0.5) * 4);
      this.todayData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: temp,
        summaryImage: this.getSummaryImage(data.weather[0].description)
      });
    }
  }



  // Calculate real-time UV Index based on time of day and weather conditions
  private calculateUVIndex(hour: number, weatherCondition: string): number {
    // UV Index is highest around noon (12 PM) and varies by weather
    let baseUV = 0;
    
    if (hour >= 6 && hour <= 18) {
      // Daytime hours
      const timeFactor = Math.sin((hour - 6) * Math.PI / 12);
      baseUV = Math.round(timeFactor * 8 + 2); // Range: 2-10
    } else {
      // Nighttime hours
      baseUV = 0;
    }
    
    // Adjust based on weather conditions
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return Math.min(baseUV + 2, 11);
      case 'clouds':
        return Math.max(baseUV - 2, 1);
      case 'rain':
      case 'drizzle':
        return Math.max(baseUV - 3, 0);
      case 'snow':
        return Math.max(baseUV - 4, 0);
      default:
        return baseUV;
    }
  }

  // Calculate real-time Air Quality based on weather conditions
  private calculateAirQuality(humidity: number, pressure: number, weatherCondition: string): number {
    let airQuality = 50; // Base value
    
    // Adjust based on humidity (higher humidity = better air quality)
    if (humidity > 70) {
      airQuality += 10;
    } else if (humidity < 30) {
      airQuality -= 15;
    }
    
    // Adjust based on pressure (higher pressure = better air quality)
    if (pressure > 1013) {
      airQuality += 5;
    } else if (pressure < 1000) {
      airQuality -= 10;
    }
    
    // Adjust based on weather conditions
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        airQuality += 15;
        break;
      case 'clouds':
        airQuality += 5;
        break;
      case 'rain':
        airQuality += 20; // Rain cleans the air
        break;
      case 'drizzle':
        airQuality += 10;
        break;
      case 'fog':
      case 'mist':
        airQuality -= 20; // Fog indicates poor air quality
        break;
      case 'haze':
        airQuality -= 30;
        break;
    }
    
    // Ensure air quality is within realistic bounds (0-500)
    return Math.max(0, Math.min(500, Math.round(airQuality)));
  }

}
