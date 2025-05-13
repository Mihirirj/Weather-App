// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import SearchSection from './components/SearchSection';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import { fetchWeatherDataByCity, fetchWeatherDataByCoords } from './services/weatherService';

const App = () => {
  const [city, setCity] = useState('Kegalle');
  const [lastSearchedCity, setLastSearchedCity] = useState('Kegalle');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null); // <<< NEW STATE for selected hourly item

  const iconPath = "/weather-app-reactjs-images-2024-09-21/icons/";

  const performSearch = useCallback(async (searchFunction, term, isRefresh = false) => {
    console.log(`[App performSearch] Term: ${term}, isRefresh: ${isRefresh}`);
    setLoading(true);
    setError(null);
    setSelectedHour(null); // <<< RESET selected hour on new search/refresh
    if (!isRefresh) {
      setWeatherData(null);
    }
    try {
      const data = await searchFunction(term);
      setWeatherData(data);
      if (data && data.current && data.current.city) {
        setCity(data.current.city);
        if (!isRefresh) setLastSearchedCity(data.current.city);
      } else if (typeof term === 'string' && !isRefresh) {
         setLastSearchedCity(term);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch weather data. Please try again.");
      if (!isRefresh) setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    performSearch((cityTerm) => fetchWeatherDataByCity(cityTerm), searchTerm);
  }, [performSearch]);

  const handleLocationSearch = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      setSelectedHour(null); // <<< RESET selected hour
      setWeatherData(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
           try {
            const data = await fetchWeatherDataByCoords(latitude, longitude);
            setWeatherData(data);
            if (data && data.current && data.current.city) {
                setCity(data.current.city);
                setLastSearchedCity(data.current.city);
            }
          } catch (err) {
            setError(err.message || "Failed to fetch weather for current location.");
            setWeatherData(null);
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          setError(`Geolocation error: ${geoError.message}. Please ensure location services are enabled.`);
          setLoading(false);
          setWeatherData(null);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // <<< NEW: Handler for clicking an hourly forecast item
  const handleHourClick = (hourData) => {
    console.log("Clicked hour:", hourData);
    setSelectedHour(hourData);
  };

  useEffect(() => {
    if (lastSearchedCity && !weatherData && !loading && !error) {
        handleSearch(lastSearchedCity);
    }
  }, []);

  useEffect(() => {
    const refreshWeatherData = () => {
      if (lastSearchedCity && !loading) {
        performSearch((cityTerm) => fetchWeatherDataByCity(cityTerm), lastSearchedCity, true);
      }
    };
    const intervalId = setInterval(refreshWeatherData, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [lastSearchedCity, performSearch]);


  return (
    <div className="container">
      <SearchSection onSearch={handleSearch} onLocationSearch={handleLocationSearch} />
      
      {loading && <p className="loading-message">Loading weather data...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {weatherData && !loading && !error && (
        <div className="weather-section">
          {/* Pass selectedHour and also the main current weather */}
          <CurrentWeather 
            current={selectedHour ? null : weatherData.current} // Show main current if no hour selected
            hourlyDetail={selectedHour} // Pass selected hour data
            iconPath={iconPath} 
            cityName={weatherData.current.city} // Pass city name for context
          />
          <HourlyForecast 
            hourly={weatherData.hourly} 
            iconPath={iconPath} 
            onHourClick={handleHourClick} // <<< Pass the click handler
            selectedTime={selectedHour ? selectedHour.time : null} // To highlight selected item
          />
        </div>
      )}

      {!weatherData && !loading && !error && (
        <p className="info-message">Enter a city to get started or use current location.</p>
      )}
    </div>
  );
};

export default App;