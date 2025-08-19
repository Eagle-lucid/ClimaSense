import React from 'react';
import { IconShare, IconBike, IconCar, IconHome } from '@tabler/icons-react';
import './WeatherNarrator.scss';

const WeatherNarrator = ({ weatherData, location }) => {
  // Safe default values for weather data
  const safeWeatherData = {
    temp: 0,
    feelsLike: 0,
    windSpeed: 0,
    condition: '',
    ...weatherData // Override with actual data if available
  };

  // Normalize weather condition with fallback
  const normalizeCondition = (condition) => {
    if (!condition) return 'default';
    const lowerCondition = condition.toLowerCase();
    return lowerCondition.includes('cloud') ? 'cloudy' 
         : lowerCondition.includes('rain') ? 'rainy'
         : lowerCondition.includes('snow') ? 'snowy'
         : lowerCondition.includes('storm') ? 'stormy'
         : lowerCondition.includes('sun') ? 'sunny'
         : 'default';
  };

  // Time-based greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Weather narrative generator with null checks
  const generateNarrative = () => {
    const { temp, feelsLike, windSpeed, condition } = safeWeatherData;
    const normalizedCondition = normalizeCondition(condition);
    const timeOfDay = getTimeOfDay();
    const userName = localStorage.getItem('userName') || 'friend';

    const narratives = {
      
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

    return narratives[normalizedCondition] || narratives.default;
  };

  // Lifestyle suggestions with fallbacks
  const getLifestyleTip = () => {
    const normalizedCondition = normalizeCondition(safeWeatherData.condition);
    const { temp } = safeWeatherData;
    
    const tips = {
      sunny: temp > 25 
        ? 'Apply SPF 30+ sunscreen before going out.' 
        : 'Great day for outdoor activities!',
      rainy: 'Waterproof shoes recommended.',
      snowy: 'Check road conditions before driving.',
      stormy: 'Avoid unnecessary travel.',
      default: 'Have a wonderful day!'
    };

    return tips[normalizedCondition] || tips.default;
  };

  // Share functionality with enhanced error handling
  const handleShare = async () => {
    try {
      const narrative = generateNarrative();
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
      <div className="narrator">
        <div className="narrator__message">
          <p className="narrator__text">Loading weather information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="narrator">
      <div className="narrator__message">
        <p className="narrator__text">{generateNarrative()}</p>
        <p className="narrator__tip">{getLifestyleTip()}</p>
      </div>

      <div className="narrator__controls">
        <button 
          onClick={handleShare}
          aria-label="Share weather"
          className="narrator__share"
          type="button"
        >
          <IconShare size={20} />
          <span>Share Vibe</span>
        </button>

        <div className="narrator__modes">
          <button 
            aria-label="Commuter mode"
            type="button"
          >
            <IconCar size={20} />
          </button>
          <button 
            aria-label="Fitness mode"
            type="button"
          >
            <IconBike size={20} />
          </button>
          <button 
            aria-label="Home mode"
            type="button"
          >
            <IconHome size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherNarrator;