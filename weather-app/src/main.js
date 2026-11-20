
import './style.css'

document.querySelector('#app').innerHTML = `
<div class="dashboard">

  <aside class="sidebar">
    <h2 class="logo">☁ SkyPulse</h2>

    <nav class="sidebar-menu">
      <button class="nav-btn active" data-page="overview">🌤 Overview</button>
      <button class="nav-btn" data-page="locations">📍 Locations</button>
      <button class="nav-btn" data-page="forecast">🗓 Forecast</button>
      <button class="nav-btn" data-page="airquality">🌎 Air Quality</button>
      <button class="nav-btn" data-page="settings">⚙ Settings</button>
    </nav>

    <div class="sidebar-bottom">
      <p>Weather made simple.</p>
      <span>SkyPulse v1.0</span>
    </div>
  </aside>

  <main class="main-content">

    <header class="topbar">
      <div>
        <p class="small-title">WEATHER DASHBOARD</p>
        <h1>Good evening 👋</h1>
        <p class="muted">Explore weather conditions around the world.</p>
      </div>

      <div class="search-box">
        <input id="cityInput" placeholder="Search city..." />
        <button id="searchBtn">Search</button>
      </div>
    </header>

    <section id="overview" class="page active-page">

      <section class="welcome-card">
        <div class="welcome-text">
          <p>LIVE WEATHER</p>
          <h2>Discover your city's weather</h2>
          <p>Stay prepared. Stay informed. Wherever you go.</p>
        </div>
        <div class="welcome-icon">🌤️</div>
      </section>

      <p id="message">Search a city to explore its weather.</p>

      <section id="weatherCard" class="weather-card hidden">
        <div class="weather-main">
          <div>
            <p class="label">CURRENT LOCATION</p>
            <h2 id="cityName">City Name</h2>
            <p id="condition">Weather condition</p>
          </div>

          <div class="temperature-section">
            <div id="weatherIcon">🌤️</div>
            <h1 id="temperature">--°C</h1>
          </div>
        </div>

        <div class="weather-details">
          <div class="weather-box">
            <span>💧</span>
            <p>Humidity</p>
            <h3 id="humidity">--%</h3>
          </div>

          <div class="weather-box">
            <span>💨</span>
            <p>Wind Speed</p>
            <h3 id="wind">-- km/h</h3>
          </div>

          <div class="weather-box">
            <span>🌡️</span>
            <p>Feels Like</p>
            <h3 id="feelsLike">--°C</h3>
          </div>

          <div class="weather-box">
            <span>🌧️</span>
            <p>Rain</p>
            <h3 id="rain">-- mm</h3>
          </div>
        </div>
      </section>

      <section class="extra-section">
        <h2>Weather Insights</h2>

        <div class="insight-grid">
          <div class="insight-card">
            <span>☀️</span>
            <h3>UV Awareness</h3>
            <p>Check the weather before heading outdoors.</p>
          </div>

          <div class="insight-card">
            <span>🌬️</span>
            <h3>Wind Monitor</h3>
            <p>Stay updated with current wind conditions.</p>
          </div>

          <div class="insight-card">
            <span>🌈</span>
            <h3>Smart Weather</h3>
            <p>Weather insights to help plan your day.</p>
          </div>
        </div>
      </section>
    </section>

    <section id="locations" class="page">
      <h2>📍 Locations</h2>
      <p>Search a city or use your current location.</p>

      <div class="feature-panel">
        <button id="locationBtn" class="feature-btn">
          📍 Use My Current Location
        </button>

        <button id="saveCityBtn" class="feature-btn">
          ❤️ Save Current City
        </button>

        <h3>Saved Locations</h3>
        <div id="savedCities">No saved cities yet.</div>
      </div>
    </section>

    <section id="forecast" class="page">
      <h2>🗓 Weather Forecast</h2>
      <p>Check the weather forecast for your selected city.</p>

      <div class="feature-panel">
        <button id="forecastBtn" class="feature-btn">
          Load 7-Day Forecast
        </button>
        <div id="forecastResults"></div>
      </div>
    </section>

    <section id="airquality" class="page">
      <h2>🌎 Air Quality</h2>
      <p>Check air quality information for your selected city.</p>

      <div class="feature-panel">
        <button id="airBtn" class="feature-btn">
          Check Air Quality
        </button>
        <div id="airResults"></div>
      </div>
    </section>

    <section id="settings" class="page">
      <h2>⚙ Settings</h2>
      <p>Customize your SkyPulse experience.</p>

      <div class="feature-panel">
        <label for="unitSelect">Temperature Unit</label>

        <select id="unitSelect">
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
        </select>

        <br><br>

        <button id="themeBtn" class="feature-btn">
          Toggle Light / Dark Theme
        </button>

        <p id="settingsMessage"></p>
      </div>
    </section>

    <footer>
      <p>SkyPulse • Smart Weather Explorer</p>
    </footer>

  </main>
</div>
`

// ==============================
// ELEMENTS
// ==============================

const input = document.getElementById('cityInput')
const searchBtn = document.getElementById('searchBtn')
const message = document.getElementById('message')
const card = document.getElementById('weatherCard')

const navButtons = document.querySelectorAll('.nav-btn')
const pages = document.querySelectorAll('.page')

let currentPlace = null
let currentWeather = null

let savedCities = JSON.parse(
  localStorage.getItem('skySavedCities') || '[]'
)

let temperatureUnit = localStorage.getItem('skyTemperatureUnit') || 'celsius'

// ==============================
// NAVIGATION
// ==============================

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')

    pages.forEach(page => page.classList.remove('active-page'))

    const target = document.getElementById(button.dataset.page)

    if (target) {
      target.classList.add('active-page')
    }
  })
})

// ==============================
// WEATHER INFORMATION
// ==============================

function getWeatherInfo(code) {
  if (code === 0) return ['Clear Sky', '☀️']
  if (code <= 2) return ['Partly Cloudy', '🌤️']
  if (code === 3) return ['Cloudy', '☁️']
  if (code <= 48) return ['Fog', '🌫️']
  if (code <= 67) return ['Rain', '🌧️']
  if (code <= 77) return ['Snow', '❄️']
  if (code <= 82) return ['Rain Showers', '🌦️']
  if (code <= 86) return ['Snow Showers', '🌨️']

  return ['Thunderstorm', '⛈️']
}

// ==============================
// TEMPERATURE CONVERSION
// ==============================

function convertTemperature(value) {
  if (temperatureUnit === 'fahrenheit') {
    return (value * 9 / 5 + 32).toFixed(1) + '°F'
  }

  return value.toFixed(1) + '°C'
}

// ==============================
// DISPLAY WEATHER
// ==============================

function displayWeather(data, placeName) {
  currentWeather = data

  const current = data.current

  document.getElementById('cityName').textContent = placeName

  document.getElementById('temperature').textContent =
    convertTemperature(current.temperature_2m)

  document.getElementById('humidity').textContent =
    current.relative_humidity_2m + '%'

  document.getElementById('wind').textContent =
    current.wind_speed_10m + ' km/h'

  document.getElementById('feelsLike').textContent =
    convertTemperature(current.apparent_temperature)

  document.getElementById('rain').textContent =
    current.precipitation + ' mm'

  const [weatherText, weatherIcon] =
    getWeatherInfo(current.weather_code)

  document.getElementById('condition').textContent = weatherText
  document.getElementById('weatherIcon').textContent = weatherIcon

  card.classList.remove('hidden')
  message.textContent = 'Live weather successfully loaded ☁️'
}

// ==============================
// FETCH WEATHER USING COORDINATES
// ==============================

async function fetchWeather(latitude, longitude) {
  const weatherURL =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,precipitation_probability&timezone=auto`

  const response = await fetch(weatherURL)

  if (!response.ok) {
    throw new Error('Weather API error')
  }

  return await response.json()
}

// ==============================
// CITY SEARCH
// ==============================

async function searchWeather(cityName = input.value.trim()) {
  if (!cityName) {
    message.textContent = 'Please enter a city name!'
    return
  }

  message.textContent = 'Fetching live weather...'
  card.classList.add('hidden')

  try {
    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`

    const geoResponse = await fetch(geoURL)

    if (!geoResponse.ok) {
      throw new Error('Location search failed')
    }

    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      message.textContent = 'City not found. Try another city.'
      return
    }

    currentPlace = geoData.results[0]

    const data = await fetchWeather(
      currentPlace.latitude,
      currentPlace.longitude
    )

    displayWeather(
      data,
      `${currentPlace.name}, ${currentPlace.country || ''}`
    )

    renderSavedCities()

  } catch (error) {
    message.textContent = 'Unable to load weather. Check your internet.'
    console.error(error)
  }
}

searchBtn.addEventListener('click', () => searchWeather())

input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    searchWeather()
  }
})

// ==============================
// SAVED LOCATIONS
// ==============================

function renderSavedCities() {
  const container = document.getElementById('savedCities')

  if (!savedCities.length) {
    container.innerHTML = 'No saved cities yet.'
    return
  }

  container.innerHTML = savedCities.map(city => `
    <div class="saved-city">
      <span>${city}</span>
      <button class="open-city" data-city="${city}">Open</button>
      <button class="remove-city" data-city="${city}">Remove</button>
    </div>
  `).join('')

  container.querySelectorAll('.open-city').forEach(button => {
    button.addEventListener('click', () => {
      searchWeather(button.dataset.city)
      document.querySelector('[data-page="overview"]').click()
    })
  })

  container.querySelectorAll('.remove-city').forEach(button => {
    button.addEventListener('click', () => {
      savedCities = savedCities.filter(
        city => city !== button.dataset.city
      )

      localStorage.setItem(
        'skySavedCities',
        JSON.stringify(savedCities)
      )

      renderSavedCities()
    })
  })
}

// SAVE CURRENT CITY

document.getElementById('saveCityBtn').addEventListener('click', () => {
  if (!currentPlace) {
    alert('First search a city in Overview.')
    return
  }

  const city = currentPlace.name

  if (savedCities.includes(city)) {
    alert('This city is already saved!')
    return
  }

  savedCities.push(city)

  localStorage.setItem(
    'skySavedCities',
    JSON.stringify(savedCities)
  )

  renderSavedCities()
  alert('City saved successfully! ❤️')
})

// ==============================
// CURRENT LOCATION
// ==============================

document.getElementById('locationBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.')
    return
  }

  message.textContent = 'Getting your current location...'

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords

      try {
        const data = await fetchWeather(latitude, longitude)

        currentPlace = {
          name: 'Current Location',
          latitude,
          longitude
        }

        displayWeather(data, '📍 Current Location')

        document.querySelector('[data-page="overview"]').click()

      } catch (error) {
        alert('Unable to load current location weather.')
        console.error(error)
      }
    },

    error => {
      message.textContent = 'Location permission denied or unavailable.'
      alert('Please allow location permission in your browser.')
    }
  )
})

// ==============================
// 7-DAY FORECAST
// ==============================

document.getElementById('forecastBtn').addEventListener('click', () => {
  if (!currentPlace || !currentWeather) {
    alert('First search a city in Overview.')
    return
  }

  const daily = currentWeather.daily
  const container = document.getElementById('forecastResults')

  if (!daily || !daily.time) {
    container.innerHTML = 'Forecast data unavailable.'
    return
  }

  container.innerHTML = `
    <h3>7-Day Forecast for ${currentPlace.name}</h3>
    <div class="forecast-list">
      ${daily.time.map((date, index) => {
        const max = daily.temperature_2m_max[index]
        const min = daily.temperature_2m_min[index]

        return `
          <div class="forecast-row">
            <strong>${date}</strong>
            <span>🌤️</span>
            <span>Max: ${convertTemperature(max)}</span>
            <span>Min: ${convertTemperature(min)}</span>
          </div>
        `
      }).join('')}
    </div>
  `
})

// ==============================
// AIR QUALITY
// ==============================

document.getElementById('airBtn').addEventListener('click', async () => {
  if (!currentPlace) {
    alert('First search a city in Overview.')
    return
  }

  const lat = currentPlace.latitude
  const lon = currentPlace.longitude

  const container = document.getElementById('airResults')
  container.innerHTML = '<p>Loading air quality...</p>'

  try {
    const airURL =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`

    const response = await fetch(airURL)

    if (!response.ok) {
      throw new Error('Air quality API error')
    }

    const data = await response.json()
    const air = data.current

    let status = 'Moderate'

    if (air.pm2_5 <= 10) {
      status = 'Good'
    } else if (air.pm2_5 <= 25) {
      status = 'Fair'
    } else if (air.pm2_5 <= 50) {
      status = 'Poor'
    } else {
      status = 'Very Poor'
    }

    container.innerHTML = `
      <div class="air-status">
        <h2>${status}</h2>
        <p>PM2.5 Level: ${air.pm2_5} µg/m³</p>
        <p>Air quality information for ${currentPlace.name}</p>
      </div>

      <div class="air-grid">
        <div class="air-box">
          <h3>PM2.5</h3>
          <p>${air.pm2_5} µg/m³</p>
        </div>

        <div class="air-box">
          <h3>PM10</h3>
          <p>${air.pm10} µg/m³</p>
        </div>

        <div class="air-box">
          <h3>CO</h3>
          <p>${air.carbon_monoxide} µg/m³</p>
        </div>

        <div class="air-box">
          <h3>NO₂</h3>
          <p>${air.nitrogen_dioxide} µg/m³</p>
        </div>

        <div class="air-box">
          <h3>Ozone</h3>
          <p>${air.ozone} µg/m³</p>
        </div>
      </div>
    `

  } catch (error) {
    container.innerHTML = 'Unable to load air quality.'
    console.error(error)
  }
})

// ==============================
// TEMPERATURE SETTINGS
// ==============================

const unitSelect = document.getElementById('unitSelect')

unitSelect.value = temperatureUnit

unitSelect.addEventListener('change', event => {
  temperatureUnit = event.target.value

  localStorage.setItem('skyTemperatureUnit', temperatureUnit)

  if (currentWeather) {
    displayWeather(
      currentWeather,
      currentPlace.name
    )
  }

  document.getElementById('settingsMessage').textContent =
    `Temperature unit changed to ${temperatureUnit}.`
})

// ==============================
// THEME SETTINGS
// ==============================

const themeBtn = document.getElementById('themeBtn')

if (localStorage.getItem('skyTheme') === 'light') {
  document.body.classList.add('light-theme')
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme')

  const theme = document.body.classList.contains('light-theme')
    ? 'light'
    : 'dark'

  localStorage.setItem('skyTheme', theme)

  document.getElementById('settingsMessage').textContent =
    `Theme changed to ${theme}.`
})

// ==============================
// INITIALIZE
// ==============================

renderSavedCities()
