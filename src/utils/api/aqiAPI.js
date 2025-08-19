// src/utils/aqi/aqiAPI.js
import { OPENWEATHER_API_KEY, AQI_BASE_URL } from '../constants';

/**
 * Fetches Air Quality Index (AQI) data from OpenWeather API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} AQI data in JSON format
 */
export async function fetchAQIData(lat, lon) {
  try {
    //  Ensure API key exists
    if (!OPENWEATHER_API_KEY) {
      throw new Error('Missing API Key: Check your .env file for VITE_OPENWEATHER_API_KEY');
    }

    //  Ensure coordinates are valid
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error('Invalid coordinates: Latitude and Longitude must be numbers');
    }

    const url = `${AQI_BASE_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    //  Handle failed responses
    if (!response.ok) {
      throw new Error(`AQI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    //  Verify expected structure
    if (!data || !data.list) {
      throw new Error('Invalid AQI data structure from API');
    }

    return data;
  } catch (error) {
    console.error('fetchAQIData failed:', error.message);
    throw error; // rethrow so caller can handle gracefully
  }
}
