import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';


export const DataRows = ({ row, rowIndex, columns }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr>
        {columns.map((column) => (
          <td key={rowIndex} className="px-3 py-4 whitespace-nowrap border-solid border-[1.5px]">
            {column.renderCell ? column.renderCell({ value: row[column.field], row }) : row[column.field]}
          </td>
        ))}
        <td className="px-3 py-4 whitespace-nowrap border-solid border-[1.5px]">
          <div onClick={() => {setIsExpanded(!isExpanded)}} className={`${isExpanded ? 'bg-navy-blue text-white' : ''} rounded-md w-6 h-6 duration-300`}>
            {isExpanded ? <ChevronUpIcon className='w-6 h-6'/> : <ChevronDownIcon className='w-6 h-6'/> }
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={columns.length + 1} className={`
            border-0
          `}>
          <div className={`
            overflow-hidden border-none flex justify-around
            transition-max-height duration-300 ease-in-out 
            ${isExpanded ? 'h-72' : 'h-0'}
          `}>
            <div>
              <p>media</p>
              <img src={row.image} alt="" />
            </div>
            <div>
              <p>Information</p>
            </div>
            <div>
              <p>Diamond Details</p>
            </div>
            <div>
              <p>Delivery</p>
            </div>
            <div>
              <p>Price</p>
            </div>
            <div>
              <p>Actions</p>
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}