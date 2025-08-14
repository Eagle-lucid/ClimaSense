import React from 'react';
import PropTypes from 'prop-types';
import WeatherCard from '../weather/WeatherCard';
import './ForecastList.scss';

const ForecastList = ({
  forecasts = [],
  activeIndex = null,
  onSelect,
  className = '',
  theme = 'light',
}) => {
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(idx);
    }
  };

  return (
    <section 
      className={`forecast-list${className ? ` ${className}` : ''}`}
      aria-label="Hourly weather forecast"
    >
      {forecasts.length === 0 ? (
        <div className="forecast-list__empty" aria-live="polite">
          No hourly forecast available.
        </div>
      ) : (
        <ol className="forecast-list__items">
          {forecasts.map((forecast, idx) => (
            <li 
              key={forecast.id || idx}
              className="forecast-list__item"
            >
              <WeatherCard
                time={forecast.time}
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
                className={`forecast-list__card ${activeIndex === idx ? 'active' : ''}`}
                theme={theme}
                tabIndex={0}
                aria-label={`Hourly forecast for ${forecast.time}: ${forecast.condition}, ${forecast.temperature}°C`}
                aria-expanded={activeIndex === idx}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

ForecastList.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    time: PropTypes.string.isRequired,
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
};

ForecastList.defaultProps = {
  theme: 'light',
};

export default ForecastList;