// Weather app functionality
const API_KEY = 'YOUR_API_KEY_HERE'; // You'll need to get this from OpenWeatherMap
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Weather data elements
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize with current date
updateDate();

function updateDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    date.textContent = now.toLocaleDateString('en-US', options);
}

async function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showDemoData(city);
        return;
    }

    showLoading();

    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        showError('City not found. Please try again.');
    }
}

async function fetchWeatherData(city) {
    const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error('Weather data not found');
    }

    return await response.json();
}

function displayWeatherData(data) {
    hideAllSections();

    // Update weather information
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;

    // Update weather details
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Update weather icon
    updateWeatherIcon(data.weather[0].main, data.weather[0].id);

    weatherInfo.classList.add('show');
}

function updateWeatherIcon(weatherMain, weatherId) {
    let iconClass = 'fas fa-cloud';

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            iconClass = 'fas fa-sun';
            break;
        case 'clouds':
            iconClass = weatherId === 801 ? 'fas fa-cloud-sun' : 'fas fa-cloud';
            break;
        case 'rain':
            iconClass = weatherId >= 500 && weatherId <= 504 ? 'fas fa-cloud-rain' : 'fas fa-cloud-showers-heavy';
            break;
        case 'drizzle':
            iconClass = 'fas fa-cloud-rain';
            break;
        case 'thunderstorm':
            iconClass = 'fas fa-bolt';
            break;
        case 'snow':
            iconClass = 'fas fa-snowflake';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            iconClass = 'fas fa-smog';
            break;
        default:
            iconClass = 'fas fa-cloud';
    }

    weatherIcon.className = iconClass;
}

function showDemoData(city) {
    hideAllSections();

    // Demo data for when API key is not set
    const demoData = {
        name: city,
        country: 'Demo',
        temp: Math.floor(Math.random() * 30) + 5,
        description: 'partly cloudy',
        visibility: (Math.random() * 10 + 5).toFixed(1),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: (Math.random() * 20 + 5).toFixed(1),
        feelsLike: Math.floor(Math.random() * 30) + 5,
        weatherMain: 'Clouds'
    };

    cityName.textContent = `${demoData.name}, ${demoData.country}`;
    temp.textContent = demoData.temp;
    description.textContent = demoData.description;
    visibility.textContent = `${demoData.visibility} km`;
    humidity.textContent = `${demoData.humidity}%`;
    windSpeed.textContent = `${demoData.windSpeed} km/h`;
    feelsLike.textContent = `${demoData.feelsLike}°C`;

    updateWeatherIcon(demoData.weatherMain, 801);

    weatherInfo.classList.add('show');

    // Show API key message
    setTimeout(() => {
        alert('Demo mode: To get real weather data, sign up for a free API key at openweathermap.org and replace YOUR_API_KEY_HERE in weather.js');
    }, 1000);
}

function showLoading() {
    hideAllSections();
    loading.classList.add('show');
}

function showError(message) {
    hideAllSections();
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('show');
}

function hideAllSections() {
    weatherInfo.classList.remove('show');
    errorMessage.classList.remove('show');
    loading.classList.remove('show');
}

// Get user's location weather on page load (optional)
function getUserLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                if (API_KEY !== 'YOUR_API_KEY_HERE') {
                    try {
                        const response = await fetch(
                            `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                        );

                        if (response.ok) {
                            const data = await response.json();
                            displayWeatherData(data);
                        }
                    } catch (error) {
                        console.log('Could not get location weather');
                    }
                }
            },
            (error) => {
                console.log('Geolocation not available');
            }
        );
    }
}

// Uncomment the line below to get weather for user's location on page load
// getUserLocationWeather();