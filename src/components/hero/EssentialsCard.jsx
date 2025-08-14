import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  IconTemperature, 
  IconDroplet, 
  IconWind, 
  IconGauge, 
  IconMaximize, 
  IconMinimize 
} from '@tabler/icons-react';
import './EssentialsCard.scss';

const EssentialsCard = ({ weatherData = {}, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize essentials data for performance
  const essentials = useMemo(() => [
    { 
      label: 'Feels Like', 
      value: `${weatherData.feelsLike || '--'}°C`, 
      icon: <IconTemperature size={20} />
    },
    { 
      label: 'Humidity', 
      value: `${weatherData.humidity || '--'}%`, 
      icon: <IconDroplet size={20} />
    },
    { 
      label: 'Wind', 
      value: `${weatherData.windSpeed || '--'} km/h`, 
      icon: <IconWind size={20} />
    },
    { 
      label: 'Pressure', 
      value: `${weatherData.pressure || '--'} hPa`, 
      icon: <IconGauge size={20} />
    }
  ], [weatherData]);

  // Safe AQI handling with fallback
  const aqiValue = weatherData.aqi ?? '--';
  const aqiCategory = getAQICategory(aqiValue);

  return (
    <div className={`essentials-card ${className.trim()} ${isExpanded ? 'expanded' : ''}`}>
      {/* Compact View */}
      <div className="essentials-card__compact">
        <div className="essentials-card__temp">
          <span className="temp-value">
            {weatherData.temp || '--'}°C
          </span>
          <span className="temp-condition">
            {weatherData.condition || 'N/A'}
          </span>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          className="essentials-card__expand-btn"
          type="button"
        >
          {isExpanded ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
        </button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="essentials-card__details">
          {essentials.map((item, index) => (
            <div key={index} className="essentials-card__detail">
              <div className="detail-icon">{item.icon}</div>
              <div className="detail-info">
                <span className="detail-label">{item.label}</span>
                <span className="detail-value">{item.value}</span>
              </div>
            </div>
          ))}

          {/* Air Quality with fallback */}
          <div className="essentials-card__aqi">
            <span>Air Quality</span>
            {aqiValue !== '--' ? (
              <div 
                className={`aqi-indicator aqi-${aqiCategory}`}
                aria-label={`Air quality is ${aqiCategory}`}
              >
                {aqiValue}
              </div>
            ) : (
              <div className="aqi-indicator aqi-unknown">--</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// AQI Category Helper with fallback
const getAQICategory = (aqi) => {
  if (aqi === '--') return 'unknown';
  const value = Number(aqi);
  if (value <= 50) return 'good';
  if (value <= 100) return 'moderate';
  if (value <= 150) return 'unhealthy-sensitive';
  if (value <= 200) return 'unhealthy';
  return 'hazardous';
};

// Prop type validation
EssentialsCard.propTypes = {
  weatherData: PropTypes.shape({
    temp: PropTypes.number,
    feelsLike: PropTypes.number,
    condition: PropTypes.string,
    humidity: PropTypes.number,
    windSpeed: PropTypes.number,
    pressure: PropTypes.number,
    aqi: PropTypes.number
  }),
  className: PropTypes.string
};

export default EssentialsCard;