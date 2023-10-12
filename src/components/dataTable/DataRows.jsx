import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { getQuotes } from './scrapeGem';


export const DataRows = ({ row, rowIndex, columns }) => {
  const currency = useSelector(state => state.app.currency);
  const [isExpanded, setIsExpanded] = useState(false);
  const [gemDisabled, setGemDisabled] = useState(true);
  const [gemLoaded, setGemLoaded] = useState(false);
  const navigate = useNavigate();

  const handleExpand = () => {
    if (isExpanded) {
      setTimeout(() => {
        setGemDisabled(true);
      }, 1000);
    } else {
      setGemDisabled(false);
    }

    setTimeout(() => {
      setGemLoaded(true);
    }, 5000);

    setIsExpanded(!isExpanded);
  }

  return (
    <>
      <tr>
        {columns.map((column, colIndex) => (
          <td key={colIndex} className="px-3 py-4 whitespace-nowrap border-solid border-[1.5px]">
            {column.renderCell ? column.renderCell({ value: row[column.field], row: row }) : row[column.field]}
          </td>
        ))}
        <td className="px-3 py-4 whitespace-nowrap border-solid border-[1.5px]">
          <button onClick={() => {handleExpand()}} className={`${isExpanded ? 'bg-navy-blue text-white' : ''} rounded-md w-6 h-6 duration-300`}>
            {isExpanded ? <ChevronUpIcon className='w-6 h-6'/> : <ChevronDownIcon className='w-6 h-6'/> }
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={columns.length + 1} className={`
            border-0
          `}>
          <div className={`
            overflow-hidden border-none flex justify-between
            transition-max-height duration-500 ease-in-out pr-10
            ${isExpanded ? 'h-72' : 'h-0'}
          `}>
            <div className='flex flex-col items-center justify-top pt-4'>
              <p className='font-bold'>Media</p>
              {/* <img className='w-48 h-48 my-2' src={row.image} alt="" /> */}
              <div className='iframe-container'>
                <iframe src={!gemDisabled ? row["video_link"] : ""} className='iframe-custom my-2'></iframe> 
              </div>
              <button className='bg-dark-grey rounded-sm text-white px-3 py-1 cursor-pointer'>CVD</button>
            </div>
            <div className='pt-4'>
              <p className='font-bold mb-2'>Information</p>
              <div className='mb-2'>
                <p className='text-dark-grey'>IGI</p>
                <p className='font-semibold'>XXXXXXX</p>
              </div>
              <div className='mb-4'>
                <p className='text-dark-grey'>Stock ID</p>
                <p className='font-semibold'>XXXXXXX</p>
              </div>
              <p className='mb-4 rounded-full border-solid border-[1.5px] border-dark-grey px-6'>Req. Shade</p>
              <p className='mb-2 rounded-full border-solid border-[1.5px] border-dark-grey px-6'>Req. Eye clean</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2'>Diamond Details</p>
              <div className='pb-2'>
                {row.shape} {row.specifications.carat}ct {row.specifications.color} {row.specifications.clarity} {row.specifications.cut} {row.finish.polish} {row.finish.symmetry} {row.finish.fluorescence}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-dark-grey'>Measurements</p>
                  <p>{row.ratio_measurements.measurements.width} - {row.ratio_measurements.measurements.height} x {row.ratio_measurements.measurements.depth}</p>
                </div>
                <div>
                  <p className='text-dark-grey'>Depth</p>
                  <p>{row.table_depth.depth}</p>
                </div>

                <div>
                  <p className='text-dark-grey'>Table</p>
                  <p>{row.table_depth.table}</p>
                </div>
                <div>
                  <p className='text-dark-grey'>Ratio</p>
                  <p>{row.ratio_measurements.ratio}</p>
                </div>

                <div>
                  <p className='text-dark-grey'>Treatment</p>
                  <p>XXXXXXX</p>
                </div>
                <div>
                  <p className='text-dark-grey'>Girdle</p>
                  <p>XXXXXXX</p>
                </div>
              </div>

            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2'>Delivery</p>
              <p className='pb-2'>COMPANY</p>
              <div className='flex items-center pb-2'>
                <p className='pr-1'>Location</p>
                <p className='font-semibold'>LOCATION</p>
              </div>
              
              <p className='pb-2'>DELIVERY TYPE</p>
              <p className='pb-2'>DELIVERY TIME</p>
              <p className='pb-2'>Returnable</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2'>Price</p>
              <p className='text-dark-grey'>Total Price</p>
              <p>${row.total}</p>
              <p>{parseFloat(row.total) * currency.toOneUSD} {currency.code}</p>
              <p className='text-dark-grey pt-2'>Price Per Carat</p>
              <p>${(parseFloat(row.total) / parseFloat(row.specifications.carat)).toFixed(2)}/ct</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold'>Actions</p>
              <button className='mt-4 h-7 w-28 rounded-md bg-navy-blue text-white flex justify-center items-center'>Add to cart</button>
              <button onClick={() => {navigate("/details/" + row["id"])}} className='mt-4 h-7 w-28 rounded-md border-solid border-[1.5px] flex justify-center items-center'>More details</button>

              <div className='flex mt-4 justify-between'>
                <button className='group h-10 w-12 rounded-md border-solid border-[#e8413d]/30 border-[1.5px] flex justify-center items-center hover:border-[#e8413d]'>
                  <HeartIcon className='group-hover:text-[#e8413d] w-6 h-6 text-[#e8413d]/30'/>
                </button>
                <button className='group h-10 w-12 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black'>
                  <HandRaisedIcon className='group-hover:text-black w-6 h-6 text-grey'/>
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}