import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';


export const WarehouseDropdown = ({ warehouse, setWarehouse, disabled, supplier }) => {
  const ref = useRef(null);
  const warehouses = useSelector((state) => state.app.warehouses);
  const [stateWarehouses, setStateWarehouses] = useState(warehouses);
  const [isOpen, setIsOpen] = useState(false);
  console.log(warehouses)

  useEffect(() => {
    // if supplier filter warehouses so that only warehouses from that supplier are shown
    if (supplier) {
      setStateWarehouses(warehouses.filter((w) => w.company_id === supplier.id));
    }
    
  }, [supplier]);
  

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
      <p className='mb-3 font-semibold text-left '>Select a warehouse:</p>
      <button onClick={() => setIsOpen(!isOpen)} 
        disabled={disabled}
        className={`
          flex items-center justify-between
          w-full
          h-9 rounded-lg
          border-0 cursor-pointer
          border-solid border-[1px]
          ${disabled ? 'border-grey text-grey' : 'border-black hover:outline-none hover:bg-text'}`}>
        <p className='ml-4'>{warehouse ? warehouse.name : "---"}</p>
        {!disabled && 
          <ChevronDownIcon className="w-4 h-4 mr-4 text-black" />
        }
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {stateWarehouses.length > 0 ? stateWarehouses.map((option) => (
              <a
                key={option.name}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setWarehouse(option);
                  setIsOpen(false);
                }}
              >
                <div>
                  <p>{option.name}</p>
                    {/* {(option.WarehouseCode.slice(1) > 50) && 
                      <p className="text-left text-xs text-red-500 self-start">Consignment</p>
                    } */}
                </div>
                  
              </a>
            )) : <div

            className="flex items-center text-black px-4 py-2"

          >
            <div>
              <p>No Warehouses</p>
                {/* {(option.WarehouseCode.slice(1) > 50) && 
                  <p className="text-left text-xs text-red-500 self-start">Consignment</p>
                } */}
            </div>
              
          </div>}
          </div>
        </div>
      )}
    </div>
  );
};