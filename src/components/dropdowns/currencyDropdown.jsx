import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GlobeAltIcon } from '@heroicons/react/20/solid';

// Euro, British Pound, Hong Kong Dollar, Indian Rupee, South African Rand
const options = [
  { id: 1, name: 'Euro', symbol: '€', imgSrc: 'path/to/image1.jpg', toOneUSD: 0.85, code: 'EUR' },
  { id: 2, name: 'British Pound', symbol: '£', imgSrc: 'path/to/image2.jpg', toOneUSD: 0.72, code: 'GBP' },
  { id: 3, name: 'Hong Kong Dollar', symbol: 'HK$', imgSrc: 'path/to/image3.jpg', toOneUSD: 7.77, code: 'HKD' },
  { id: 4, name: 'Indian Rupee', symbol: '₹', imgSrc: 'path/to/image4.jpg', toOneUSD: 73.66, code: 'INR' },
  { id: 5, name: 'South African Rand', symbol: 'R', imgSrc: 'path/to/image5.jpg', toOneUSD: 14.66, code: 'ZAR' }
];

export const CurrencyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ id: 1, text: 'Option 1', imgSrc: 'path/to/image1.jpg' });
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
    <div ref={ref} className="relative w-28 h-8 bg-navy-blue">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-center
          w-full text-white 
          h-8 rounded-sm
          border-0
          bg-navy-blue
          hover:outline-none hover:bg-light-blue">
        <p className='w-12'>{selectedOption.symbol}</p>
        <p className='w-12'>{selectedOption.code}</p>
        <ChevronDownIcon className="w-4 h-4 ml-1 text-white" />
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
                {option.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
