// src/components/weather/WeatherSection.jsx
import { useState } from 'react';
import WeatherCard from './WeatherCard';
import HourlyForecastList from '../forecast/HourlyForecast';
import DailyForecastCard from '../forecast/DailyForecast';
import './WeatherSection.scss';

const WeatherSection = ({ weatherData, isLoading, error, locationQuery }) => {
    const [expandedCardId, setExpandedCardId] = useState('current-weather-capsule');

    const handleToggleExpand = (cardId) => {
        setExpandedCardId(prevId => prevId === cardId ? null : cardId);
    };

    if (isLoading) {
        return (
            <section className='weather-section weather-section--loading'>
                <div className="spinner-border text-light" role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
                <p className="mt-2 mb-0">Consulting the chrono-sensors...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="weather-section weather-section--error">
                <div className="alert alert-warning m-0" role='alert'>
                    <strong>Temporal Disruption!</strong>
                    Unable to retrieve weather data: {error}
                </div>
            </section>
        );
    }

    if (!weatherData?.current) {
        return (
            <section className="weather-section weather-section--empty">
                <p>No chrono-data available for the selected coordinates.</p>
            </section>
        );
    }

    
    const current = weatherData?.current || {};
    const hourly = weatherData?.hourly || [];     // Already correct in your API
    const daily = weatherData?.daily || [];       // Already correct in your API


    const locationName = daily[0]?.location || locationQuery || 'Current Location';
    const locationCountry = '';

    return (
        <section className="weather-section">
            {/* Main Weather Capsule */}
            <div className="weather-section__primary">
                <WeatherCard 
                    id="current-weather-capsule"
                    locationName={locationName}
                    locationCountry={locationCountry}
                    timestamp={Date.now() / 1000} 
                    timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} 
                    temperature={current?.temp}
                    feelsLike={current?.feelsLike} 
                    condition={current?.condition}
                    iconCode={current?.icon}
                    humidity={current?.humidity}
                    windSpeed={current?.windSpeed} 
                    pressure={current?.pressure}
                    uvIndex={current?.uvIndex} 
                    aqi={current?.aqi} 
                    isExpanded={expandedCardId === "current-weather-capsule"}
                    onExpand={() => handleToggleExpand("current-weather-capsule")}
                    onAddFavorite={() => { }} 
                    onCompare={() => { }}    
                    theme="dark"
                />
            </div>

            {/* Forecast Sections */}
            {(hourly && hourly.length > 0) && (
                <div className="weather-section__hourly mt-4">
                    <HourlyForecastList
                        forecasts={hourly}
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