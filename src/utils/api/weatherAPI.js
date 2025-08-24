// src/utils/api/weatherAPI.js
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../constants';

export async function fetchWeatherData(location) {
  if (!location || location.trim() === "") {
    throw new Error("Location is required to fetch weather data.");
  }

  try {
    const url = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=no`;
    console.log(" Fetching weather from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(" Weather API Error:", response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(" Weather API Data:", data);
    return data;
  } catch (error) {
    console.error(" fetchWeatherData crashed:", error.message);
    throw error;
  }
}
