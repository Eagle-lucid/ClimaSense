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
            throw new Error('City not found');
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
        }
    }  catch (error) {
        console.error('Error updating weather UI:', error);
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