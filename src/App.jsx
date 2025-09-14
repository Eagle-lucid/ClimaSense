// src/App.jsx
import { WeatherProvider } from './context/WeatherContext.jsx';
import Header from './components/header/Header';
import Hero from './components/hero/Hero';
import WeatherSection from './components/weather/WeatherSection.jsx';
import useWeather from './context/useWeather';
import './styles/main.scss';

function MainContent() {
  const {
    weatherData,
    location,
    isLoading,
    error,
  } = useWeather();

  return (
    <div className="app-container">
      <Header />
      <Hero
        weatherData={weatherData?.current}
        userLocation={location}
        essentials={weatherData?.current}
      />
      <WeatherSection 
        weatherData={weatherData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

function App() {
  return (
    <WeatherProvider>
      <MainContent />
    </WeatherProvider>
  );
}

export default App;