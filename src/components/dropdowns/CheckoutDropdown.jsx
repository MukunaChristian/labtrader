import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Euro, British Pound, Hong Kong Dollar, Indian Rupee, South African Rand

export const CheckoutDropdown = ({ toggleDelivery, initialState, options }) => {
  const ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialState);

  const handleSetDelivery = (option) => {
    setIsOpen(false);
    setSelectedOption(option);
    toggleDelivery(option);
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
    <div ref={ref} className="relative min-w-[8rem] rounded-md mr-4">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-between
          w-full 
          rounded-lg
          bg-accent
          border-0 cursor-pointer
          w-[8rem] px-4 py-3 
          text-white
          h-10
          border-black border-solid border-[1px]
          ">
        <p className=''>{selectedOption}</p>
        <ChevronDownIcon className="w-4 h-4 text-white" />
      </button>
      {isOpen && (
        <div className='absolute right-0 top-[-11rem] h-[10rem] flex items-end'>
          <div className={`min-w-[8rem] bg-white border-solid border-[1.5px] rounded-sm ${(options.length > 4) && 'overflow-y-scroll h-full'}`}>
            <div className="py-1 ">
              {options.map((option) => (
                <a
                  key={option.id}
                  href="#"
                  className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                  onClick={() => {
                    handleSetDelivery(option);
                  }}
                >
                  <div className='flex flex-col'>
                    <p>{option}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}