import React from 'react';
import PropTypes from 'prop-types';
import './HourlyForecastList.scss';

const HourlyForecastList = ({
  forecasts = [],
  timezone,
  isExpanded,
  onExpand,
  className = '',
  theme = 'dark',
}) => {
  const formatHour = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', timeZone: timezone });
  };

  if (forecasts.length === 0) {
    return (
      <section className={`hourly-forecast ${className}`} aria-label='Hourly forecast'>
        <div className="hourly-forecast__empty" aria-live='polite'>
          No hourly forecast data available.
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`hourly-forecast hourly-forecast--theme-${theme}
                ${isExpanded ? 'hourly-forecast--expanded' : ''}
                ${className}
              `}
      aria-label="24-hour weather forecast"
    >
      <header className="hourly-forecast__header">
        <h2 className="hourly-forecast__title">Today's Timeline</h2>
        <button
          type='button'
          className='hourly-forecast__expand-btn'
          onClick={onExpand}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse hourly forecast' : 'Expand hourly forecast'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
      </header>

      {isExpanded && (
        <div className="hourly-forecast__scroller">
          <ol className="hourly-forecast__list">
            {forecasts.slice(0, 24).map((hour) => (
              <li key={hour.dt} className='hourly-forecast__item'>
                <article className="hourly-capsule"
                         tabIndex={0}
                         aria-label={`${formatHour(hour.dt)} : ${hour.temp}°C, ${hour.weather[0].description}`}       
                >
                  <time dateTime={new Date(hour.dt * 1000).toISOString()}  className="hourly-capsule__time">
                    {formatHour(hour.dt)}
                  </time>
                  <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description}
                      className='hourly-capsule__icon' loading='lazy' 
                  />
                  <div className="hourly-capsule__temp">
                    {Math.round(hour.temp)}°C
                  </div>
                  <div className="hourly-capsule__pop" aria-label={`${hour.pop * 100}% chance of precipitation`}>
                    💧 {Math.round(hour.pop * 100)}%
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};

HourlyForecastList.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape({
    dt: PropTypes.number.isRequired,        
    temp: PropTypes.number.isRequired,      
    weather: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })).isRequired,
    pop: PropTypes.number,                  
  })),
  timezone: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default HourlyForecastList;