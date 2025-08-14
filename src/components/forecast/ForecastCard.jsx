import React from 'react';
import PropTypes from 'prop-types';
import WeatherCard from '../weather/WeatherCard';
import './ForecastCard.scss';

const ForecastCard = ({
  forecasts = [],
  activeIndex = null,
  onSelect,
  className = '',
  theme = 'light',
  locationName = '',
}) => {
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(idx);
    }
  };

  return (
    <section 
      className={`forecast-card${className ? ` ${className}` : ''}`}
      aria-label={`${locationName ? locationName + ' ' : ''}Daily weather forecast`}
    >
      {forecasts.length === 0 ? (
        <div className="forecast-card__empty" aria-live="polite">
          No daily forecast available.
        </div>
      ) : (
        <ol className="forecast-card__items">
          {forecasts.map((forecast, idx) => (
            <li 
              key={forecast.id || idx}
              className="forecast-card__item"
            >
              <WeatherCard
                location={forecast.location}
                time={forecast.day}
                temperature={forecast.temperature}
                feelsLike={forecast.feelsLike}
                condition={forecast.condition}
                icon={forecast.icon}
                aqi={forecast.aqi}
                windSpeed={forecast.windSpeed}
                humidity={forecast.humidity}
                pressure={forecast.pressure}
                uvIndex={forecast.uvIndex}
                isExpanded={activeIndex === idx}
                onClick={() => onSelect?.(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`forecast-card__card ${activeIndex === idx ? 'active' : ''}`}
                theme={theme}
                tabIndex={0}
                aria-label={`Daily forecast for ${forecast.day}: ${forecast.condition}, ${forecast.temperature}°C`}
                aria-expanded={activeIndex === idx}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

ForecastCard.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    day: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    feelsLike: PropTypes.number,
    condition: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    aqi: PropTypes.number,
    windSpeed: PropTypes.number,
    humidity: PropTypes.number,
    pressure: PropTypes.number,
    uvIndex: PropTypes.number,
  })),
  activeIndex: PropTypes.number,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  locationName: PropTypes.string,
};

ForecastCard.defaultProps = {
  theme: 'light',
};

export default ForecastCard;