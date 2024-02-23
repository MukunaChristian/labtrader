import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';

const colors = [
  "Blue",
  "Pink",
  "Yellow",
  "Orange",
  "Brown"
];

const intensities = [
  "Faint",
  "Very light",
  "Light",
  "Fancy light",
  "Fancy",
  "Fancy dark",
  "Fancy intense",
  "Fancy vivid",
  "Fancy deep"
];


export const ColorPickerDropdown = ({ colorSelection, setColorSelection }) => {
  const ref = useRef(null);
  const [isOpenColor, setIsOpenColor] = useState(false);
  const [isOpenIntensity, setIsOpenIntensity] = useState(false);

  const [selectedColorsIntensities, setSelectedColorsIntensities] = useState({intensities: [], colors: []});

  const separateColorsAndIntensities = (combinedList) => {
    // New lists to hold the separated items
    const sortedIntensities = [...intensities].sort((a, b) => b.length - a.length);
    const matchedColors = [];
    const matchedIntensities = [];

    console.log(combinedList.length);
  
    // Iterate through the combined list
    combinedList.map(combined => {
      combined = combined.toLowerCase();
  
      // Use sortedIntensities for finding matches to ensure longest match is found first
      const intensityMatch = sortedIntensities.find(intensity => combined.includes(intensity.toLowerCase()));
      if (intensityMatch && !matchedIntensities.includes(intensityMatch)) {
        matchedIntensities.push(intensityMatch);
      }
  
      const colorMatch = colors.find(color => combined.includes(color.toLowerCase()));
      if (colorMatch && !matchedColors.includes(colorMatch)) {
        matchedColors.push(colorMatch);
      }
    });

    setSelectedColorsIntensities({colors: matchedColors, intensities: matchedIntensities});
  };

  const createCombinations = () => {
    const combinations = [];
    console.log(selectedColorsIntensities);
    // Iterate through each intensity
    selectedColorsIntensities.intensities.forEach(intensity => {
      // For each intensity, iterate through each color
      selectedColorsIntensities.colors.forEach(color => {
        // Combine the current intensity and color into the desired format
        const combination = `${intensity} ${color}`;
        // Add the combination to the array of combinations
        combinations.push(combination.toLowerCase());
      });

      // if no colors are selected, add the intensity to the array of combinations
      if (selectedColorsIntensities.colors.length === 0) {
        combinations.push(intensity.toLowerCase());
      }
    });
    console.log(combinations)
    return combinations;
  }

  // filter companies to only show suppliers
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpenColor(false);
        setIsOpenIntensity(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    console.log("creating combos");
    setColorSelection("fancyColor", createCombinations());
  }, [selectedColorsIntensities]);

  useEffect(() => {
    separateColorsAndIntensities(colorSelection);
  }, []);


  return (
    <div ref={ref} className="relative w-[50%] min-h-8 rounded-md mr-4 mb-8">
      <button onClick={() => {setIsOpenIntensity(!isOpenIntensity); setIsOpenColor(false)}} 
        className="
          flex items-center justify-between
          w-full mb-2
          rounded-md
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-light-grey">
        <div className='flex flex-wrap'>
          {selectedColorsIntensities.intensities.length === 0 && <p className='ml-3 my-1 p-1 text-dark-grey'>Select Intensity</p>}
          {selectedColorsIntensities.intensities.map((select, index) => (

            <div key={index} className='flex ml-3 my-1 p-1 border-solid border-[1px] border-text rounded-sm'>
              <p>{select}</p>
              <XMarkIcon className="w-4 h-4 ml-2 text-dark-grey hover:bg-grey rounded-full" onClick={() => {
                const newIntensities = selectedColorsIntensities.intensities.filter(intensity => intensity !== select);
                setSelectedColorsIntensities(
                  {
                    colors: selectedColorsIntensities.colors, 
                    intensities: newIntensities
                  }
                );
              }} />
            </div>

          ))}
        </div>
        
        <div className='w-8 h-6 mr-2 border-0 border-solid border-l-[1.5px] pl-2'>
          <ChevronDownIcon className="w-6 h-6 text-dark-grey" />
        </div>
      </button>
      {isOpenIntensity && (
        <div className="absolute right-0 shadow-sm w-full rounded-md bg-white border-solid border-[1.5px] overflow-auto">
          <div className="py-1">
            {intensities.map((option, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  if (selectedColorsIntensities.intensities.includes(option)) return;
                  setSelectedColorsIntensities(
                    {
                      colors: selectedColorsIntensities.colors, 
                      intensities: [...selectedColorsIntensities.intensities, option]
                    }
                  );
                  setIsOpenIntensity(false);
                }}
              >
                <div>
                  <p>{option}</p>
                </div>
                  
              </a>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => {setIsOpenColor(!isOpenColor); setIsOpenIntensity(false)}} 
        className="
          flex items-center justify-between
          w-full
          rounded-md
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-light-grey">
        <div className='flex flex-wrap'>
          {selectedColorsIntensities.colors.length === 0 && <p className='ml-3 my-1 p-1 text-dark-grey'>Select Color</p>}
          {selectedColorsIntensities.colors.map((select, index) => (
            <div key={index} className='flex ml-3 my-1 p-1 border-solid border-[1px] border-text rounded-sm'>
              <p>{select}</p>
              <XMarkIcon className="w-4 h-4 ml-2 text-dark-grey hover:bg-grey rounded-full" onClick={() => {
                const newColors = selectedColorsIntensities.colors.filter(color => color !== select);
                setSelectedColorsIntensities(
                  {
                    colors: newColors, 
                    intensities: selectedColorsIntensities.intensities
                  }
                );
              }} />
            </div>
          ))}
        </div>
        
        <div className='w-8 h-6 mr-2 border-0 border-solid border-l-[1.5px] pl-2'>
          <ChevronDownIcon className="w-6 h-6 text-dark-grey" />
        </div>
        
      </button>
      {isOpenColor && (
        <div className="absolute right-0 mt-2 w-full rounded-md shadow-sm bg-white border-solid border-[1.5px] overflow-auto">
          <div className="py-1">
            {colors.map((option, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  if (selectedColorsIntensities.colors.includes(option)) return;
                  setSelectedColorsIntensities(
                    {
                      intensities: selectedColorsIntensities.intensities, 
                      colors: [...selectedColorsIntensities.colors, option]
                    }
                  );
                  setIsOpenColor(false);
                }}
              >
                <div>
                  <p>{option}</p>
                </div>
                  
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};