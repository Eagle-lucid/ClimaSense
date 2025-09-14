// src/components/weather/WeatherCard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './WeatherCard.scss';

const WeatherCard = ({
  // Identity & Location
  id,
  locationName,
  locationCountry,
  timestamp,        
  timezone,         

  // Core Weather Data
  temperature,
  feelsLike,
  condition,
  iconCode, // This should be the FULL URL from WeatherAPI.com

  // Detailed Metrics
  humidity,
  windSpeed,
  pressure,
  uvIndex,
  aqi,

  // State & Interaction
  isExpanded,
  onExpand,
  onAddFavorite,
  onCompare,
  isFavorite = false,
  isCompared = false,

  // Theming
  theme = 'dark',
}) => {
  // Derived State for the 'Temporal' feel
  const [localTime, setLocalTime] = useState('--:--');
  const [isAnimating, setIsAnimating] = useState(false);

  // Update time every minute
  useEffect(() => {
    if (!timestamp || !timezone) return;

    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: timezone
        });
        const date = new Date(timestamp * 1000);
        setLocalTime(formatter.format(date));
      } catch (error) {
        console.error("Error formatting time:", error);
        setLocalTime('--:--');
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, [timestamp, timezone]);

  // Handle the expansion animation sequence
  useEffect(() => {
    if (isExpanded !== undefined) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Handler for all click events on the card body
  const handleClick = () => {
    onExpand?.();
  };

  // Handler for favorite action
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onAddFavorite?.();
  };

  // Handler for compare action
  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompare?.();
  };

  // ✅ FIXED: WeatherAPI.com provides complete URLs, no need to construct them
  // If iconCode is a full URL, use it directly. If it's just a code, use OpenWeatherMap format.
  const getIconUrl = (code) => {
    if (code?.startsWith('http') || code?.startsWith('//')) {
      return code; // Already a full URL from WeatherAPI.com
    }
    return `https://openweathermap.org/img/wn/${code}@2x.png`; // Fallback for OpenWeatherMap codes
  };

  // Determine AQI category
  const getAqiCategory = (aqiValue) => {
    if (aqiValue == null) return 'unknown';
    if (aqiValue <= 50) return 'good';
    if (aqiValue <= 100) return 'moderate';
    if (aqiValue <= 150) return 'unhealthy-sensitive';
    if (aqiValue <= 200) return 'unhealthy';
    if (aqiValue <= 300) return 'very-unhealthy';
    return 'hazardous';
  };
  const aqiCategory = getAqiCategory(aqi);

  // Check if any details exist to show the expand button
  const hasDetails = humidity != null || windSpeed != null || pressure != null || uvIndex != null || aqi != null;

  return (
    <article
      id={id}
      className={`
        weather-capsule
        weather-capsule--theme-${theme}
        ${isExpanded ? 'weather-capsule--expanded' : ''}
        ${isAnimating ? 'weather-capsule--animating' : ''}
        weather-capsule--aqi-${aqiCategory}
      `}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Weather capsule for ${locationName}. ${isExpanded ? 'Expanded' : 'Collapsed'}. Press to ${isExpanded ? 'collapse' : 'expand'} for details.`}
      aria-expanded={isExpanded}
    >
      {/* Header - Location & Time */}
      <header className="weather-capsule__header">
        <div className="weather-capsule__location">
          <h2 className="weather-capsule__city">{locationName || 'Unknown Location'}</h2>
          {locationCountry && <span className="weather-capsule__country">{locationCountry}</span>}
        </div>
        <div className="weather-capsule__time" aria-live="off">
          {localTime}
        </div>
      </header>

      {/* Main Content - The Essential Snapshot */}
      <div className="weather-capsule__main">
        {iconCode && (
          <img
            src={getIconUrl(iconCode)} // ✅ Now handles both URL formats
            alt={condition || ''}
            className="weather-capsule__icon"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="weather-capsule__temps">
          <span className="weather-capsule__temp">
            {temperature != null ? `${Math.round(temperature)}°C` : '--'}
          </span>
          {feelsLike != null && (
            <span className="weather-capsule__feels-like">
              Feels like {Math.round(feelsLike)}°C
            </span>
          )}
        </div>
      </div>

      {/* Condition & AQI */}
      <div className="weather-capsule__meta">
        {condition && (
          <p className="weather-capsule__condition text-capitalize">
            {condition}
          </p>
        )}
        {aqi != null && (
          <div className="weather-capsule__aqi-indicator">
            <span className="weather-capsule__aqi-label">Air Quality</span>
            <span className={`weather-capsule__aqi-value weather-capsule__aqi-value--${aqiCategory}`}>
              {aqi}
            </span>
          </div>
        )}
      </div>

      {/* Expanded Details - The "Unfurling" */}
      {isExpanded && hasDetails && (
        <div className="weather-capsule__details">
          <div className="weather-capsule__details-grid">
            {humidity != null && (
              <div className="weather-capsule__detail" aria-label={`Humidity: ${humidity} percent`}>
                <span className="weather-capsule__detail-label">💧 Humidity</span>
                <span className="weather-capsule__detail-value">{humidity}%</span>
              </div>
            )}
            {windSpeed != null && (
              <div className="weather-capsule__detail" aria-label={`Wind speed: ${windSpeed} kilometers per hour`}>
                <span className="weather-capsule__detail-label">🌬️ Wind</span>
                <span className="weather-capsule__detail-value">{windSpeed} km/h</span>
              </div>
            )}
            {pressure != null && (
              <div className="weather-capsule__detail" aria-label={`Pressure: ${pressure} hectopascals`}>
                <span className="weather-capsule__detail-label">📊 Pressure</span>
                <span className="weather-capsule__detail-value">{pressure} hPa</span>
              </div>
            )}
            {uvIndex != null && (
              <div className="weather-capsule__detail" aria-label={`UV Index: ${uvIndex}`}>
                <span className="weather-capsule__detail-label">☀️ UV</span>
                <span className="weather-capsule__detail-value">{uvIndex}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Bar - Favorite, Compare, Expand */}
      <footer className="weather-capsule__actions">
        <button
          type="button"
          className={`weather-capsule__btn weather-capsule__btn--favorite ${isFavorite ? 'weather-capsule__btn--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${locationName} from favorites` : `Add ${locationName} to favorites`}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <button
          type="button"
          className={`weather-capsule__btn weather-capsule__btn--compare ${isCompared ? 'weather-capsule__btn--active' : ''}`}
          onClick={handleCompareClick}
          aria-label={isCompared ? `Remove from comparison` : `Add to comparison`}
        >
          {isCompared ? '✓' : '⇄'}
        </button>

        {hasDetails && (
          <button
            type="button"
            className="weather-capsule__btn weather-capsule__btn--expand"
            onClick={(e) => { e.stopPropagation(); onExpand?.(); }}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        )}
      </footer>
    </article>
  );
};

WeatherCard.propTypes = {
  id: PropTypes.string,
  locationName: PropTypes.string,
  locationCountry: PropTypes.string,
  timestamp: PropTypes.number,   
  timezone: PropTypes.string,    
  temperature: PropTypes.number,
  feelsLike: PropTypes.number,
  condition: PropTypes.string,
  iconCode: PropTypes.string, // Can be OpenWeatherMap code or WeatherAPI.com full URL
  humidity: PropTypes.number,
  windSpeed: PropTypes.number,
  pressure: PropTypes.number,
  uvIndex: PropTypes.number,
  aqi: PropTypes.number,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  onAddFavorite: PropTypes.func,
  onCompare: PropTypes.func,
  isFavorite: PropTypes.bool,
  isCompared: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default WeatherCard;