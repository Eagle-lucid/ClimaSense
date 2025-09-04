// src/context/WeatherContext.jsx
import { useState, useCallback, useEffect } from "react";
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchWeatherData } from '../utils/api/weatherAPI';
import { fetchAQIData } from '../utils/api/aqiAPI';
import { formatHour, formatDay } from '../utils/helpers/dateFormatter';
import { DARK_THEME_CONDITIONS } from '../utils/constants';
import { WeatherContext } from "./WeatherContext";

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('°C');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('light');
  const { getGeolocation } = useGeolocation();

  // Try geolocation on mount, fallback to default if blocked
  useEffect(() => {
    const fetchInitialWeather = async () => {
      setIsLoading(true);
      setError('');
      try {
        const coords = await getGeolocation();
        const geoLocation = `${coords.latitude},${coords.longitude}`; // Removed space
        setLocation(geoLocation);
        await fetchWeather(geoLocation);
      } catch (geoError) {
        console.error(geoError);
        setError('Geolocation blocked. Please search for a city manually.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch weather when location changes (user search, etc.)
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
      const transformedData = {
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
          location: searchLocation,
          temperature: day.day.avgtemp_c,
          feelsLike: day.day.avgtemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          windSpeed: day.day.maxwind_kph,
          humidity: day.day.avghumidity,
          pressure: day.day.pressure_mb,
          uvIndex: day.day.uv,
          aqi: aqi?.daily?.find(d => d.date === day.date)?.aqi || null
        }))
      };
      setWeatherData(transformedData);
      setTheme(DARK_THEME_CONDITIONS.includes(transformedData.current.condition) ? 'dark' : 'light');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      throw err; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to handle search from SearchBar component
  const handleSearch = useCallback(async (query) => {
    setLocation(query);
    await fetchWeather(query);
  }, [fetchWeather]);

  // Function to handle geolocation from search bar component 
  const handleGeolocate = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const coords = await getGeolocation();
      const geoLocation = `${coords.latitude},${coords.longitude}`; // Removed space
      setLocation(geoLocation);
      await fetchWeather(geoLocation);
    } catch (geoError) {
      setError('Unable to retrieve your location. Please try again.');
      throw geoError; 
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeather, getGeolocation]);

  // Function to handle unit toggle
  const handleUnitToggle = useCallback(() => {
    setUnit(prev => prev === '°C' ? '°F' : '°C');
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        location,
        unit: unit === '°C' ? 'C' : 'F',
        isLoading,
        error,
        favorites,
        theme,
        fetchWeather,
        onSearch: handleSearch,
        onGeolocate: handleGeolocate,
        onUnitToggle: handleUnitToggle,
        setLocation,
        addFavorite: (loc) => setFavorites(prev => [...new Set([...prev, loc])]),
        removeFavorite: (loc) => setFavorites(prev => prev.filter(l => l !== loc)),
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}