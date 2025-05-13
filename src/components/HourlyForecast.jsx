
import React from 'react';

// HourlyForecastItem now accepts onHourClick and isSelected
const HourlyForecastItem = ({ item, iconPath, onHourClick, isSelected }) => {
  return (
    // Make the whole li clickable, or add a button inside
    <li 
      className={`weather-item ${isSelected ? 'selected' : ''}`} // Add 'selected' class if it's the chosen one
      onClick={() => onHourClick(item)} // Call the handler with the item's data
      role="button" // For accessibility
      tabIndex={0} // For accessibility
      onKeyPress={(e) => e.key === 'Enter' && onHourClick(item)} // For accessibility
    >
      <p className="time">{item.time}</p>
      <img
        src={`${iconPath}${item.icon}`} 
        alt={`Weather at ${item.time}`}
        className="weather-icon hourly-weather-icon"
      />
      <p className="temperature-hourly">{Math.round(item.temperature)}<span>℃</span></p>
    </li>
  );
};

// HourlyForecast now accepts onHourClick and selectedTime
const HourlyForecast = ({ hourly, iconPath, onHourClick, selectedTime }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <ul className="weather-list">
        {hourly.map((item, index) => (
          <HourlyForecastItem 
            key={`${item.time}-${index}`} 
            item={item} 
            iconPath={iconPath}
            onHourClick={onHourClick} // Pass the click handler down
            isSelected={item.time === selectedTime} // Check if this item is the selected one
          />
        ))}
      </ul>
    </div>
  );
};

export default HourlyForecast;
