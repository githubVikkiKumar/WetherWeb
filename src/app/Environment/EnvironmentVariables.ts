export const EnvironmentalVariables = {
    production: false,

    // Backend API Configuration
    backendBaseURL: 'http://localhost:3000/api',
    websocketURL: 'http://localhost:3000',
    
    // Demo Mode (set to true to use demo data)
    demoMode: false,
    
    // OpenWeatherMap API configuration (Fallback)
    openWeatherMapApiKey: '8d63438cede04244bf575812252410',
    openWeatherMapBaseURL: 'https://api.openweathermap.org/data/2.5/',
    
    // RapidAPI configuration (Fallback)
    weatherApiLocationBaseURL: 'https://weather338.p.rapidapi.com/locations/search?',
    weatherApiForecastBaseURL: 'https://weather338.p.rapidapi.com/weather/forecast?',
    
    // Variables for API key name and value
    xRapidApiKeyName: 'X-RapidAPI-Key',
    xRapidApikeyValue: '913e57de3dmsh90022ec7950ea41p18b12fjsne4d11d08ab13',

    // Variables for host name and value
    xRapidApiHostName: 'X-RapidAPI-Host',
    xRapidApiHostValue: 'weather338.p.rapidapi.com'
}