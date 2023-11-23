import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';


export const WarehouseDropdown = ({ warehouse, setWarehouse }) => {
  const ref = useRef(null);
  const warehouses = useSelector((state) => state.app.warehouses);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    console.log(warehouses[2].WarehouseCode.slice(1) > 50)

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
          h-12 rounded-lg
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-text">
        <p className='ml-4'>{warehouse ? warehouse.WarehouseName : "---"}</p>
        <ChevronDownIcon className="w-4 h-4 mr-4 text-black" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {warehouses.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setWarehouse(option);
                  setIsOpen(false);
                }}
              >
                <div>
                  <p>{option.WarehouseName}</p>
                    {(option.WarehouseCode.slice(1) > 50) && 
                      <p className="text-left text-xs text-red-500 self-start">Consignment</p>
                    }
                </div>
                  
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};