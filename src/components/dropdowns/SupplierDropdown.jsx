import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';


export const SupplierDropdown = ({ supplier, setSupplier }) => {
  const ref = useRef(null);
  const suppliers = useSelector((state) => state.app.suppliers);

  console.log(suppliers)

  const [isOpen, setIsOpen] = useState(false);

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
    <div ref={ref} className="relative w-40 h-8 rounded-md mr-4">
      <p className='mb-3 font-semibold'>Select a supplier:</p>
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-between
          w-full
          h-8 rounded-lg
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-text">
        <p className='ml-4'>{supplier ? supplier.SupplierName : "---"}</p>
        <ChevronDownIcon className="w-4 h-4 mr-4 text-black" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {suppliers.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setSupplier(option);
                  setIsOpen(false);
                }}
              >
                  <p>{option.SupplierName}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};