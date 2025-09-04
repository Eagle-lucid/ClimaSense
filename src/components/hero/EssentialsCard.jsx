// src/components/hero/EssentialCard.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  const [height, setHeight] = useState('0px');
  const contentRef = useRef(null);

  // Normalize safe data with proper fallbacks
  const safeData = useMemo(() => ({
    temp: weatherData?.temp ?? null,
    feelsLike: weatherData?.feelsLike ?? null,
    condition: weatherData?.condition ?? 'N/A',
    humidity: weatherData?.humidity ?? null,
    windSpeed: weatherData?.windSpeed ?? null,
    pressure: weatherData?.pressure ?? null,
    aqi: weatherData?.aqi ?? null,
  }), [weatherData]);

  // Essentials list with accessibility and formatting
  const essentials = useMemo(() => [
    { 
      label: 'Feels Like', 
      value: safeData.feelsLike != null ? `${Math.round(safeData.feelsLike)}°C` : '--', 
      icon: <IconTemperature size={20} aria-hidden="true" />
    },
    { 
      label: 'Humidity', 
      value: safeData.humidity != null ? `${safeData.humidity}%` : '--', 
      icon: <IconDroplet size={20} aria-hidden="true" />
    },
    { 
      label: 'Wind', 
      value: safeData.windSpeed != null ? `${Math.round(safeData.windSpeed)} km/h` : '--', 
      icon: <IconWind size={20} aria-hidden="true" />
    },
    { 
      label: 'Pressure', 
      value: safeData.pressure != null ? `${safeData.pressure} hPa` : '--', 
      icon: <IconGauge size={20} aria-hidden="true" />
    }
  ], [safeData]);

  // AQI calculation with proper categorization
  const { aqiValue, aqiCategory } = useMemo(() => {
    const aqiValue = safeData.aqi != null ? Math.round(safeData.aqi) : '--';
    let aqiCategory = 'unknown';
    
    if (typeof aqiValue === 'number') {
      if (aqiValue <= 50) aqiCategory = 'good';
      else if (aqiValue <= 100) aqiCategory = 'moderate';
      else if (aqiValue <= 150) aqiCategory = 'unhealthy-sensitive';
      else if (aqiValue <= 200) aqiCategory = 'unhealthy';
      else if (aqiValue <= 300) aqiCategory = 'very-unhealthy';
      else aqiCategory = 'hazardous';
    }
    
    return { aqiValue, aqiCategory };
  }, [safeData.aqi]);

  // Expand/collapse animation
  useEffect(() => {
    if (isExpanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isExpanded]);

  // Handlers
  const handleToggleExpand = () => setIsExpanded(prev => !prev);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleExpand();
    }
  };

  return (
    <div className={`essentials-card ${className.trim()} ${isExpanded ? 'expanded' : ''}`}>
      {/* Compact view */}
      <div className="essentials-card__compact d-flex justify-content-between align-items-center p-3">
        <div className="essentials-card__temp">
          <span className="temp-value display-6 fw-bold">
            {safeData.temp != null ? `${Math.round(safeData.temp)}°C` : '--'}
          </span>
          <span className="temp-condition text-capitalize">
            {safeData.condition}
          </span>
        </div>

        <button
          onClick={handleToggleExpand}
          onKeyPress={handleKeyPress}
          aria-expanded={isExpanded}
          aria-controls="essentials-details"
          aria-label={isExpanded ? 'Collapse weather details' : 'Expand weather details'}
          className="essentials-card__expand-btn btn btn-sm btn-outline-light rounded-circle"
          type="button"
        >
          {isExpanded ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
        </button>
      </div>

      {/* Expanded view */}
      <div
        ref={contentRef}
        id="essentials-details"
        role="region"
        aria-hidden={!isExpanded}
        className="essentials-card__details-wrapper"
        style={{ height }}
      >
        <div className="essentials-card__details p-3">
          {essentials.map((item, index) => (
            <div key={index} className="essentials-card__detail d-flex align-items-center mb-2">
              <div className="detail-icon me-2 text-muted">{item.icon}</div>
              <div className="detail-info d-flex justify-content-between w-100">
                <span className="detail-label fw-medium">{item.label}</span>
                <span className="detail-value">{item.value}</span>
              </div>
            </div>
          ))}

          {/* AQI Section */}
          <div className="essentials-card__aqi mt-3 pt-2 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-medium">Air Quality</span>
              <div
                className={`aqi-indicator aqi-${aqiCategory} badge rounded-pill`}
                aria-label={`Air quality is ${aqiCategory}`}
              >
                {aqiValue}
              </div>
            </div>
            {typeof aqiValue === 'number' && (
              <small className="text-muted d-block mt-1">
                {aqiCategory.replace(/-/g, ' ').toUpperCase()}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EssentialsCard.propTypes = {
  weatherData: PropTypes.shape({
    temp: PropTypes.number,
    feelsLike: PropTypes.number,
    condition: PropTypes.string,
    humidity: PropTypes.number,
    windSpeed: PropTypes.number,
    pressure: PropTypes.number,
    aqi: PropTypes.number,
  }),
  className: PropTypes.string,
};

EssentialsCard.defaultProps = {
  weatherData: {},
  className: ''
};

export default EssentialsCard;
