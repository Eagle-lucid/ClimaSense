// src/utils/aqi/weatherAPI.js
import { OPENWEATHER_API_KEY, WEATHER_BASE_URL, FORECAST_BASE_URL } from '../constants';

export async function fetchWeatherData(city) {
    const response =await fetch(`${WEATHER_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
}

export async function fetchForecastData(city) {
    const response = await fetch(`${FORECAST_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
}