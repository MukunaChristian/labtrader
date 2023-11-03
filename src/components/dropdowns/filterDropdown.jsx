import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GlobeAltIcon } from '@heroicons/react/20/solid';

// Euro, British Pound, Hong Kong Dollar, Indian Rupee, South African Rand
const options = [
  { id: 1, text: 'USD', imgSrc: 'path/to/image1.jpg' },
  { id: 2, text: 'EUR', imgSrc: 'path/to/image2.jpg' },
];

export const FilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative h-8">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-center
          h-8 rounded-sm
          px-2
          border-solid border-[1.5px]
          bg-white
          cursor-pointer z-[-20]
          hover:outline-none hover:bg-light-grey">
        <p className='w-12'>{selectedOption.text ? selectedOption.text : "Price"}</p>
        <ChevronDownIcon className="w-4 h-4 ml-1 text-navy-blue" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                }}
              >
                {option.text}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};