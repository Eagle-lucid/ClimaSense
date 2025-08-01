📡 API_REFERENCE.md – ClimaSense Weather API Guide
"Real-time weather data is the core of ClimaSense. Accuracy meets clarity."

🔗 API Provider
Service: OpenWeatherMap
Plan: Free Tier (One Call API 3.0, Current Weather, and Forecast)

📌 Base Endpoints Used

1. 🌍 Current Weather Data (By City)
   http
   Copy
   Edit
   GET https://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY}&units=metric
   Required Parameters:

q: City name (e.g., Lagos)

appid: Your API key

units: metric or imperial

Returns: Current temperature, condition, weather icon, etc.

2. 🗓️ 7-Day Weather Forecast (One Call 3.0)
   http
   Copy
   Edit
   GET https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&exclude=minutely&appid={API_KEY}&units=metric
   Required Parameters:

lat / lon: Coordinates (get from current weather endpoint)

exclude: Optional data you don't need (e.g., minutely)

appid, units

Returns:

current: Real-time weather data

daily: 7-day forecast array

hourly: 24-hour forecast

alerts: Weather alerts (heatwaves, storms, etc.)

aqi: (if included separately)

3. 🌫️ Air Pollution API
   http
   Copy
   Edit
   GET https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid={API_KEY}
   Returns: AQI score, pollution component levels (CO, NO2, PM2.5)

🔧 Example Workflow
Search City → Get Coordinates

Use weather endpoint to fetch lat & lon.

Get 7-Day Forecast + Hourly

Use onecall with retrieved lat/lon.

Get Air Quality Index

Use air_pollution with same coordinates.

📥 Sample API Response (Simplified)
GET /weather?q=London&...
json
Copy
Edit
{
"name": "London",
"coord": { "lon": -0.1257, "lat": 51.5085 },
"weather": [{
"main": "Clouds",
"description": "overcast clouds",
"icon": "04d"
}],
"main": {
"temp": 17.32,
"feels_like": 16.5,
"humidity": 72
}
}
🧠 Notes & Tips
🔐 API Key should be stored securely — do not expose it publicly.

🌍 Units: Always use metric for °C or imperial for °F.

🕒 Time Conversion: API returns timestamps in Unix format. Convert using:

js
Copy
Edit
new Date(data.dt \* 1000)
⚠️ Weather Icons: Use icon codes from the response:

css
Copy
Edit
https://openweathermap.org/img/wn/{icon}@2x.png
