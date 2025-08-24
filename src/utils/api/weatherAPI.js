// src/utils/api/weatherAPI.js
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../constants.js';
/** 
 * Fetch weather data (current + forecast) from WeatherAPI.com
 * @param {string} location - Location query (city name, coordinates, etc.)
 * @param {number} days - Number of forecast days (default: 7).
 * @return {Promise<Object>} - Weather data JSON
 */

export async function fetchWeatherData(location, days = 7) {
  if (!location || location.trim() === '') {
    throw new Error("Location is required to fetch weather data.");
  }
   if (!WEATHER_API_KEY) {
    throw new Error("Weather API key is missing. Please set it in the environment variables.");
   }

   const url = `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=yes&alerts=no`;

   try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorMsg = `Weather API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg += errorData?.error?.message ? ` - ${errorData.error.message}` : '';
      } catch {
        // Ignore JSON parsing errors
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
   } catch (error) {
    console.error("FetchWeatherData failed:", error.message);
    throw error;
   }
} 