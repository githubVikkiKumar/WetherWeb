import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';
import { SearchService } from '../Services/search.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.css']
})
export class LeftContainerComponent implements OnInit {

  // variables for font awesome icons
  
  
  //Variables for left-nav-bar search icons
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation:any = faLocation;
  faRefresh:any = faRefresh;

  // Variables for temperature summary
  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  // Search input value
  searchInput: string = '';
  showSuggestions: boolean = false;
  locationSuggestions: string[] = [];
  
  // Popular cities for suggestions (Indian + Global)
  popularCities = [
    // Indian cities
    'Mumbai, Maharashtra', 'Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
    'Kolkata, West Bengal', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh',
    'Patna, Bihar', 'Vadodara, Gujarat', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh',
    'Nashik, Maharashtra', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat',
    'Varanasi, Uttar Pradesh', 'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra',
    'Solapur, Maharashtra', 'Vijayawada, Andhra Pradesh', 'Amritsar, Punjab',
    
    // Global cities
    'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France',
    'Sydney, Australia', 'Dubai, UAE', 'Singapore', 'Hong Kong',
    'Toronto, Canada', 'Berlin, Germany', 'Rome, Italy', 'Madrid, Spain',
    'Moscow, Russia', 'Beijing, China', 'Seoul, South Korea', 'Bangkok, Thailand'
  ];
  
  constructor(
    public weatherService: WeatherService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // Auto-refresh weather data every 2 minutes
    setInterval(() => {
      this.refreshWeatherData();
    }, 120000); // 2 minutes in milliseconds
  }

  public onSearch(location: string): void {
    if (location && location.trim() !== '') {
      // Use enhanced search for global locations
      this.weatherService.searchGlobalLocation(location.trim());
      this.searchInput = ''; // Clear search input
    }
  }

  public onCurrentLocation(): void {
    this.getCurrentLocation();
  }

  public onManualRefresh(): void {
    this.weatherService.refreshWeatherData();
  }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position:', position);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Get city name from coordinates
          this.getCityFromCoordinates(lat, lon);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
          this.weatherService.cityName = 'Mumbai';
          this.weatherService.getData();
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      // Fallback to default location
      this.weatherService.cityName = 'Mumbai';
      this.weatherService.getData();
    }
  }

  private getCityFromCoordinates(lat: number, lon: number): void {
    // Use reverse geocoding to get city name
    const apiKey = 'your_openweathermap_api_key_here'; // You can use the same API key
    
    if (apiKey === 'your_openweathermap_api_key_here') {
      // Fallback to demo location
      this.weatherService.cityName = 'Mumbai';
      this.weatherService.getData();
      return;
    }

    const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const cityName = data[0].name;
          console.log('Found city:', cityName);
          this.weatherService.cityName = cityName;
          this.weatherService.getData();
        } else {
          // Fallback to coordinates-based search
          this.weatherService.cityName = `${lat.toFixed(2)},${lon.toFixed(2)}`;
          this.weatherService.getData();
        }
      })
      .catch(error => {
        console.error('Error getting city from coordinates:', error);
        // Fallback to default location
        this.weatherService.cityName = 'Mumbai';
        this.weatherService.getData();
      });
  }

  private refreshWeatherData(): void {
    console.log('Auto-refreshing weather data...');
    this.weatherService.getData();
  }

  public onSearchInput(event: any): void {
    this.searchInput = event.target.value;
    this.filterSuggestions();
  }

  public onSearchSubmit(): void {
    this.onSearch(this.searchInput);
    this.showSuggestions = false;
  }

  public onSuggestionClick(suggestion: string): void {
    this.searchInput = suggestion;
    this.onSearch(suggestion);
    this.showSuggestions = false;
  }

  public onInputFocus(): void {
    this.showSuggestions = true;
    this.filterSuggestions();
  }

  public onInputBlur(): void {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private filterSuggestions(): void {
    if (this.searchInput.length > 0) {
      // Use enhanced global search
      this.searchService.searchLocations(this.searchInput).subscribe({
        next: (suggestions) => {
          this.locationSuggestions = suggestions.map(s => s.name).slice(0, 8);
        },
        error: (error) => {
          console.error('Search API error:', error);
          // Fallback to local global filtering
          this.locationSuggestions = this.searchService.filterCities(this.searchInput);
        }
      });
    } else {
      // Show popular cities (Indian + Global)
      this.locationSuggestions = this.popularCities.slice(0, 8);
    }
  }
}
