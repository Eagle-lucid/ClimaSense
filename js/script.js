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
            temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;
    
            // Update the weather condition
            weatherCondition.textContent = weatherData.weather[0].description;
            weatherCondition.style.textTransform = "capitalize";
    
            // Update the weather icon
            const iconCode = weatherData.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = weatherData.weather[0].description;
            weatherIcon.title = weatherData.weather[0].description;
            
            // Only stop loop on first search
            if (!hasSearched) {
                const season = determineSeasonByMonth();
                stopLoopAndSetWeatherBG(season); // Stop the looping background and set the weather background
                hasSearched = true; // Set the flag to true after the first search
            }
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