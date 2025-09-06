// src/components/hero/BackgroundLayer.jsx
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
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
  const animationRef = useRef(null);
  const timeoutRefs = useRef([]);
  const [particles, setParticles] = useState([]);

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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = null;

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setParticles([]);
  }, []);

  // Rain effect
  const createRainParticles = useCallback(() => {
    const rainParticles = [];
    for (let i = 0; i < PARTICLE_COUNT.rain; i++) {
      const left = rand(0, 100);
      const delay = rand(0, 2);
      const duration = rand(0.5, 1);
      const length = rand(10, 25);
      const opacity = rand(0.4, 0.8);

      rainParticles.push({
        type: 'rain',
        id: `rain-${i}-${Date.now()}`,
        style: {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          height: `${length}px`,
          opacity: opacity,
        }
      });
    }
    return rainParticles;
  }, []);

  // Snow effect
  const createSnowParticles = useCallback(() => {
    const snowParticles = [];
    for (let i = 0; i < PARTICLE_COUNT.snow; i++) {
      const size = rand(3, 12);
      const left = rand(-5, 105);
      const delay = rand(0, 8);
      const duration = rand(8, 25);
      const sway = rand(5, 15);

      snowParticles.push({
        type: 'snow',
        id: `snow-${i}-${Date.now()}`,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          '--sway': `${sway}px`,
          opacity: rand(0.7, 0.95),
        }
      });
    }
    return snowParticles;
  }, []);

  // Thunder effect
  const createThunderParticles = useCallback(() => {
    const thunderParticles = [];
    for (let i = 0; i < PARTICLE_COUNT.thunder; i++) {
      thunderParticles.push({
        type: 'thunder',
        id: `thunder-${i}-${Date.now()}`,
        style: {
          opacity: rand(0.3, 0.8),
          animationDelay: `${rand(0, 5)}s`,
        }
      });
    }
    return thunderParticles;
  }, []);

  // Wind effect
  const createWindParticles = useCallback(() => {
    const windParticles = [];
    for (let i = 0; i < PARTICLE_COUNT.wind; i++) {
      windParticles.push({
        type: 'wind',
        id: `wind-${i}-${Date.now()}`,
        style: {
          left: `${rand(-10, 100)}%`,
          top: `${rand(0, 100)}%`,
          opacity: rand(0.1, 0.4),
          width: `${rand(15, 40)}px`,
          height: `${rand(2, 6)}px`,
        }
      });
    }
    return windParticles;
  }, []);

  // Fog effect
  const createFogParticles = useCallback(() => {
    const fogParticles = [];
    for (let i = 0; i < PARTICLE_COUNT.fog; i++) {
      fogParticles.push({
        type: 'fog',
        id: `fog-${i}-${Date.now()}`,
        style: {
          opacity: rand(0.1, 0.3),
          animationDuration: `${rand(20, 40)}s`,
          animationDelay: `${rand(0, 10)}s`,
          zIndex: i,
        }
      });
    }
    return fogParticles;
  }, []);

  // Main effect handler
  useEffect(() => {
    const container = bgRef.current;
    if (!container) return;

    // Time-of-day
    const hour = new Date().getHours();
    container.dataset.time = hour >= 6 && hour < 20 ? 'day' : 'night';

    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.dataset.reducedMotion = 'true';
      setParticles([]);
      return;
    } else {
      container.dataset.reducedMotion = 'false';
    }

    // Apply effects
    const effectsMap = {
      rain: () => setParticles(createRainParticles()),
      snow: () => setParticles(createSnowParticles()),
      wind: () => setParticles(createWindParticles()),
      thunder: () => setParticles([
        ...createRainParticles(),
        ...createThunderParticles()
      ]),
      fog: () => setParticles(createFogParticles()),
      clear: () => setParticles([]),
      clouds: () => setParticles([])
    };

    effectsMap[normalizedCondition]?.();
    console.log("Particles created:", normalizedCondition);
    return () => clearEffects();
  }, [normalizedCondition, clearEffects, createRainParticles, createSnowParticles, createWindParticles, createThunderParticles, createFogParticles]);

  // Render particles based on type
  const renderParticle = (particle) => {
    const { type, id, style } = particle;
    
    const styleObj = {};
    Object.keys(style).forEach(key => {
      // Convert CSS custom properties to React style format
      if (key.startsWith('--')) {
        // For CSS custom properties, keep as-is
        styleObj[key] = style[key];
      } else {
        // Convert kebab-case to camelCase for React
        const reactKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[reactKey] = style[key];
      }
    });

    switch (type) {
      case 'rain':
        return <div key={id} className="particle rain-drop" style={styleObj} />;
      case 'snow':
        return <div key={id} className="particle snow-flake" style={styleObj} />;
      case 'thunder':
        return <div key={id} className="particle thunder-flash" style={styleObj} />;
      case 'wind':
        return <div key={id} className="particle wind-particle" style={styleObj} />;
      case 'fog':
        return <div key={id} className="particle fog-layer" style={styleObj} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={bgRef}
      className={`background-layer ${normalizedCondition}`}
      aria-hidden="true"
      role="presentation"
      data-testid="background-layer" 
    >
      <div className="particle-layer">
        {particles.map(renderParticle)}
      </div>
    </div>
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