// src/components/forecast/HourlyForecastList.jsx
import PropTypes from 'prop-types';
import './HourlyForecastList.scss';

const HourlyForecastList = ({
  forecasts = [],
  isExpanded,
  onExpand,
  className = '',
  theme = 'dark',
}) => {
  
  const formatHour = (timeString) => {
    return timeString; 
  };

  if (forecasts.length === 0) {
    return (
      <section className={`hourly-forecast ${className}`} aria-label="Hourly forecast">
        <div className="hourly-forecast__empty" aria-live="polite">
          No hourly forecast data available.
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`
        hourly-forecast
        hourly-forecast--theme-${theme}
        ${isExpanded ? 'hourly-forecast--expanded' : ''}
        ${className}
      `}
      aria-label="24-hour weather forecast"
    >
      <header className="hourly-forecast__header">
        <h2 className="hourly-forecast__title">Today's Timeline</h2>
        <button
          type="button"
          className="hourly-forecast__expand-btn"
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
              <li key={hour.id} className="hourly-forecast__item">
                <article 
                  className="hourly-capsule"
                  tabIndex={0}
                  aria-label={`${formatHour(hour.time)}: ${hour.temperature}°C, ${hour.condition}`}
                >
                  <time className="hourly-capsule__time">
                    {formatHour(hour.time)}
                  </time>
                  <img 
                    src={hour.icon} 
                    alt={hour.condition} 
                    className="hourly-capsule__icon"
                    loading="lazy"
                  />
                  <div className="hourly-capsule__temp">
                    {Math.round(hour.temperature)}°C
                  </div>
                  <div className="hourly-capsule__pop" aria-label={`${Math.round((hour.pop || 0) * 100)}% chance of precipitation`}>
                    💧 {Math.round((hour.pop || 0) * 100)}%
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
    id: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
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

export default HourlyForecastList;