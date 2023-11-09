import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import loader from '../../assets/loader.gif';
// import { getQuotes } from './scrapeGem';


export const DataRows = ({ row, rowIndex, columns }) => {
  const currency = useSelector(state => state.app.currency);
  const [isExpanded, setIsExpanded] = useState(false);
  const [gemDisabled, setGemDisabled] = useState(true);
  const [gemLoaded, setGemLoaded] = useState(false);
  const navigate = useNavigate();

  const handleExpand = () => {
    console.log("expand")
    if (isExpanded) {
      setTimeout(() => {
        setGemDisabled(true);
      }, 1000);
    
    } else {
      setGemDisabled(false);
    }

    setIsExpanded(!isExpanded);
  }

  return (
    <>
      <tr>
        {columns.map((column, colIndex) => (
          <td key={colIndex} className={`w-[${row.width}px] px-3 py-4 whitespace-nowrap text-text border-solid border-[1.5px] border-dark-grey`}>
            {column.renderCell ? column.renderCell({ value: row[column.field], row: row }) : row[column.field]}
          </td>
        ))}
        <td className="px-3 py-4 whitespace-nowrap border-solid border-[1.5px] border-dark-grey">
          <button onClick={() => {handleExpand()}} className={`${isExpanded ? 'bg-accent text-white' : ''} rounded-md w-6 h-6 duration-300`}>
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
            <div className='flex flex-col items-center justify-top pt-4 pl-4'>
              <p className='font-bold text-primary'>Media</p>
              <div className={`${row["video_link"].includes("videos.gem360.in") ? 'iframe-container-second' : 'iframe-container'} ${gemLoaded ? 'block bg-accent' : 'hidden'}`}>
                {!gemDisabled ? 
                  <iframe src={row["video_link"]} onLoad={() => setGemLoaded(true)} className={`iframe-custom my-2`}></iframe> 
                : <div className='iframe-custom my-2 bg-text'></div>}
              </div>
              {gemLoaded ? null : 
                <div className='iframe-container h-full flex items-center justify-center '><img className='w-5 h-5' src={loader}/></div>
              }
              <button className='bg-dark-grey rounded-sm text-white px-3 py-1 cursor-pointer'>CVD</button>
            </div>
            <div className='pt-4'>
              <p className='font-bold text-primary mb-2'>Information</p>
              <div className='mb-2'>
                <p className='text-primary'>IGI</p>
                <p className='font-semibold text-text'>{row.cert_id}</p>
              </div>
              <div className='mb-4'>
                <p className='text-primary'>Stock ID</p>
                <p className='font-semibold text-text'>{row.id}</p>
              </div>
              <p className='mb-4 rounded-full border-solid border-[1.5px] border-dark-grey px-6 text-text'>Req. Shade</p>
              <p className='mb-2 rounded-full border-solid border-[1.5px] border-dark-grey px-6 text-text'>Req. Eye clean</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Diamond Details</p>
              <div className='pb-2 text-text'>
                {row.shape.toUpperCase()} {row.specifications.carat}ct {row.specifications.color} {row.specifications.clarity.toUpperCase()} {row.specifications.cut.toUpperCase()} {row.finish.polish.toUpperCase()} {row.finish.symmetry.toUpperCase()} {row.finish.fluorescence.toUpperCase()}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-primary'>Measurements</p>
                  <p className='text-text'>{row.ratio_measurements.measurements.width} - {row.ratio_measurements.measurements.height} x {row.ratio_measurements.measurements.depth}</p>
                </div>
                <div>
                  <p className='text-primary'>Depth</p>
                  <p className='text-text'>{row.table_depth.depth}</p>
                </div>

                <div>
                  <p className='text-primary'>Table</p>
                  <p className='text-text'>{row.table_depth.table}</p>
                </div>
                <div>
                  <p className='text-primary'>Ratio</p>
                  <p className='text-text'>{row.ratio_measurements.ratio}</p>
                </div>

                <div>
                  <p className='text-primary'>Treatment</p>
                  <p className='text-text'>XXXXXXX</p>
                </div>
                <div>
                  <p className='text-primary'>Girdle</p>
                  <p className='text-text'>XXXXXXX</p>
                </div>
              </div>

            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Delivery</p>
              <p className='pb-2 text-text'>COMPANY</p>
              <div className='flex items-center pb-2'>
                <p className='pr-1 text-text'>Location</p>
                <p className='font-semibold text-text'>LOCATION</p>
              </div>
              
              <p className='pb-2 text-text'>DELIVERY TYPE</p>
              <p className='pb-2 text-text'>DELIVERY TIME</p>
              <p className='pb-2 text-text'>Returnable</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Price</p>
              <p className='text-primary'>Total Price</p>
              <p className='text-text'>${row.total}</p>
              <p className='text-text'>{parseFloat(row.total) * currency.toOneUSD} {currency.code}</p>
              <p className='text-primary pt-2'>Price Per Carat</p>
              <p className='text-text'>${(parseFloat(row.total) / parseFloat(row.specifications.carat)).toFixed(2)}/ct</p>
            </div>
            <div className='pt-4'>
              <p className='font-bold text-primary'>Actions</p>
              <button className='mt-4 h-7 w-28 rounded-md bg-accent text-white flex justify-center items-center'>Add to cart</button>
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