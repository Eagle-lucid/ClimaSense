// src/components/header/Header.jsx
import { useState } from 'react';
import { IconSearch, IconCurrentLocation } from '@tabler/icons-react';
import { IconTemperature } from '@tabler/icons-react';
import './header.scss';

export default function Header({
    onSearch,
    onGeolocate,
    onUnitToggle,
    currentUnit = 'metric', // Default to metric (Celsius)
}) {
    const [ searchQuery, setSearchQuery ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchQuery('');
        }
    };

    return (
        <header className="app-header">
            {/** Logo/Title Group **/}
            <div className="header__brand">
                <h1 className="header__title">
                    <span className='header__title-main'>Clima</span>
                    <span className='header__title-accent'>Sense</span>
                     <span className="header__weather-emoji" aria-hidden="true">🌦️</span>
                </h1>
            </div>

            {/** Search Form **/}
            <form onSubmit={handleSubmit} className="header__search-form">
                <input 
                   type='text'
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder='Search for a city...'
                   aria-label='Search for weather by city'
                     className='header__search-input'
                />
                <button 
                type='submit'
                aria-label='Search'
                className='header__search-btn'>
                    <IconSearch size={20} stroke={2} />
                </button>
            </form>

            { /** Right-Aligned Controls **/}
            <div className='header__controls'>
                {/** Temperature Unit Toggle **/}
                <button 
                onClick={onUnitToggle}
                aria-label={`Switch to ${currentUnit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                className='header__unit-toggle'>
                    <IconTemperature size={20} stroke={2} />
                    <span>°{currentUnit === 'metric' ? 'C' : 'F'}</span>
                </button>

                {/** Geolocation Button **/}
                <button 
                onClick={onGeolocate}
                aria-label='Use current location'
                className='header__geo-btn'>
                    <IconCurrentLocation size={20} stroke={2} />
                </button>
                </div>
        </header>
    );
} 