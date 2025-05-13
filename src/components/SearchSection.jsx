// src/components/SearchSection.jsx
import React, { useState } from 'react';

const SearchSection = ({ onSearch, onLocationSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm(''); // Optionally clear input after search
    }
  };

  return (
    <> {/* This fragment ensures these two elements are direct children of .container for flex layout */}
      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-form">
          <span className="material-symbols-rounded">search</span>
          <input
            type="search"
            placeholder="Enter a city name"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </form>
      </div>
      <button type="button" className="location-button" onClick={onLocationSearch}>
        <span className="material-symbols-rounded">my_location</span>
      </button>
    </>
  );
};

export default SearchSection;