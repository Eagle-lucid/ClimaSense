document.body.classList.add('looping');

let hasSearched = false; // Flag to check if the user has searched for a city

const baseImagePath = './assets/images/';
    const seasonImages = {
        spring: `url(${baseImagePath}spring.jpg)`,
        summer: `url(${baseImagePath}summer.jpg)`,
        autumn: `url(${baseImagePath}autumn.jpg)`,
        winter:`url(${baseImagePath}winter.jpg)`
    };
// Function to remove the looping class after 2 seconds
function stopLoopAndSetWeatherBG (season) {
    document.body.classList.remove('looping');
    document.body.classList.add('static-bg');
    document.body.classList.remove('spring-bg', 'summer-bg', 'autumn-bg', 'winter-bg');

    document.body.style.backgroundImage = seasonImages[season] || seasonImages.spring;
}

// Determine season based on month
function determineSeasonByMonth() {
    const month = new Date().getMonth() + 1; // Months are 0-indexed in JavaScript
    if (month >= 3 && month <= 5) {
        return 'spring';
    }
    if (month >= 6 && month <= 8) {
        return 'summer';
    }
    if (month >= 9 && month <= 11) {
        return 'autumn';
    }
    return 'winter'; // December, January, February
}

const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-btn');
const searchButton = document.getElementById('search-button');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherIcon = document.getElementById('weather-icon');
const loadingElement = document.getElementById('loading');
const forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const gridLayout = document.querySelector('.grid-layout');


// Show/hide the clear button based on input value
document.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
        clearButton.style.display = "block";
} else {
        clearButton.style.display = "none";
    }
});
// clear the input field when the clear button is clicked and hide the button
clearButton.addEventListener("click", () => {
    searchInput.value = "";
    locationName.textContent = ""; // Clear the location name
    temperature.textContent = ""; // Clear the temperature
    weatherCondition.textContent = ""; // Clear the weather condition
    weatherIcon.src = ""; // Clear the weather icon
    clearButton.style.display = "none";
    loadingElement.style.display = "none"; // Hide loading spinner
    searchInput.focus();
});

const apiKey = 'c4e0dcbdc408a1aee90230a4eed14c00';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data from the API
async function fetchWeatherData(city) {

    try {
        const response = await fetch(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            } else {
                throw new Error('Error fetching weather data');
            }
        } 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('City not found. Please try again.');
        return null;
    }
}
let originalTempCelsius = null;
let isCelsius = true; // Flag to check if the temperature is in Celsius

// Function to convert temperature to Fahrenheit
  function convertToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }
// Function to update the temperature display
function updateTemperatureDisplay(temp) {
    if (isCelsius) {
        temperature.textContent = `${Math.round(temp)}°C`;
    } else {
        const fahrenheit = convertToFahrenheit(temp);
        temperature.textContent = `${Math.round(fahrenheit)}°F`;
    }
}
// Event listener for the unit toggle button
document.getElementById('unit-toggle').addEventListener('click', function () {
    if (originalTempCelsius !== null) {
        isCelsius = !isCelsius;
        this.textContent = isCelsius ? "°C" : "°F";
        updateTemperatureDisplay(originalTempCelsius);
    }
})
// Function to update the UI when the user inputs a city, and populate the weather information
async function updateWeatherUI(city) {
    loadingElement.style.display = 'block'; // Show loading spinner
    locationName.textContent = 'Loading...'; // Show loading text
    weatherCondition.textContent = ''; // Clear previous weather condition
    weatherIcon.src = ''; // Clear previous weather icon

    try {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            // Update the location name 
            locationName.textContent = weatherData.name;
    
            // Update the temperature
            originalTempCelsius = weatherData.main.temp;
            updateTemperatureDisplay(originalTempCelsius); // Update the temperature display
    
            // Update the weather condition
            weatherCondition.textContent = weatherData.weather[0].description;
            weatherCondition.style.textTransform = "capitalize";
    
            // Update the weather icon
            const iconCode = weatherData.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = weatherData.weather[0].description;
            weatherIcon.title = weatherData.weather[0].description;
            
            // Fetch and display hourly forecast
            const { lat, lon } = weatherData.coord;
            const hourlyData = await getHourlyForecast(lat, lon);
            displayHourlyForecast(hourlyData);

            // fetch and display weather alerts
            const alerts = weatherData.alerts || []; // Use empty array if no alerts
            displayWeatherAlert(alerts);

            // Fetch and display AQI data
            fetchAQIData(lat, lon);

            // Only stop loop on first search
            if (!hasSearched) {
                const season = determineSeasonByMonth();
                stopLoopAndSetWeatherBG(season); // Stop the looping background and set the weather background
                hasSearched = true; // Set the flag to true after the first search
            }
             // **Toggle the Layout After Search**
             toggleLayoutOnSearch(); 
        }
    }  catch (error) {
        console.error('Error updating weather UI:', error);
        // Handle error in updating UI
        locationName.textContent = 'Error: Unable to fetch weather data.';
        weatherCondition.textContent = 'Please try again.';
        weatherCondition.style.color = 'red'; // Change text color to red for error indication
        weatherIcon.src = ''; // Clear previous weather icon
        alert('Error updating weather information. Please try again.');
    } finally {
        loadingElement.style.display = 'none'; // Hide loading spinner
    }

    const forecastData = await fetchForecastData(city);
    if (forecastData) {
        const dailyForecasts = extractFiveDayForecast(forecastData);
        displayForecastCards(dailyForecasts);
    }
}

// Event listener for the search button click
searchButton.addEventListener("click", async () => {
    const city = searchInput.value.trim();
    if (city) {
        await updateWeatherUI(city);
        searchInput.value = ""; // Clear the input field after searching
        clearButton.style.display = "none"; // Hide the clear button
    } else {
        alert('Please enter a city name.');
    }
    searchInput.focus(); // Refocus the input field
});

// Event listener for the Enter key press in the input field
searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) {
            await updateWeatherUI(city);
            searchInput.value = ""; // Clear the input field after searching
            clearButton.style.display = "none"; // Hide the clear button
        } else {
            alert('Please enter a city name.');
        }
        searchInput.focus(); // Refocus the input field
    }
});
// Function to fetch forecast data from the API
async function fetchForecastData(city) {
    try {
        const response = await fetch(`${forecastBaseUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            } else {
                throw new Error('Error fetching forecast data');
            }
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        alert('City not found. Please try again.');
        return null;
    }
}

// Function to extract the 5-day forecast
   function extractFiveDayForecast(data) {
    const forecasts = [];
    const seenDates = new Set(); // To track unique dates
 
    data.list.forEach(forecast => {
        const forecastsDate = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        if (!seenDates.has(forecastsDate)) {
            seenDates.add(forecastsDate);
            forecasts.push(forecast); // Push the forecast data for the unique date
        }
    });
    
    return forecasts.slice(0, 5); // Return only 5 days
}
// Function to update the forecast UI
function displayForecastCards (forecasts) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast cards

    forecasts.forEach((day, index) => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`  
        const temperature = `${Math.round(day.main.temp)}°C`;
        const desc = day.weather[0].description;

        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.style.setProperty('--i', index);

        card.innerHTML = `
            <p class="forecast-date">${date}</p>
            <img src="${icon}" alt="${desc}" title="${desc}"  class="forecast-icon"/>
            <p class="forecast-temp">${temperature}</p>
            <p class="forecast-desc" style="text-transform:capitalize;">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Function to fetch hourly forecast data
async function getHourlyForecast(lat, lon) {
    const apiKey = 'c4e0dcbdc408a1aee90230a4eed14c00';
    const  url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();
    return data.list.slice(0, 8); // Get the first 8 hours of forecast data
}

// Function to display hourly forecast data
 function displayHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.getElementById('hourly-forecast-container');
    hourlyForecastContainer.innerHTML = ''; // Clear previous hourly forecast

    hourlyData.forEach((hour, index) => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temperature = `${Math.round(hour.main.temp)}°C`;
        const icon = hour.weather[0].icon;
        const desc = hour.weather[0].description;

        const card = document.createElement('div');
        card.classList.add('hourly-card');
        card.style.setProperty('--i', index);

        card.innerHTML = `
        <p class="hourly-time">${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" title="${desc}" class="hourly-icon" />
        <p class="hourly-temp">${temperature}</p>
        `;
        hourlyForecastContainer.appendChild(card);
    })
}

function displayWeatherAlert(alerts) {
    const alertCon = document.getElementById('alert-container');
    const alertContent = document.getElementById('alert-content');

    alertContent.innerHTML = ''; // Clear only the alert content, not the entire container

    if (!alerts || alerts.length === 0) {
        alertCon.style.display = 'none'; // Hide the entire section if no alerts
        return;
    }

    alertCon.style.display = 'block'; // Show alert container when alerts exist

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    alerts.forEach((alert, index) => {
        const alertCard = document.createElement('div');
        alertCard.classList.add('alert-card');
        
         // Determine severity class
         const severity = (alert.event || '').toLowerCase();
         if (severity.includes('warning')) alertCard.classList.add('alert-warning');
         else if (severity.includes('watch')) alertCard.classList.add('alert-watch');
         else alertCard.classList.add('alert-advisory');

          // Add bounce animation delay
        alertCard.style.animationDelay = `${index * 0.2}s`;

        alertCard.innerHTML = `
        <button class="alert-close-btn" aria-label="Close Alert">&times;</button>
            <h3>${alert.event}</h3>
            <p>${alert.description}</p>
            <p><strong>Start:</strong> ${new Date(alert.start * 1000).toLocaleString()}</p>
            <p><strong>End:</strong> ${new Date(alert.end * 1000).toLocaleString()}</p>
        `;

         // Add dismiss logic
        alertCard.querySelector('.alert-close-btn').addEventListener('click', () => {
            alertCard.remove();

            if (!alertContent.hasChildNodes()) {
                alertCon.style.display = 'none'; // Hide the entire section if no alerts remain
            }
        });
        fragment.appendChild(alertCard);
    });

    alertContent.appendChild(fragment); // Append all alert cards at once
}

// Function for AQI data
async function fetchAQIData(lat, lon) {
    const apiKey = 'c4e0dcbdc408a1aee90230a4eed14c00';
    const  url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayAQI(data.list[0]); // Pass the AQI value to the display function
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        alert('Error fetching AQI data. Please try again later.');
    }
}

// Function to display AQI data
function displayAQI(aqiData) {
    const aqiLevel = aqiData.main.aqi;
    const aqiText = document.getElementById('aqi-value');
    const aqiDesc = document.getElementById('aqi-description');
    const aqiSection = document.querySelector('.air-quality');

    if (!aqiText || !aqiDesc) return;

    const aqiDescription = {
        1: "Good 🟢 - Air quality is satisfactory.",
        2: "Fair 🟡 - Acceptable air quality.",
        3: "Moderate 🟠 - May pose risk for sensitive people.",
        4: "Poor 🔴 - Risk for general population.",
        5: "Very Poor 🟣 - Health warnings of emergency conditions."
    };

    aqiText.textContent = `AQI Level: ${aqiLevel}`;
    aqiDesc.textContent = aqiDescription[aqiLevel] || "No data available.";
// BG color based on AQI level
     const bgColors = {
        1: 'hsl(120, 88.60%, 75.90%)',  // Green - Good
        2: 'hsl(39, 94.60%, 78.20%)',  // Yellow/Orange - Fair
        3: 'hsl(30, 90.60%, 70.80%)',  // Orange - Moderate
        4: 'hsl(0, 98.40%, 50.20%)',   // Red - Poor
        5: 'hsl(280, 91.80%, 66.70%)'  // Purple - Very Poor
    };
    aqiSection.style.backgroundColor = bgColors[aqiLevel] || 'hsl(0, 0%, 95%)';
    aqiDesc.style.textTransform = "capitalize"; // Capitalize the description
}
// Function to toggle layout on search (hides and shows grid-layout and postSearch-layout)
function toggleLayoutOnSearch() {
    const gridLayout = document.querySelector('.grid-layout');
    const postSearchLayout = document.querySelector('.postSearch-layout');
    
    if (hasSearched) {
        // Hide grid layout and show postSearch layout
       gridLayout.classList.remove('post-search-active');
       postSearchLayout.classList.add('show')
    } else {
        // Keep grid layout visible and hide postSearch layout
        gridLayout.classList.add('post-search-active');
        postSearchLayout.classList.remove('show');
    }
}
