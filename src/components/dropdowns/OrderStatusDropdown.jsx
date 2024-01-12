import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Euro, British Pound, Hong Kong Dollar, Indian Rupee, South African Rand
const options = [
  { id: "hold", name: "On Hold" },  
  { id: "in_stock", name: "In Stock" },
  { id: "no_stock", name: "No Stock" },
  { id: "sold", name: "Sold" },
  { id: "ready_for_ship", name: "Ready to be shipped" },
  { id: "ready_for_collect", name: "Ready for collection" },
  { id: "collected", name: "Collected" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" }
];

export const OrderStatusDropdown = ({ toggleStatus, statusId }) => {
  const ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSetDelivery = (option) => {
    setIsOpen(false);
    setSelectedOption(option.name);
    toggleStatus(option.id);
  };

  useEffect(() => {
    if ( statusId ) {
      setSelectedOption(options.find(option => option.id === statusId).name);
    
    }
  }, [statusId])

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
    <div ref={ref} className="relative w-[100%] h-[100%] rounded-md">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-between
          w-[100%] border-solid border-text border-[1px] rounded-md
          cursor-pointer px-4 py-2 
          focus:border-[1px]
          hover:outline-none hover:bg-text focus:border-black">
        <p className='w-full'>{selectedOption}</p>
        <ChevronDownIcon className="w-4 h-4 text-black" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-[100%] bg-white border-solid border-[1px] border-t-0 border-black rounded-sm">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  handleSetDelivery(option);
                }}
              >
                <div className='text-left '>
                  <p>{option.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}