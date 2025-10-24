import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoWeatherService {

  constructor() { }

  // Get demo weather data for testing
  getDemoWeatherData(location: string): Observable<any> {
    const cityName = location.split(',')[0] || 'Mumbai';
    const temperature = 25 + Math.floor(Math.random() * 10);
    const description = this.getRandomWeatherDescription();
    
    const demoData = {
      location: {
        city: cityName,
        country: 'India',
        coordinates: {
          lat: 19.0760,
          lon: 72.8777
        }
      },
      current: {
        temperature: temperature,
        feelsLike: temperature + 3,
        humidity: 65 + Math.floor(Math.random() * 20),
        pressure: 1013,
        visibility: 10,
        uvIndex: 5,
        windSpeed: 15 + Math.floor(Math.random() * 10),
        windDirection: 180,
        description: description,
        icon: '01d',
        rain: Math.floor(Math.random() * 5)
      },
      sun: {
        sunrise: '06:30',
        sunset: '18:30'
      },
      timestamp: new Date().toISOString()
    };

    console.log('🌤️ Demo weather data generated for:', cityName, '-', temperature + '°C', description);
    return of(demoData);
  }

  private getRandomWeatherDescription(): string {
    const descriptions = [
      'Partly Cloudy',
      'Sunny',
      'Cloudy',
      'Light Rain',
      'Clear Sky',
      'Overcast',
      'Mist',
      'Fog'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  // Get demo forecast data
  getDemoForecastData(location: string): Observable<any[]> {
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      
      forecast.push({
        date: day.toDateString(),
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: 28 + Math.floor(Math.random() * 5),
        tempMin: 18 + Math.floor(Math.random() * 5),
        description: this.getRandomWeatherDescription(),
        icon: '01d',
        hourly: this.generateHourlyData()
      });
    }
    return of(forecast);
  }

  private generateHourlyData(): any[] {
    const hourly = [];
    for (let i = 0; i < 8; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      
      hourly.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: 22 + Math.floor(Math.random() * 8),
        description: this.getRandomWeatherDescription(),
        icon: '01d'
      });
    }
    return hourly;
  }
}
