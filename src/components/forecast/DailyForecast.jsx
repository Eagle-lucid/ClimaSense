// src/components/forecast/DailyForecastList.jsx
import PropTypes from 'prop-types';
import './DailyForecastList.scss';

const DailyForecastList = ({
  forecasts = [],
  isExpanded,
  onExpand,
  className = '',
  theme = 'dark',
}) => {
  // WeatherAPI.com already provides formatted day names
  const formatDay = (dayString) => {
    return dayString; // Already formatted as 'Saturday', 'Sunday', etc.
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
      aria-label="3-day weather forecast"
    >
      <header className="daily-forecast__header">
        <h2 className="daily-forecast__title">3-Day Forecast</h2>
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
            <li key={day.id} className="daily-forecast__item">
              <article className="daily-capsule">
                <time className="daily-capsule__day">
                  {formatDay(day.day)}
                </time>
                
                <div className="daily-capsule__weather">
                  <img 
                    src={day.icon} 
                    alt={day.condition} 
                    className="daily-capsule__icon"
                    loading="lazy"
                  />
                  <span className="daily-capsule__condition text-capitalize">
                    {day.condition}
                  </span>
                </div>
                
                {/* WeatherAPI.com provides single temperature, not min/max */}
                <div className="daily-capsule__temp" aria-label={`Temperature: ${Math.round(day.temperature)}°C`}>
                  {Math.round(day.temperature)}°C
                </div>

                <div className="daily-capsule__rain" aria-label={`${Math.round((day.pop || 0) * 100)}% chance of precipitation`}>
                  💧 {Math.round((day.pop || 0) * 100)}%
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
    id: PropTypes.number.isRequired,
    day: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    condition: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    pop: PropTypes.number,
  })),
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default DailyForecastList;