import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';
import euro from '../../assets/euro.png';
import pound from '../../assets/pound.png';
import hongkong from '../../assets/hongkong.png';
import indian from '../../assets/indian.png';
import rand from '../../assets/rand.png';

import { useApp } from '../../hooks/useApp';

// Euro, British Pound, Hong Kong Dollar, Indian Rupee, South African Rand
const options = [
  { id: 1, name: 'Euro', symbol: '€', imgSrc: euro, code: 'EUR' },
  { id: 2, name: 'British Pound', symbol: '£', imgSrc: pound, code: 'GBP' },
  { id: 3, name: 'Hong Kong Dollar', symbol: 'HK$', imgSrc: hongkong, code: 'HKD' },
  { id: 4, name: 'Indian Rupee', symbol: '₹', imgSrc: indian, code: 'INR' },
  { id: 5, name: 'South African Rand', symbol: 'R', imgSrc: rand, code: 'ZAR' }
];

export const CurrencyDropdown = () => {
  const ref = useRef(null);
  const currency = useSelector((state) => state.app.currency);
  const rates = useSelector((state) => state.app.rates);

  console.log(rates)

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(currency);

  const { setCurrency } = useApp();

  const handleSetCurrency = (currency) => {
    setIsOpen(false);
    setCurrency(currency);
    setSelectedOption(currency);
  };

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
    <div ref={ref} className="relative w-28 h-8 rounded-md mr-4">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-center
          w-full 
          h-8 rounded-lg
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-text">
        <p className=''>{selectedOption.symbol}</p>
        <p className='w-12'>{selectedOption.code}</p>
        <ChevronDownIcon className="w-4 h-4 ml-1 text-black" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  handleSetCurrency(option);
                }}
              >
                <img className='w-12 h-8 mr-2 object-cover rounded-lg' src={option.imgSrc} alt={option.name} />
                <div className='flex flex-col'>
                  <p>{option.name} ({option.symbol})</p>
                  <p className='text-xs'>1 USD = {rates[option.code].toFixed(2)} {option.code}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
