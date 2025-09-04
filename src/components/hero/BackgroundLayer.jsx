// src/components/hero/BackgroundLayer.jsx
import { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './BackgroundLayer.scss';

// Particle counts
const PARTICLE_COUNT = {
  rain: 60,
  snow: 30,
  thunder: 5,
  wind: 15,
  fog: 3
};

// Random helper
const rand = (min, max) => min + Math.random() * (max - min);

const BackgroundLayer = ({ condition = 'clear' }) => {
  const bgRef = useRef(null);
  const animationRef = useRef(null); // single RAF ID
  const timeoutRefs = useRef([]);
  const particlesRef = useRef([]);

  // Normalize condition with fallback
  const normalizedCondition = useMemo(() => {
    if (!condition) return 'clear';
    const cond = condition.toLowerCase();

    const conditionsMap = {
      rain: 'rain',
      drizzle: 'rain',
      thunderstorm: 'thunder',
      snow: 'snow',
      wind: 'wind',
      breeze: 'wind',
      cloud: 'clouds',
      clouds: 'clouds',
      mist: 'fog',
      haze: 'fog',
      fog: 'fog',
      clear: 'clear',
      sunny: 'clear'
    };

    return conditionsMap[cond] || 'clear';
  }, [condition]);

  // Cleanup all animations/particles
  const clearEffects = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    particlesRef.current.forEach((p) => {
      if (p?.parentNode) p.parentNode.removeChild(p);
    });
    particlesRef.current = [];
  }, []);

  // 🌧 Rain effect
  const addRainEffect = useCallback((container) => {
    for (let i = 0; i < PARTICLE_COUNT.rain; i++) {
      const drop = document.createElement('div');
      drop.className = 'particle rain-drop';

      const left = rand(0, 100);
      const delay = rand(0, 2);
      const duration = rand(0.5, 1);
      const length = rand(10, 25);
      const opacity = rand(0.4, 0.8);

      drop.style.cssText = `
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        height: ${length}px;
        opacity: ${opacity};
      `;

      container.appendChild(drop);
      particlesRef.current.push(drop);
    }
  }, []);

  // ❄ Snow effect
  const addSnowEffect = useCallback((container) => {
    for (let i = 0; i < PARTICLE_COUNT.snow; i++) {
      const flake = document.createElement('div');
      flake.className = 'particle snow-flake';

      const size = rand(3, 12);
      const left = rand(-5, 105);
      const delay = rand(0, 8);
      const duration = rand(8, 25);
      const sway = rand(5, 15);

      flake.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        --sway: ${sway}px;
        opacity: ${rand(0.7, 0.95)};
      `;

      container.appendChild(flake);
      particlesRef.current.push(flake);
    }
  }, []);

  // ⚡ Thunder effect
  const addThunderEffect = useCallback((container) => {
    let flashCount = 0;

    const thunderFlash = () => {
      if (flashCount >= PARTICLE_COUNT.thunder) return;

      const flash = document.createElement('div');
      flash.className = 'particle thunder-flash';
      flash.style.opacity = rand(0.3, 0.8);

      container.appendChild(flash);
      particlesRef.current.push(flash);

      const duration = rand(100, 300);
      const delay = rand(3000, 8000);

      const removeTimeout = setTimeout(() => {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        flashCount++;
        const nextTimeout = setTimeout(thunderFlash, delay);
        timeoutRefs.current.push(nextTimeout);
      }, duration);

      timeoutRefs.current.push(removeTimeout);
    };

    thunderFlash();
  }, []);

  // 🌬 Wind effect
  const addWindEffect = useCallback((container) => {
    const windParticles = [];
    const windStrength = rand(1.5, 4);

    for (let i = 0; i < PARTICLE_COUNT.wind; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle wind-particle';

      particle.style.cssText = `
        left: ${rand(-10, 100)}%;
        top: ${rand(0, 100)}%;
        opacity: ${rand(0.1, 0.4)};
        width: ${rand(15, 40)}px;
        height: ${rand(2, 6)}px;
      `;

      container.appendChild(particle);
      windParticles.push(particle);
      particlesRef.current.push(particle);
    }

    const animateWind = () => {
      windParticles.forEach((p) => {
        const currentLeft = parseFloat(p.style.left) || 0;
        p.style.left = `${currentLeft + windStrength}%`;

        const currentTop = parseFloat(p.style.top) || 50;
        const verticalDrift = Math.sin(Date.now() * 0.001) * 0.5;
        p.style.top = `${currentTop + verticalDrift}%`;

        if (currentLeft > 120) {
          p.style.left = '-20%';
          p.style.top = `${rand(0, 100)}%`;
          p.style.opacity = rand(0.1, 0.4);
        }
      });

      animationRef.current = requestAnimationFrame(animateWind);
    };

    animateWind();
  }, []);

  // 🌫 Fog effect
  const addFogEffect = useCallback((container) => {
    for (let i = 0; i < PARTICLE_COUNT.fog; i++) {
      const fogLayer = document.createElement('div');
      fogLayer.className = 'particle fog-layer';

      fogLayer.style.cssText = `
        opacity: ${rand(0.1, 0.3)};
        animation-duration: ${rand(20, 40)}s;
        animation-delay: ${rand(0, 10)}s;
        z-index: ${i};
      `;

      container.appendChild(fogLayer);
      particlesRef.current.push(fogLayer);
    }
  }, []);

  // Main effect handler
  useEffect(() => {
    const container = bgRef.current;
    if (!container) return;

    clearEffects();

    // Time-of-day
    const hour = new Date().getHours();
    container.dataset.time = hour >= 6 && hour < 20 ? 'day' : 'night';

    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.dataset.reducedMotion = 'true';
      return;
    }

    // Apply effects
    const effectsMap = {
      rain: () => addRainEffect(container),
      snow: () => addSnowEffect(container),
      wind: () => addWindEffect(container),
      thunder: () => {
        addRainEffect(container);
        addThunderEffect(container);
      },
      fog: () => addFogEffect(container)
    };

    effectsMap[normalizedCondition]?.();

    return () => clearEffects();
  }, [normalizedCondition, clearEffects, addRainEffect, addSnowEffect, addWindEffect, addThunderEffect, addFogEffect]);

  return (
    <div
      ref={bgRef}
      className={`background-layer ${normalizedCondition}`}
      aria-hidden="true"
      role="presentation"
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

BackgroundLayer.defaultProps = {
  condition: 'clear'
};

export default BackgroundLayer;
