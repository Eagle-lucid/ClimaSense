import React from 'react';
import PropTypes from 'prop-types';
import './DailyForecastList.scss'; // Consistent file naming

const DailyForecastList = ({
  forecasts = [],
  timezone,
  isExpanded,
  onExpand,
  className = '',
  theme = 'dark'
}) => {
  // Robust function to check if two dates are the same day (ignoring time)
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isTomorrow = (date, today) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(date, tomorrow);
  };

  const formatDay = (timestamp) => {
    const today = new Date();
    const forecastDate = new Date(timestamp * 1000);

    if (isSameDay(forecastDate, today)) return 'Today';
    if (isTomorrow(forecastDate, today)) return 'Tomorrow';

    return forecastDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone });
  };

  if (forecasts.length === 0) {
    return (
      <section className={`daily-forecast ${className}`} aria-label="Daily forecast">
        <div className="daily-forecast__empty" aria-live="polite">
          No daily forecast data available.
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`
        daily-forecast 
        daily-forecast--theme-${theme}
        ${isExpanded ? 'daily-forecast--expanded' : ''}
        ${className}
      `}
      aria-label="7-day weather forecast"
    >
     <header className="daily-forecast__header">
      <h2 className="daily-forecast__title">
        7-Day Forecast
      </h2>
      <button
        type="button"
        className="daily-forecast__expand-btn"
        onClick={onExpand}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse daily forecast' : 'Expand daily forecast'}
      >
        {isExpanded ? '▲' : '▼'}
      </button>
     </header>

     {isExpanded && (
      <ol className="daily-forecast__list">
        {forecasts.slice(0, 7).map((day) => (
          <li className="daily-forecast__item" key={day.dt}>
            <article className="daily-capsule">
              <time dateTime={new Date(day.dt * 1000).toISOString()} className="daily-capsule__day">
                {formatDay(day.dt)}
              </time>

              <div className="daily-capsule__weather"> 
                <img 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                    alt={day.weather[0].description} 
                    className="daily-capsule__icon"
                    loading="lazy"
                  />
                  <span className="daily-capsule__condition text-capitalize">
                    {day.weather[0].description}
                  </span>
              </div>

              {/* Show both HIGH and LOW temperatures */}
              <div className="daily-capsule__temps">
                <span className="daily-capsule__high" aria-label={`High temperature: ${Math.round(day.temp.max)}°C`}>
                  {Math.round(day.temp.max)}°C
                </span>
                <span className="daily-capsule__low" aria-label={`Low temperature: ${Math.round(day.temp.min)}°C`}>
                  {Math.round(day.temp.min)}°C
                </span>
              </div>

              <div className="daily-capsule__rain" aria-label={`${Math.round(day.pop * 100)}% chance of precipitation`}>
                💧 {Math.round(day.pop * 100)}%
              </div>
            </article>
          </li>
        ))}
      </ol>
     )}
    </section>
  );
};

DailyForecastList.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape({
    dt: PropTypes.number.isRequired,
    temp: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
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

export default DailyForecastList;