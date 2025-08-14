// src/components/weather/WeatherCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './WeatherCard.scss';

const WeatherCard = ({
  location,
  time,
  temperature,
  feelsLike,
  condition,
  icon,
  aqi,
  windSpeed = null,
  humidity = null,
  pressure = null,
  uvIndex = null,
  isFavorite = false,
  isCompared = false,
  isExpanded = false,
  onAddFavorite,
  onCompare,
  onExpand,
  onClick,
  className = '',
  theme = 'light',
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onAddFavorite?.();
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompare?.();
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onExpand?.(!isExpanded);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard interactions for expand/collapse
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.target === e.currentTarget) {
        onClick?.();
      } else if (e.target.classList.contains('weather-card__expand-btn')) {
        handleExpandClick(e);
      }
    }
  };

  const hasDetails = windSpeed != null || humidity != null || pressure != null || uvIndex != null;

  return (
    <div
      className={`weather-card 
        ${isFavorite ? ' weather-card--favorite' : ''}
        ${isCompared ? ' weather-card--compared' : ''}
        ${isExpanded ? ' weather-card--expanded' : ''}
        ${className ? ` ${className}` : ''}
        theme-${theme}`}
      tabIndex={0}
      role="button"
      aria-label={`Weather information for ${location || 'unknown location'}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="weather-card__header">
        {location && <h2 className="weather-card__location">{location}</h2>}
        {time && <span className="weather-card__time">{time}</span>}
      </div>

      <div className="weather-card__main">
        <div className="weather-card__icon">{icon}</div>
        <div className="weather-card__temp">
          {temperature != null ? `${Math.round(temperature)}°C` : '--'}
          {feelsLike != null && (
            <span className="weather-card__feelslike">
              Feels like {Math.round(feelsLike)}°C
            </span>
          )}
        </div>
      </div>

      <div className="weather-card__details">
        <span className="weather-card__condition">{condition}</span>
        {aqi != null && (
          <span className="weather-card__aqi">AQI: {aqi}</span>
        )}
      </div>

      {isExpanded && hasDetails && (
        <div className="weather-card__expanded-details">
          {windSpeed != null && (
            <div className="weather-card__detail">
              <span>🌬️ Wind</span>
              <span>{windSpeed} km/h</span>
            </div>
          )}
          {humidity != null && (
            <div className="weather-card__detail">
              <span>💧 Humidity</span>
              <span>{humidity}%</span>
            </div>
          )}
          {pressure != null && (
            <div className="weather-card__detail">
              <span>📊 Pressure</span>
              <span>{pressure} hPa</span>
            </div>
          )}
          {uvIndex != null && (
            <div className="weather-card__detail">
              <span>☀️ UV Index</span>
              <span>{uvIndex}</span>
            </div>
          )}
        </div>
      )}

      <div className="weather-card__actions">
        {onAddFavorite && (
          <button
            type="button"
            className={`weather-card__favorite-btn ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
        {onCompare && (
          <button
            type="button"
            className={`weather-card__compare-btn ${isCompared ? 'active' : ''}`}
            aria-label={isCompared ? 'Remove from comparison' : 'Compare'}
            onClick={handleCompareClick}
          >
            {isCompared ? '✓ Compared' : 'Compare'}
          </button>
        )}
        {hasDetails && (
          <button
            type="button"
            className="weather-card__expand-btn"
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            onClick={handleExpandClick}
            tabIndex={0}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  location: PropTypes.string,
  time: PropTypes.string,
  temperature: PropTypes.number,
  feelsLike: PropTypes.number,
  condition: PropTypes.string,
  icon: PropTypes.node,
  aqi: PropTypes.number,
  windSpeed: PropTypes.number,
  humidity: PropTypes.number,
  pressure: PropTypes.number,
  uvIndex: PropTypes.number,
  isFavorite: PropTypes.bool,
  isCompared: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onAddFavorite: PropTypes.func,
  onCompare: PropTypes.func,
  onExpand: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default WeatherCard;