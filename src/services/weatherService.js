// src/services/weatherService.js
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
console.log("[weatherService Global] API_KEY loaded:", API_KEY); // For API Key debugging

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getIconFileName = (owmIconCode) => {
    console.log("[getIconFileName] Received OWM Icon Code:", owmIconCode);

    const iconMap = {
        // DAYTIME ICONS
        "01d": "clear.svg",                 // Clear sky day
        "02d": "clouds.svg",                // Few clouds day (could be more specific if you have 'partly-cloudy-day.svg')
        "03d": "clouds.svg",                // Scattered clouds day
        "04d": "clouds.svg",                // Broken clouds / Overcast day (could be more specific if you have 'overcast.svg')
        "09d": "rain.svg",                  // Shower rain day (light/drizzle)
        "10d": "moderate_heavy_rain.svg",   // Rain day (using your more specific icon)
        "11d": "thunder_rain.svg",          // Thunderstorm day (using your specific icon with rain)
                                            // If OWM sends a code for just thunder, you'd map to "thunder.svg"
        "13d": "snow.svg",                  // Snow day
        "50d": "mist.svg",                  // Mist/Fog day

        // NIGHTTIME ICONS
        "01n": "clear.svg",                 // Clear sky night (assuming same as day if no night-specific)
        "02n": "clouds.svg",                // Few clouds night
        "03n": "clouds.svg",                // Scattered clouds night
        "04n": "clouds.svg",                // Broken clouds / Overcast night
        "09n": "rain.svg",                  // Shower rain night
        "10n": "moderate_heavy_rain.svg",   // Rain night
        "11n": "thunder_rain.svg",          // Thunderstorm night
        "13n": "snow.svg",                  // Snow night
        "50n": "mist.svg",                  // Mist/Fog night
    };

    const selectedIconFilename = iconMap[owmIconCode];
    console.log("[getIconFileName] Mapped to filename:", selectedIconFilename);

    // Ensure "no-result.svg" is in your public icons folder
    const finalFilename = selectedIconFilename || "no-result.svg";
    console.log("[getIconFileName] Final filename to return:", finalFilename);

    return finalFilename;
};


export const fetchWeatherDataByCity = async (city) => {
    console.log("[fetchWeatherDataByCity] Called with city:", city, "Using API_KEY:", API_KEY);
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    console.log("[fetchWeatherDataByCity] Fetching Geo URL:", geoUrl);

    try {
        const geoResponse = await fetch(geoUrl);
        console.log("[fetchWeatherDataByCity] Geo Response Status:", geoResponse.status, "OK?:", geoResponse.ok);
        if (!geoResponse.ok) {
            const errorData = await geoResponse.json().catch(() => ({ message: "Failed to parse geo error response" }));
            console.error("[fetchWeatherDataByCity] Geo API Error Response:", errorData);
            throw new Error(errorData.message || `City not found or API error (Geo). Status: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        if (!geoData || geoData.length === 0) {
            throw new Error(`Could not find coordinates for ${city}.`);
        }
        const { lat, lon, name, country } = geoData[0];

        const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        console.log("[fetchWeatherDataByCity] Fetching Current Weather URL:", currentUrl);
        const currentWeatherResponse = await fetch(currentUrl);
        console.log("[fetchWeatherDataByCity] Current Weather Response Status:", currentWeatherResponse.status, "OK?:", currentWeatherResponse.ok);
        if (!currentWeatherResponse.ok) {
            const errorData = await currentWeatherResponse.json().catch(() => ({ message: "Failed to parse current weather error response" }));
            console.error("[fetchWeatherDataByCity] Current Weather API Error Response:", errorData);
            throw new Error(errorData.message || `Failed to fetch current weather data. Status: ${currentWeatherResponse.status}`);
        }
        const currentData = await currentWeatherResponse.json();
        console.log("[fetchWeatherDataByCity] OWM Current Weather Icon Code from API:", currentData.weather[0].icon);


        const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=8`;
        console.log("[fetchWeatherDataByCity] Fetching Forecast URL:", forecastUrl);
        const forecastResponse = await fetch(forecastUrl);
        console.log("[fetchWeatherDataByCity] Forecast Response Status:", forecastResponse.status, "OK?:", forecastResponse.ok);
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json().catch(() => ({ message: "Failed to parse forecast error response" }));
            console.error("[fetchWeatherDataByCity] Forecast API Error Response:", errorData);
            throw new Error(errorData.message || `Failed to fetch forecast data. Status: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        
        return {
            current: {
                temperature: currentData.main.temp,
                description: currentData.weather[0].description,
                icon: getIconFileName(currentData.weather[0].icon),
                city: name,
                country: country,
                humidity: currentData.main.humidity,
                wind_speed: currentData.wind.speed * 3.6,
                feels_like: currentData.main.feels_like,
            },
            hourly: forecastData.list.map(item => {
                console.log("[fetchWeatherDataByCity] OWM Hourly Weather Icon Code from API:", item.weather[0].icon);
                return {
                    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    icon: getIconFileName(item.weather[0].icon),
                    temperature: item.main.temp,
                };
            }),
        };

    } catch (error) {
        console.error("Error in fetchWeatherDataByCity:", error.message);
        throw error;
    }
};

export const fetchWeatherDataByCoords = async (lat, lon) => {
    console.log(`[fetchWeatherDataByCoords] Called with Lat: ${lat}, Lon: ${lon}`, "Using API_KEY:", API_KEY);
    const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log("[fetchWeatherDataByCoords] Fetching Current URL:", currentUrl);

    try {
        const currentWeatherResponse = await fetch(currentUrl);
        console.log("[fetchWeatherDataByCoords] Current Response Status:", currentWeatherResponse.status, "OK?:", currentWeatherResponse.ok);
        if (!currentWeatherResponse.ok) {
            const errorData = await currentWeatherResponse.json().catch(() => ({ message: "Failed to parse current weather error response" }));
            console.error("[fetchWeatherDataByCoords] Current API Error Response:", errorData);
            throw new Error(errorData.message || `Failed to fetch current weather data. Status: ${currentWeatherResponse.status}`);
        }
        const currentData = await currentWeatherResponse.json();
        console.log("[fetchWeatherDataByCoords] OWM Current Weather Icon Code from API:", currentData.weather[0].icon);

        const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=8`;
        console.log("[fetchWeatherDataByCoords] Fetching Forecast URL:", forecastUrl);
        const forecastResponse = await fetch(forecastUrl);
        console.log("[fetchWeatherDataByCoords] Forecast Response Status:", forecastResponse.status, "OK?:", forecastResponse.ok);
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json().catch(() => ({ message: "Failed to parse forecast error response" }));
            console.error("[fetchWeatherDataByCoords] Forecast API Error Response:", errorData);
            throw new Error(errorData.message || `Failed to fetch forecast data. Status: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        
        return {
            current: {
                temperature: currentData.main.temp,
                description: currentData.weather[0].description,
                icon: getIconFileName(currentData.weather[0].icon),
                city: currentData.name,
                country: currentData.sys.country,
                humidity: currentData.main.humidity,
                wind_speed: currentData.wind.speed * 3.6,
                feels_like: currentData.main.feels_like,
            },
            hourly: forecastData.list.map(item => {
                console.log("[fetchWeatherDataByCoords] OWM Hourly Weather Icon Code from API:", item.weather[0].icon);
                return {
                    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    icon: getIconFileName(item.weather[0].icon),
                    temperature: item.main.temp,
                };
            }),
        };
    } catch (error) {
        console.error("Error in fetchWeatherDataByCoords:", error.message);
        throw error;
    }
};