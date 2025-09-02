// src/components/header/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { IconSun, IconMoon, IconTemperature } from '@tabler/icons-react';
import { WeatherContext } from '../../context/WeatherContext';
import SearchBar from '../ui/SearchBar/SearchBar';
import './header.scss';

// Memoize icons for performance improvement
const MemoizedIconSun = React.memo(IconSun);
const MemoizedIconMoon = React.memo(IconMoon);
const MemoizedIconTemperature = React.memo(IconTemperature);

export default function Header() {
    const [ theme, setTheme ] = useState('horizon');

    // Get function for WeatherContext
    const { onUnitToggle, unit } = useContext(WeatherContext);

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

            {/* {Search Bar Component} */}
            <SearchBar/>

            { /** Right-Aligned Controls **/}
            <div className='header__controls'>
                {/** Temperature Unit Toggle **/}
                <button 
                onClick={onUnitToggle}
                aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                className='header__unit-toggle'>
                    <MemoizedIconTemperature size={20} stroke={2} />
                    <span>°{unit}</span>
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
     )
}
 