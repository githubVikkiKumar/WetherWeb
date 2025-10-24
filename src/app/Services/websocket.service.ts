import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private isConnected: boolean = false;
  private weatherUpdateSubject = new BehaviorSubject<any>(null);
  private weatherErrorSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    // For now, we'll use HTTP polling instead of WebSocket
    // This ensures the app works even without socket.io-client
    console.log('WebSocket service initialized (HTTP polling mode)');
    this.isConnected = true;
  }

  // Subscribe to weather updates for a location
  subscribeToWeather(location: string): void {
    if (this.isConnected) {
      console.log('Subscribing to weather updates for:', location);
      // In HTTP polling mode, we'll just log the subscription
      // Real updates will come through the weather service
    } else {
      console.warn('Service not connected, cannot subscribe to weather updates');
    }
  }

  // Unsubscribe from weather updates
  unsubscribeFromWeather(): void {
    if (this.isConnected) {
      console.log('Unsubscribing from weather updates');
    }
  }

  // Listen for weather updates
  onWeatherUpdate(): Observable<any> {
    return this.weatherUpdateSubject.asObservable();
  }

  // Listen for weather errors
  onWeatherError(): Observable<any> {
    return this.weatherErrorSubject.asObservable();
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Disconnect service
  disconnect(): void {
    console.log('Disconnecting weather service');
    this.isConnected = false;
  }

  // Emit weather update (for internal use)
  emitWeatherUpdate(data: any): void {
    this.weatherUpdateSubject.next(data);
  }

  // Emit weather error (for internal use)
  emitWeatherError(error: any): void {
    this.weatherErrorSubject.next(error);
  }
}

