// src/components/header/Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { IconSearch, IconCurrentLocation, IconSun, IconMoon, IconTemperature } from '@tabler/icons-react';
import './header.scss';

// Memoize icons for performance improvement
const MemoizedIconSearch = React.memo(IconSearch);
const MemoizedIconCurrentLocation = React.memo(IconCurrentLocation);
const MemoizedIconSun = React.memo(IconSun);
const MemoizedIconMoon = React.memo(IconMoon);
const MemoizedIconTemperature = React.memo(IconTemperature);

export default function Header({
    onSearch,
    onGeolocate,
    onUnitToggle,
    currentUnit = 'C',
}) {
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ theme, setTheme ] = useState('horizon');
    const [ error, setError ] = useState('');
    
    // Detect system preference & local storage theme
    useEffect(() => {
        const storedTheme = localStorage.getItem('climasense-theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            setTheme(prefersDark.matches ? 'nightfall' : 'horizon');
            document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'nightfall' : 'horizon');
        }
    }, []);

    // Apply theme + store it
    useEffect(() => {
        document.body.classList.remove('theme-horizon', 'theme-nightfall');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('climasense-theme', theme);
    }, [theme]);

    // Listen to system theme changes
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            setTheme(e.matches ? 'nightfall' : 'horizon');
            document.documentElement.setAttribute('data-theme', e.matches ? 'nightfall' : 'horizon');
        };
        prefersDark.addEventListener('change', handleChange);
        return () => prefersDark.removeEventListener('change', handleChange);
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === 'horizon' ? 'nightfall' : 'horizon';
        setTheme(newTheme);
    };
    
    const handleUnitToggle = useCallback(() => {
        if (onUnitToggle) {
            onUnitToggle(currentUnit === 'C' ? 'F' : 'C');
        }
    }, [onUnitToggle, currentUnit]);

    // Error handling for search 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            try {
                await onSearch(searchQuery.trim());
                setSearchQuery('');
                setError('');
            } catch {
                setError('City not found. Please try again.');
            }
        }
    };

    // Error for handling geolocation 
    const handleGeolocation = async () => {
        try {
            await onGeolocate();
            setError('');
        } catch  {
            setError('Unable to retrieve your location. Please try again.');
        }
    };
    return (
        <header className="app-header" role='banner'>
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
                   aria-live='polite'
                     className='header__search-input'
                />
                <button 
                type='submit'
                aria-label='Search'
                className='header__search-btn'>
                    <MemoizedIconSearch size={20} stroke={2} />
                </button>
            </form>
            {error && <div className='header__error' role='alert'>{error}</div>}    

            { /** Right-Aligned Controls **/}
            <div className='header__controls'>
                {/** Temperature Unit Toggle **/}
                <button 
                onClick={handleUnitToggle}
                aria-label={`Switch to ${currentUnit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                className='header__unit-toggle'>
                    <MemoizedIconTemperature size={20} stroke={2} />
                    <span>°{currentUnit}</span>
                </button>

                {/** Geolocation Button **/}
                <button 
                onClick={handleGeolocation}
                aria-label='Use current location'
                className='header__geo-btn'>
                    <MemoizedIconCurrentLocation size={20} stroke={2} />
                </button>

                {/** Theme Toggle Button **/}
                <button 
                onClick={handleThemeToggle}
                aria-label={`Switch to ${theme === 'horizon' ? 'Nightfall' : 'Horizon'} theme`}
                className='header__theme-toggle'>
                    {theme === 'horizon' ? <MemoizedIconMoon size={20} stroke={2} /> : <MemoizedIconSun size={20} stroke={2} />}
                </button>
                </div>
        </header>
    );
} 