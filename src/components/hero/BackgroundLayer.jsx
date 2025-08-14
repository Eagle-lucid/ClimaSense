// src/components/hero/BackgroundLayer.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './BackgroundLayer.scss';

// Particle configuration
const PARTICLE_COUNT = {
  rain: 60,
  snow: 30,
  thunder: 5
};

const BackgroundLayer = ({ condition = 'clear' }) => {
  const bgRef = useRef(null);
  const animationRefs = useRef([]);

  // Normalize weather conditions with extended support
  const normalizedCondition = useCallback(() => {
    if (!condition) return 'clear';
    const cond = condition.toLowerCase();
    
    const conditionsMap = {
      rain: 'rainy',
      drizzle: 'rainy',
      thunderstorm: 'thunder',
      snow: 'snowy',
      wind: 'windy',
      breeze: 'windy',
      cloud: 'cloudy',
      mist: 'foggy',
      haze: 'foggy',
      fog: 'foggy'
    };

    for (const [key, value] of Object.entries(conditionsMap)) {
      if (cond.includes(key)) return value;
    }
    return 'clear';
  }, [condition]);

  // Cleanup all animations
  const clearEffects = useCallback(() => {
    animationRefs.current.forEach(cancelId => cancelAnimationFrame(cancelId));
    animationRefs.current = [];
    bgRef.current?.querySelectorAll('.particle').forEach(el => el.remove());
  }, []);

  // Enhanced rain effect with realistic drops
  const addRainEffect = useCallback(() => {
    const container = bgRef.current;
    if (!container) return;

    for (let i = 0; i < PARTICLE_COUNT.rain; i++) {
      const drop = document.createElement('div');
      drop.className = 'particle rain-drop';
      
      // Random positioning and animation delay
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 0.5 + Math.random() * 0.5;
      
      drop.style.cssText = `
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;

      container.appendChild(drop);
    }
  }, []);

  // Fluffy snowflakes with varying sizes
  const addSnowEffect = useCallback(() => {
    const container = bgRef.current;
    if (!container) return;

    for (let i = 0; i < PARTICLE_COUNT.snow; i++) {
      const flake = document.createElement('div');
      flake.className = 'particle snow-flake';
      
      const size = 5 + Math.random() * 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 10 + Math.random() * 10;
      
      flake.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;

      container.appendChild(flake);
    }
  }, []);

  // Thunder effect with flashes
  const addThunderEffect = useCallback(() => {
    const container = bgRef.current;
    if (!container) return;

    let flashCount = 0;
    
    const thunderFlash = () => {
      if (flashCount >= PARTICLE_COUNT.thunder) return;
      
      const flash = document.createElement('div');
      flash.className = 'particle thunder-flash';
      container.appendChild(flash);
      
      const duration = 100 + Math.random() * 400;
      const delay = 2000 + Math.random() * 5000;
      
      setTimeout(() => {
        flash.remove();
        flashCount++;
        setTimeout(thunderFlash, delay);
      }, duration);
    };

    thunderFlash();
  }, []);

  // Wind effect with moving particles
  const addWindEffect = useCallback(() => {
    const container = bgRef.current;
    if (!container) return;

    const windParticles = [];
    const windStrength = 2 + Math.random() * 3;
    
    const animateWind = () => {
      windParticles.forEach(particle => {
        const currentLeft = parseFloat(particle.style.left) || 0;
        particle.style.left = `${currentLeft + windStrength}%`;
        
        if (currentLeft > 100) {
          particle.style.left = '-10%';
        }
      });
      
      const animationId = requestAnimationFrame(animateWind);
      animationRefs.current.push(animationId);
    };

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle wind-particle';
      
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${0.2 + Math.random() * 0.3};
      `;
      
      container.appendChild(particle);
      windParticles.push(particle);
    }

    animateWind();
  }, []);

  // Fog/mist effect
  const addFogEffect = useCallback(() => {
    const container = bgRef.current;
    if (!container) return;

    const fogLayer = document.createElement('div');
    fogLayer.className = 'particle fog-layer';
    container.appendChild(fogLayer);
  }, []);

  // Main effect handler
  useEffect(() => {
    const conditionType = normalizedCondition();
    const container = bgRef.current;
    if (!container) return;

    clearEffects();

    // Time-of-day class
    const hour = new Date().getHours();
    const isDaytime = hour > 6 && hour < 20;
    container.dataset.time = isDaytime ? 'day' : 'night';

    // Reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      container.dataset.reducedMotion = 'true';
      return;
    }

    // Apply effects based on condition
    switch(conditionType) {
      case 'rainy':
        addRainEffect();
        break;
      case 'snowy':
        addSnowEffect();
        break;
      case 'windy':
        addWindEffect();
        break;
      case 'thunder':
        addRainEffect();
        addThunderEffect();
        break;
      case 'foggy':
        addFogEffect();
        break;
      default:
        break;
    }

    return () => clearEffects();
  }, [normalizedCondition, clearEffects, addRainEffect, addSnowEffect, addWindEffect, addThunderEffect, addFogEffect]);

  return (
    <div 
      ref={bgRef}
      className={`background-layer ${normalizedCondition()}`}
      aria-hidden="true"
      data-testid="background-layer"
    />
  );
};

BackgroundLayer.propTypes = {
  condition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'clear', 'rain', 'snow', 'clouds', 'wind', 
      'thunderstorm', 'drizzle', 'mist', 'haze', 'fog'
    ])
  ])
};

export default BackgroundLayer;