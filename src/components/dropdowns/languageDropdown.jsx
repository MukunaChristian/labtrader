import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GlobeAltIcon } from '@heroicons/react/20/solid';

const options = [
  { id: 1, text: 'English', imgSrc: 'path/to/image1.jpg' },
  { id: 2, text: 'Français', imgSrc: 'path/to/image2.jpg' },
  { id: 3, text: 'Italiano', imgSrc: 'path/to/image3.jpg' },
  { id: 3, text: 'Español', imgSrc: 'path/to/image3.jpg' }
];

export const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ id: 1, text: 'English', imgSrc: 'path/to/image1.jpg' },);
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
    <div ref={ref} className="relative w-28 h-8 rounded-md">
      <button onClick={() => setIsOpen(!isOpen)} 
        className="
          flex items-center justify-center
          w-full text-white 
          h-8 rounded-md
          border-0 cursor-pointer
          bg-background
          border-white border-solid border-[1px]
          hover:outline-none hover:bg-text">
        <GlobeAltIcon className="w-4 h-4 mr-2 text-white" />
        <p className='w-12'>{selectedOption.text}</p>
        <ChevronDownIcon className="w-4 h-4 ml-1 text-white" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border-solid border-[1.5px] rounded-sm">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option.id}
                href="#"
                className="flex items-center text-black px-4 py-2 hover:bg-gray-200"
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
