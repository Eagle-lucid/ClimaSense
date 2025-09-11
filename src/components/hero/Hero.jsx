// src/components/hero/Hero.jsx
import WeatherNarrator from './WeatherNarrator';
import EssentialsCard from './EssentialsCard';
import BackgroundLayer from './BackgroundLayer';
import './hero.scss';

const Hero = ({ weatherData, userLocation, essentials }) => {
  return (
    <section className="hero">
      <BackgroundLayer condition={weatherData?.condition} />

      <div className="hero__grid">
        <WeatherNarrator 
          weatherData={weatherData} 
          location={userLocation}  
        />
        <EssentialsCard 
          weatherData={essentials} 
          className="hero__essentials"
          location={userLocation}  
        />
      </div>
    </section>
  );
};

export default Hero;