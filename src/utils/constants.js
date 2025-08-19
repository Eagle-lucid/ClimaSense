/* ==== Constant Config ==== */

// 🔐 API Key (loaded from .env for security)
export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// 🌤️ OpenWeather API Base URLs
export const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
export const FORECAST_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
export const AQI_BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// 🌙 Weather conditions that should trigger dark theme mode
export const DARK_THEME_CONDITIONS = [
  'Rain', 'Thunderstorm', 'Snow', 'Fog', 'Haze', 'Mist', 'Drizzle'
];

// 🌍 AQI index descriptions (1–5, WHO standard)
export const AQI_DESCRIPTION = {
  1: "Good 🟢 - Air quality is satisfactory.",
  2: "Fair 🟡 - Acceptable air quality.",
  3: "Moderate 🟠 - Risk for sensitive individuals.",
  4: "Poor 🔴 - Unhealthy for the general population.",
  5: "Very Poor 🟣 - Health warnings of emergency conditions."
};

// 🎨 AQI background colors (HSL for smooth theming)
export const AQI_BG_COLORS = {
  1: 'hsl(120, 70%, 70%)',  // Green
  2: 'hsl(60, 85%, 65%)',   // Yellow
  3: 'hsl(30, 85%, 65%)',   // Orange
  4: 'hsl(0, 90%, 55%)',    // Red
  5: 'hsl(280, 70%, 65%)'   // Purple
};
