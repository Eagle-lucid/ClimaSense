// src/components/ui/SearchBar/SearchBar.jsx
import React, { useState, useContext } from 'react';
import { IconSearch, IconCurrentLocation } from '@tabler/icons-react';
import { WeatherContext } from '../../../context/WeatherContext.js';
import './SearchBar.scss';

// Memoize icons for performance improvement
const MemoizedIconSearch = React.memo(IconSearch);
const MemoizedIconCurrentLocation = React.memo(IconCurrentLocation);

export default function SearchBar() {
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ error, setError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ geoLoading, setGeoLoading ] = useState(false);

    // Get function from WeatherContext
    const { onSearch, onGeolocate } = useContext(WeatherContext);

    // Error handling on search 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsLoading(true);
            setError(''); 
            try {
            await onSearch(searchQuery.trim());
            setSearchQuery('')
            } catch (err) {
                setError(err.message || 'City not found. Please try again.');
            } finally {
                setIsLoading(false);
            } 
        } else {
            setError('Please enter a city name');
        }
    };

    // Error handling geolocation 
    const handleGeolocation = async () => {
        setGeoLoading(true);
        setError('');
        try{
            await onGeolocate();
        } catch (err) {
            setError(err.message || 'Unable to retrieve your location. Please try again.');
        } finally {
            setGeoLoading(false);
        }
    };

    return (
        <div className="search__bar">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className='search__bar-form'>
                <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for a city'
                aria-label='Search for weather by city'
                aria-live='polite'
                className='search__bar-input'
                />
                <button 
                type="submit"
                aria-label='Search'
                className={`search__bar-btn ${isLoading ? 'is-loading' : ''}`}
                disabled={isLoading}
                >
                    <MemoizedIconSearch size={20} stroke={2} />        
                </button>

                {/* {Geolocation Button} */}
                <button 
                type='button'
                onClick={handleGeolocation}
                aria-label='Use current location'
                className={`search__bar-geo__btn ${geoLoading ? 'is-loading' : ''}`}
                disabled={geoLoading}
                >
                    <MemoizedIconCurrentLocation size={20} stroke={2} />
                </button>
            </form>
            {error && 
            <div className='search__bar-error' role='alert'>
                {error}
            </div>
            }
        </div>
    )
}