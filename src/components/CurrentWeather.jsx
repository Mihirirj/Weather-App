
import React from 'react';

const CurrentWeather = ({ current, hourlyDetail, iconPath, cityName }) => {
  
  const displayData = hourlyDetail || current;

  if (!displayData) return null; 

  // Check if we are displaying an hourly detail to adjust titles/text
  const isHourlyView = !!hourlyDetail; 

  return (
    <div className="current-weather-display">
      {isHourlyView ? (
        <h3 className="current-city-name">
          Weather for {cityName} at {displayData.time}
        </h3>
      ) : (
        <h3 className="current-city-name">{displayData.city}, {displayData.country}</h3>
      )}

      <img 
        src={displayData.icon && displayData.icon.startsWith('http') ? displayData.icon : `${iconPath}${displayData.icon}`} 
        alt={displayData.description || `Weather at ${displayData.time}`} 
        className="weather-icon current-weather-icon"
      />
      <h2 className="temperature">
        {Math.round(displayData.temperature)} <span>℃</span>
      </h2>
      {/* Description might not exist for hourly data from some APIs, so make it optional */}
      {displayData.description && <p className="description">{displayData.description}</p>}
      
      {/* Show detailed grid only for overall current weather, or adapt for hourly */}
      {!isHourlyView && current && ( // Only show grid if it's the main current weather
        <div className="weather-details-grid">
          <div className="detail-item">
            <span className="material-symbols-rounded">thermostat</span>
            <div>
              <p>{Math.round(current.feels_like)}℃</p>
              <span>Feels like</span>
            </div>
          </div>
          <div className="detail-item">
            <span className="material-symbols-rounded">humidity_percentage</span>
            <div>
              <p>{current.humidity}%</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="detail-item">
            <span className="material-symbols-rounded">air</span>
            <div>
              <p>{Math.round(current.wind_speed)} km/h</p>
              <span>Wind Speed</span>
            </div>
          </div>
        </div>
      )}
      {/* -- */}
      {/* {isHourlyView && (
        <div className="hourly-specific-details">
           <p>Specifics for this hour...</p>
        </div>
      )} */}
    </div>
  );
};

export default CurrentWeather;
