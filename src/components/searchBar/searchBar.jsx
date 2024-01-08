import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onEnterPress, placeholder, className }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  };

  return (
    <input
      type="text"
      className={`default-input ${className}`}
      placeholder={placeholder || "Search..."}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

export default SearchBar;
