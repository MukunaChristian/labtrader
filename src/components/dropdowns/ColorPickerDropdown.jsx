import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';


export const ColorPickerDropdown = ({ colorSelection, setColorSelection }) => {
  const ref = useRef(null);
  const companies = useSelector((state) => state.app.companies);
  const [isOpen, setIsOpen] = useState(false);

  // filter companies to only show suppliers
  const suppliers = companies.filter(company => company.type_id === 1)

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
      <p className='mb-3 font-semibold text-left '>Select a supplier:</p>
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-between
          w-full
          h-9 rounded-lg
          border-0 cursor-pointer
          border-black border-solid border-[1px]
          hover:outline-none hover:bg-text">
        <div>
          {colorSelection.map((select) => {
            <p className='ml-4'>{select.display}</p>
          })}
        </div>
        
        <ChevronDownIcon className="w-4 h-4 mr-4 text-black" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white border-solid border-[1.5px] overflow-auto">
          <div className="py-1 max-h-[10rem]">
            {suppliers.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setColorSelection({...colorSelection, option});
                  setIsOpen(false);
                }}
              >
                <div>
                  <p>{option.display}</p>
                </div>
                  
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};