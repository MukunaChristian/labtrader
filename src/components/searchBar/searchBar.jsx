import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder, className }) => {
  return (
    <input
      type="text"
      className={`default-input ${className}`}
      placeholder={placeholder || "Search..."}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBar;
