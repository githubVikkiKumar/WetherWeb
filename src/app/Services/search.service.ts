import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  // Search for locations using backend API
  searchLocations(query: string): Observable<any[]> {
    const searchUrl = `${EnvironmentalVariables.backendBaseURL}/search/${encodeURIComponent(query)}`;
    return this.httpClient.get<any[]>(searchUrl);
  }

  // Get popular Indian cities
  getPopularCities(): string[] {
    return [
      'Mumbai, Maharashtra', 'Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
      'Kolkata, West Bengal', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
      'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Nagpur, Maharashtra',
      'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh',
      'Patna, Bihar', 'Vadodara, Gujarat', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh',
      'Nashik, Maharashtra', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat',
      'Varanasi, Uttar Pradesh', 'Srinagar, Jammu and Kashmir', 'Aurangabad, Maharashtra',
      'Solapur, Maharashtra', 'Vijayawada, Andhra Pradesh', 'Amritsar, Punjab'
    ];
  }

  // Get global cities for international search
  getGlobalCities(): string[] {
    return [
      // Indian cities
      'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India',
      'Kolkata, India', 'Hyderabad, India', 'Pune, India', 'Ahmedabad, India',
      'Jaipur, India', 'Lucknow, India', 'Kanpur, India', 'Nagpur, India',
      
      // International cities
      'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France',
      'Sydney, Australia', 'Dubai, UAE', 'Singapore', 'Hong Kong',
      'Toronto, Canada', 'Berlin, Germany', 'Rome, Italy', 'Madrid, Spain',
      'Moscow, Russia', 'Beijing, China', 'Seoul, South Korea', 'Bangkok, Thailand',
      'Cairo, Egypt', 'Nairobi, Kenya', 'Cape Town, South Africa', 'São Paulo, Brazil',
      'Mexico City, Mexico', 'Buenos Aires, Argentina', 'Lima, Peru', 'Bogotá, Colombia'
    ];
  }

  // Filter cities based on search query
  filterCities(query: string): string[] {
    const allCities = [...this.getPopularCities(), ...this.getGlobalCities()];
    const lowerQuery = query.toLowerCase();
    
    return allCities.filter(city => 
      city.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }

  // Enhanced search for global locations
  searchGlobalLocations(query: string): string[] {
    const globalCities = this.getGlobalCities();
    const lowerQuery = query.toLowerCase();
    
    return globalCities.filter(city => 
      city.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }
}

