// src/components/hero/WeatherNarrator.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { IconShare, IconBike, IconCar, IconHome } from '@tabler/icons-react';
import { Typewriter } from 'react-simple-typewriter';
import './WeatherNarrator.scss';

const WeatherNarrator = ({ weatherData, location }) => {
  // Safe default values for weather data
  const safeWeatherData = useMemo(() => ({
    temp: 0,
    feelsLike: 0,
    windSpeed: 0,
    condition: '',
    ...weatherData
  }), [weatherData]);

  // Username fallback
  const userName = localStorage.getItem('userName') || 'friend';

  // Greetings by time of the day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Normalize weather condition with fallback
  const normalizeCondition = useCallback((condition) => {
    if (!condition) return 'default';
    const lowerCondition = condition.toLowerCase();
    return lowerCondition.includes('cloud') ? 'cloudy' 
         : lowerCondition.includes('rain') ? 'rainy'
         : lowerCondition.includes('snow') ? 'snowy'
         : lowerCondition.includes('storm') ? 'stormy'
         : lowerCondition.includes('sun') ? 'sunny'
         : 'default';
  }, []);

  // Weather narrative generator 
  const buildNarrative = useCallback((mode = 'default') => {
    const { temp, feelsLike, windSpeed, condition } = safeWeatherData;
    const normalizedCondition = normalizeCondition(condition);
    const timeOfDay = getTimeOfDay(); 

    const base = {
      sunny: `☀️ Good ${timeOfDay}, ${userName}. The sun is shining bright in ${location || 'your location'} at ${temp}°C. 
             ${feelsLike > temp ? `Feels like ${feelsLike}°C` : ''} 
             ${windSpeed > 15 ? 'with refreshing breezes.' : 'with calm skies.'}`,
      
      rainy: `🌧️ Good ${timeOfDay}, ${userName}. ${timeOfDay === 'morning' ? 'Pack that umbrella!' : 'Rain continues'} 
              in ${location || 'your location'} at ${temp}°C. 
              ${feelsLike < temp ? `Feels ${feelsLike}°C` : ''} 
              ${windSpeed > 10 ? 'with gusty winds.' : 'with steady showers.'}`,

      cloudy: `☁️ Good ${timeOfDay}, ${userName}. Skies are overcast in ${location || 'your location'} at ${temp}°C. 
               Perfect for ${timeOfDay === 'morning' ? 'a cozy breakfast' : 'indoor activities'}.`,

      snowy: `❄️ Good ${timeOfDay}, ${userName}. Snowfall in ${location || 'your location'} at ${temp}°C. 
              Bundle up - feels like ${feelsLike}°C with ${windSpeed}km/h winds.`,

      stormy: `⚡ Storm alert, ${userName}! ${timeOfDay === 'evening' ? 'Stay indoors' : 'Be cautious'} 
               in ${location || 'your location'}. ${temp}°C with heavy winds.`,
               
      default: `🌤️ ${temp}°C and ${condition || 'unknown conditions'} in ${location || 'your location'}`
    };
    
    const modes = {
      car: `${base[normalizedCondition] || base.default} 🚗 Drive safe!`,
      bike: `${base[normalizedCondition] || base.default} 🚴 Perfect ride conditions? Check the wind.`,
      home: `${base[normalizedCondition] || base.default} 🏡 Cozy time indoors.`,
      default: base[normalizedCondition] || base.default,
    }

    return modes[mode] || modes.default;
  }, [safeWeatherData, location, userName, normalizeCondition]); // REMOVED getTimeOfDay from dependencies

  // Lifestyle suggestions with fallbacks
  const getLifestyleTip = useCallback(() => {
    const normalizedCondition = normalizeCondition(safeWeatherData.condition);
    const { temp } = safeWeatherData;
    
    const tips = {
      sunny: temp > 25 ? '☀️ Use sunscreen outdoors.' : '🌳 Great day for outdoor fun.',
      rainy: '🌂 Waterproof shoes recommended.',
      snowy: '❄️ Roads may be slippery. Stay safe.',
      stormy: '⚠️ Best to avoid travel today.',
      default: '✨ Have a wonderful day!',
    };

    return tips[normalizedCondition] || tips.default;
  }, [safeWeatherData, normalizeCondition]);

  // Mode handling 
  const [currentMode, setCurrentMode] = useState('default');
  const [narrative, setNarrative] = useState('');

  // Update narrative when mode or buildNarrative changes
  useEffect(() => {
    setNarrative(buildNarrative(currentMode));
  }, [currentMode, buildNarrative]);

  // Share functionality
  const handleShare = async () => {
    try {
      const shareData = {
        title: `ClimaSense Weather for ${location || 'your location'}`,
        text: narrative,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}`);
        alert('Weather details copied to clipboard!');
      } else {
        throw new Error('Sharing not supported');
      }
    } catch (err) {
      console.error('Share failed:', err);
      alert('Could not share weather details. Try manually copying the text.');
    }
  };

  // Early return if critical data is missing
  if (!weatherData || !weatherData.condition) {
    return (
      <div className="narrator p-3 p-md-4">
        <div className="narrator__message">
          <p className="narrator__text">Loading weather information...</p>
        </div>
      </div>
    );
  }

  const modeConfig = [
    { key: 'car', Icon: IconCar, label: 'Commuter mode' },
    { key: 'bike', Icon: IconBike, label: 'Fitness mode' },
    { key: 'home', Icon: IconHome, label: 'Home mode' }
  ];

  return (
    <div className="narrator p-3 p-md-4">
      {/* Typing animation for narrative */}
      <div className="narrator__message mb-3">
        <p className="narrator__text fs-4">
          <Typewriter
            words={[narrative]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={40}
            deleteSpeed={20}
            delaySpeed={2000}
          />
        </p>

        <p className="narrator__tip text-muted mt-2">{getLifestyleTip()}</p>
      </div>
      
      {/* Controls */}
      <div className="narrator__controls d-flex align-items-center justify-content-between">
        <button 
          onClick={handleShare}
          aria-label="Share weather"
          className="narrator__share btn btn-outline-primary btn-sm d-flex align-items-center"
          type="button"
        >
          <IconShare size={18} className="me-1" />
          <span>Share Vibe</span>
        </button>

      <div className="narrator__modes btn-group" role="group" aria-label="Weather modes">
        {modeConfig.map((mode) => (
          <button
            key={mode.key}
            aria-label={mode.label}
            aria-pressed={currentMode === mode.key}
            type="button"
            className={`btn btn-sm btn-outline-secondary narrator__mode-btn ${
              currentMode === mode.key ? 'active' : ''
            }`}
            onClick={() => setCurrentMode(mode.key)}
          >
            <mode.Icon size={18} />
          </button>
        ))}
      </div>
    </div>
  </div>
  );
};

export default WeatherNarrator;