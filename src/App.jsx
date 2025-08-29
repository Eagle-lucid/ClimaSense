// src/App.jsx
import { WeatherProvider } from './context/WeatherContext.jsx';
import Header from './components/header/Header';
import Hero from './components/hero/Hero';
import ForecastList from './components/forecast/ForecastList';
import ForecastCard from './components/forecast/ForecastCard';
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
      <section className="forecast-section">
        <h2>Hourly Forecast</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ForecastList forecasts={weatherData?.hourly || []} />
        )}
        <h2>Weekly Forecast</h2>
        <ForecastCard forecasts={weatherData?.daily || []} />
      </section>
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