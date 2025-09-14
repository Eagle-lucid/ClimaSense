// src/components/weather/WeatherSection.jsx
import { useState } from 'react';
import WeatherCard from './WeatherCard';
import HourlyForecastList from '../forecast/DailyForecast';
import  DailyForecastCard  from '../forecast/DailyForecast';
import './WeatherSection.scss';

const WeatherSection = ({ weatherData, isLoading, error }) => {
    const [expandedCardId, setExpandedCardId] = useState('current-weather-capsule');

    const handleToggleExpand = (cardId) => {
        setExpandedCardId(prevId => prevId === cardId ? null : cardId);
    };
    if (isLoading) {
        return (
            <section className='weather-section weather-section__loading'>
                <div className="spinner-border text-light" role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
                <p className="mt-2 mb-0">Consulting the chrono-sensors...</p>
            </section>
        );
    }
    if (error) {
        return (
         <section className="weather-section weather-section__error">
            <div className="alert alert-warning m-0" role='alert'>
                <strong>Temporal Disruption!</strong>
                Unable to retrieve weather data: {error}
            </div>
         </section>
        );
    }

    if (!weatherData?.current) {
        return (
            <section className="weather-section weather-section__empty">
                <p>No chrono-data available for the selected coordinates.</p>
            </section>
        );
    }

    const { current, location, hourly, daily } = weatherData;


    return (
        <section className="weather-section">
            {/* Main Weather Capsule */}
            <div className="weather-section__primary">
                <WeatherCard 
                  id="current-weather-capsule"
                    locationName={location?.name}
                    locationCountry={location?.country}
                    timestamp={current?.dt}
                    timezone={location?.timezone}
                    temperature={current?.temp}
                    feelsLike={current?.feels_like}
                    condition={current?.weather[0]?.description}
                    iconCode={current?.weather[0]?.icon}
                    humidity={current?.humidity}
                    windSpeed={current?.wind_speed}
                    pressure={current?.pressure}
                    uvIndex={current?.uvi}
                    aqi={current?.air_quality?.pm2_5}
                    isExpanded={expandedCardId === "current-weather-capsule"}
                    onExpand={() => handleToggleExpand("current-weather-capsule")}
                    onAddFavorite={() => { }} 
                    onCompare={() => { }}    
                    theme="dark"
                />
            </div>

            {/* Forecast Section */}
            {(hourly && hourly.length > 0) && (
                <div className="weather-section__hourly mt-4">
                    <HourlyForecastList
                       forecasts={hourly}
                       timezone={location.timezone}
                       isExpanded={expandedCardId === 'hourly-forecast'}
                       onExpand={() => handleToggleExpand('hourly-forecast')}
                       theme='dark'
                    />
                </div>
            )}

            {(daily && daily.length > 0) && (
                <div className="weather-section__daily mt-4">
                    <DailyForecastCard 
                        forecasts={daily}
                        timezone={location.timezone}
                        isExpanded={expandedCardId === 'daily-forecast'}
                        onExpand={() => handleToggleExpand('daily-forecast')}
                        theme='dark'
                    />
                </div>
            )}
        </section>
    );
};

export default WeatherSection;