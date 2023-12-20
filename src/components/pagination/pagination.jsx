import React, { useState } from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousClick = () => {
    if (currentPage === 1) return;
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    paginate(newPage);
  };

  const handleNextClick = () => {
    if (currentPage === totalPages) return;
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    paginate(newPage);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex list-none">
          <li className={`mx-1 ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700 cursor-pointer'}`}>
            {currentPage !== 1 ? (
              <a onClick={handlePreviousClick} className="cursor-pointer">
                Previous
              </a>
            ) : (
              <span className="cursor-not-allowed">Previous</span>
            )}
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <li key={number} className={`mx-1 ${number === currentPage ? 'font-bold' : 'text-blue-500 hover:text-blue-700 cursor-pointer'}`}>
              <a onClick={() => { paginate(number); setCurrentPage(number); }} className="cursor-pointer">
                {number}
              </a>
            </li>
          ))}
          <li className={`mx-1 ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700 cursor-pointer'}`}>
            {currentPage !== totalPages ? (
              <a onClick={handleNextClick} className="cursor-pointer">
                Next
              </a>
            ) : (
              <span className="cursor-not-allowed">Next</span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
