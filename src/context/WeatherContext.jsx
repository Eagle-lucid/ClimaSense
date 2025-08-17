// src/context/WeatherContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchWeatherData } from '../utils/api/weatherAPI';
import { fetchAQIData } from '../utils/api/aqiAPI';
import { formatHour, formatDay } from '../utils/helpers/dateFormatter';
import { convertTemp } from '../utils/helpers/tempConverter';
import { DARK_THEME_CONDITIONS } from '../utils/constants';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  // State
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('°C');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('light');

  // Hooks
  const { getGeolocation } = useGeolocation();

  // Initialize from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('lastLocation');
    const savedUnit = localStorage.getItem('temperatureUnit');
    const savedFavorites = localStorage.getItem('weatherFavorites');

    if (savedLocation) setLocation(savedLocation);
    if (savedUnit) setUnit(savedUnit);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('lastLocation', location);
    localStorage.setItem('temperatureUnit', unit);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [location, unit, favorites]);

  // Data transformation
  const transformWeatherData = (weather, aqi, location) => ({
    current: {
      temp: weather.current.temp_c,
      feelsLike: weather.current.feelslike_c ?? weather.current.feelsLike_c,
      condition: weather.current.condition.text,
      icon: weather.current.condition.icon,
      windSpeed: weather.current.wind_kph,
      humidity: weather.current.humidity,
      pressure: weather.current.pressure_mb,
      uvIndex: weather.current.uv,
      aqi: aqi?.data?.aqi || null
    },
    hourly: weather.forecast.forecastday[0].hour.map(hour => ({
      id: hour.time_epoch,
      time: formatHour(hour.time),
      temperature: hour.temp_c,
      feelsLike: hour.feelslike_c ?? hour.feelsLike_c,
      condition: hour.condition.text,
      icon: hour.condition.icon,
      windSpeed: hour.wind_kph,
      humidity: hour.humidity,
      pressure: hour.pressure_mb,
      uvIndex: hour.uv,
      aqi: aqi?.hourly?.find(h => h.time === hour.time)?.aqi || null
    })),
    daily: weather.forecast.forecastday.map(day => ({
      id: day.date_epoch,
      day: formatDay(day.date),
      location,
      temperature: day.day.avgtemp_c,
      feelsLike: day.day.avgtemp_c,
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
      windSpeed: day.day.maxwind_kph,
      humidity: day.day.avghumidity,
      pressure: day.day.pressure_mb, // Fixed: use pressure_mb for pressure
      uvIndex: day.day.uv,
      aqi: aqi?.daily?.find(d => d.date === day.date)?.aqi || null
    }))
  });

  // Theme management
  const setThemeBasedOnWeather = useCallback((condition) => {
    setTheme(DARK_THEME_CONDITIONS.includes(condition) ? 'dark' : 'light');
  }, []);

  // Fetch weather data (main orchestrator)
  const fetchWeather = useCallback(async (searchLocation) => {
    if (!searchLocation?.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [weather, aqi] = await Promise.all([
        fetchWeatherData(searchLocation),
        fetchAQIData(searchLocation)
      ]);

      const transformedData = transformWeatherData(weather, aqi, searchLocation);

      setWeatherData(transformedData);
      setLocation(searchLocation);
      setThemeBasedOnWeather(transformedData.current.condition);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, [setThemeBasedOnWeather]);

  // Temperature conversion
  const applyUnitConversion = useCallback((data) => {
    if (!data) return data;
    return {
      ...data,
      current: {
        ...data.current,
        temp: convertTemp(data.current.temp, unit),
        feelsLike: convertTemp(data.current.feelsLike, unit)
      },
      hourly: data.hourly.map(h => ({
        ...h,
        temperature: convertTemp(h.temperature, unit),
        feelsLike: convertTemp(h.feelsLike, unit)
      })),
      daily: data.daily.map(d => ({
        ...d,
        temperature: convertTemp(d.temperature, unit),
        feelsLike: convertTemp(d.feelsLike, unit)
      }))
    };
  }, [unit]);

  // Update temperatures when unit changes
  useEffect(() => {
    if (weatherData) {
      setWeatherData(prev => applyUnitConversion(prev));
    }
  }, [unit, applyUnitConversion, weatherData]);

  // Geolocation fallback
  const fetchByGeolocation = useCallback(async () => {
    try {
      const coords = await getGeolocation();
      await fetchWeather(`${coords.latitude},${coords.longitude}`);
    } catch {
      setError('Geolocation blocked. Using default location.');
      await fetchWeather("London"); // Fallback Location
    }
  }, [fetchWeather, getGeolocation]);

  // Initial Load
  useEffect(() => {
    if (location) {
      fetchWeather(location);
    } else {
      fetchByGeolocation();
    }
    // Add dependencies for hooks
  }, [location, fetchWeather, fetchByGeolocation]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        location,
        unit,
        isLoading,
        error,
        favorites,
        theme,
        fetchWeather,
        toggleUnit: () => setUnit(prev => prev === '°C' ? '°F' : '°C'),
        addFavorite: (loc) => setFavorites(prev => [...new Set([...prev, loc])]),
        removeFavorite: (loc) => setFavorites(prev => prev.filter(l => l !== loc)),
        fetchByGeolocation,
        setLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};