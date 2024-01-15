import React from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

const SearchBar = ({ searchTerm, onSearchChange, onEnterPress, placeholder, className }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  };

  return (
    <div className="border border-solid border-black h-8 rounded-lg ml-4 bg-white flex items-center">
        <MagnifyingGlassIcon className="w-5 h-5 text-black ml-2" />
        <input
          type="text"
          className='pl-2'
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div> 
  );
};

export default SearchBar;
