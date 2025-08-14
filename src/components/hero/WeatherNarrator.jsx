import React from 'react';
import { IconShare, IconBike, IconCar, IconHome } from '@tabler/icons-react';
import './WeatherNarrator.scss';

const WeatherNarrator = ({ weatherData, location }) => {
  // Normalize weather condition (e.g., 'partly-cloudy' → 'cloudy')
  const normalizeCondition = (condition) => {
    if (!condition) return 'default';
    return condition.toLowerCase().includes('cloud') ? 'cloudy' 
         : condition.toLowerCase().includes('rain') ? 'rainy'
         : condition;
  };

  // Time-based greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Weather narrative generator
  const generateNarrative = () => {
    const { temp, feelsLike, windSpeed } = weatherData;
    const condition = normalizeCondition(weatherData.condition);
    const timeOfDay = getTimeOfDay();
    const userName = localStorage.getItem('userName') || 'friend';

    const narratives = {
      sunny: `☀️ Good ${timeOfDay}, ${userName}. The sun is shining bright in ${location} at ${temp}°C. 
             ${feelsLike > temp ? `Feels like ${feelsLike}°C` : ''} 
             ${windSpeed > 15 ? 'with refreshing breezes.' : 'with calm skies.'}`,
      
      rainy: `🌧️ Good ${timeOfDay}, ${userName}. ${timeOfDay === 'morning' ? 'Pack that umbrella!' : 'Rain continues'} 
              in ${location} at ${temp}°C. 
              ${feelsLike < temp ? `Feels ${feelsLike}°C` : ''} 
              ${windSpeed > 10 ? 'with gusty winds.' : 'with steady showers.'}`,

      cloudy: `☁️ Good ${timeOfDay}, ${userName}. Skies are overcast in ${location} at ${temp}°C. 
               Perfect for ${timeOfDay === 'morning' ? 'a cozy breakfast' : 'indoor activities'}.`,

      snowy: `❄️ Good ${timeOfDay}, ${userName}. Snowfall in ${location} at ${temp}°C. 
              Bundle up - feels like ${feelsLike}°C with ${windSpeed}km/h winds.`,

      stormy: `⚡ Storm alert, ${userName}! ${timeOfDay === 'evening' ? 'Stay indoors' : 'Be cautious'} 
               in ${location}. ${temp}°C with heavy winds.`,
               
      default: `🌤️ ${temp}°C and ${weatherData.condition} in ${location}`
    };

    return narratives[condition] || narratives.default;
  };

  // Lifestyle suggestions
  const getLifestyleTip = () => {
    const condition = normalizeCondition(weatherData.condition);
    const { temp } = weatherData;
    
    const tips = {
      sunny: temp > 25 
        ? 'Apply SPF 30+ sunscreen before going out.' 
        : 'Great day for outdoor activities!',
      rainy: 'Waterproof shoes recommended.',
      snowy: 'Check road conditions before driving.',
      stormy: 'Avoid unnecessary travel.',
      default: 'Have a wonderful day!'
    };

    return tips[condition] || tips.default;
  };

  //  Share functionality with error handling
  const handleShare = async () => {
    const narrative = generateNarrative();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `ClimaSense Weather for ${location}`,
          text: narrative,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(narrative);
        alert('Weather details copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      alert('Could not share weather details');
    }
  };

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