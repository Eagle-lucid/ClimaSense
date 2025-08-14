// src/App.jsx
import { Suspense } from 'react';
import Header from './components/header/Header';
import Hero from './components/hero/Hero';
import ForecastList from './components/forecast/ForecastList';
import ForecastCard from './components/forecast/ForecastCard';

// Example data (replace with real data or state)
const mockWeatherData = {
  temp: 22,
  feelsLike: 24,
  condition: 'Partly Cloudy',
  humidity: 60,
  windSpeed: 12,
  pressure: 1012,
  aqi: 45
};
const mockLocation = 'San Francisco';

// Example hourly and daily forecast data
const mockHourlyForecasts = [
  { id: 1, time: '08:00', temperature: 20, feelsLike: 19, condition: 'Clear', icon: '☀️', windSpeed: 10, humidity: 55, pressure: 1010, uvIndex: 2, aqi: 40 },
  { id: 2, time: '09:00', temperature: 21, feelsLike: 20, condition: 'Cloudy', icon: '🌥️', windSpeed: 12, humidity: 57, pressure: 1011, uvIndex: 3, aqi: 42 },
  // ...more hours
];

const mockDailyForecasts = [
  { id: 1, day: 'Monday', location: mockLocation, temperature: 22, feelsLike: 21, condition: 'Rain', icon: '🌧️', windSpeed: 15, humidity: 70, pressure: 1008, uvIndex: 1, aqi: 50 },
  { id: 2, day: 'Tuesday', location: mockLocation, temperature: 24, feelsLike: 23, condition: 'Clear', icon: '☀️', windSpeed: 10, humidity: 60, pressure: 1012, uvIndex: 5, aqi: 45 },
  // ...more days
];

function App() {
  return (
    <div className="app-container">
      <Header />
      <Hero 
        weatherData={mockWeatherData}
        userLocation={mockLocation}
        essentials={mockWeatherData}
      />
      <section className="forecast-section">
        <h2>Hourly Forecast</h2>
        <ForecastList forecasts={mockHourlyForecasts} />
        <h2>Weekly Forecast</h2>
        <ForecastCard forecasts={mockDailyForecasts} />
      </section>
    </div>
  );
}

export default App;