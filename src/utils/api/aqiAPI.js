// src/utils/api/aqiAPI.js
import { WEATHER_API_KEY } from '../constants';

/**
 * Fetches Air Quality Index (AQI) data from WeatherAPI.com
 * @returns {Promise<object>} AQI data in JSON format
 */
export async function fetchAQIData() {
  try {
    // Ensure API key exists
    if (!WEATHER_API_KEY) {
      throw new Error('Missing API Key: Check your .env file for VITE_WEATHER_API_KEY');
    }

    // WeatherAPI.com provides AQI data in the same response as weather data
    // This function is now a placeholder since AQI data is included in weather API response
    return {
      data: { aqi: null },
      hourly: [],
      daily: []
    };
  } catch (error) {
    console.error('fetchAQIData failed:', error.message);
    throw error;
  }
}
