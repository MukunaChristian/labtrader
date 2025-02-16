import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import loader from '../../assets/loader.gif';
import { addDiamondToCart, removeDiamondFromCart } from '../../reducers/UserSlice';
import { useDispatch } from 'react-redux';
import { downloadCertFile } from '../../api/certFile';


export const DataRows = ({ row, rowIndex, columns }) => {
  const currency = useSelector(state => state.app.currency);
  const rates = useSelector(state => state.app.rates);
  const diamonds_in_cart = useSelector(state => state.user.diamonds_in_cart);
  const warehouses = useSelector(state => state.app.warehouses);  

  const [isExpanded, setIsExpanded] = useState(false);
  const [gemDisabled, setGemDisabled] = useState(true);
  const [gemLoaded, setGemLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(columns)

  let spotPrice = null;
  if (row.total) {
    spotPrice = ((parseFloat(row.total) * rates[currency.code]) * 10 / 10).toFixed(2)
  }

  let missingImage = false;
  if (!row["video_link"].includes("videos.gem360.in") && 
    !row["video_link"].includes("view.gem360.in") && 
    !row["video_link"].includes("loupe360.com") &&
    !row["video_link"].includes("viw-us.s3.amazonaws.com") && 
    !row["video_link"].includes("www.v360videos.com") &&
    !row["video_link"].includes("v360.diamonds") && 
    !row["video_link"].includes("diamond.blissvideos")) {
    missingImage = true;
  }
  console.log(spotPrice)

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

  const formatNumberWithSpaces = (number) => {
    const formatter = new Intl.NumberFormat('en-US');
    return formatter.format(number).replace(/,/g, ',');
  }

  const handleAddToCart = () => {
    if (diamonds_in_cart.some(item => item.id === row.id)) {
      dispatch(removeDiamondFromCart(row.id));
    } else {
      dispatch(addDiamondToCart(row));
    }
  }

  let videoLinkFormat = 
    row["video_link"].includes("view.gem360.in") ? "iframe-container-second" :
    row["video_link"].includes("videos.gem360.in") ? "iframe-container" :
    row["video_link"].includes("loupe360.com") ? "iframe-container-loupe" : 
    row["video_link"].includes("viw-us.s3.amazonaws.com") ? "iframe-container-viw": 
    row["video_link"].includes("www.v360videos.com") ? "iframe-container-view" : 
    row["video_link"].includes("v360.diamonds") ? "iframe-container-diamond" : 
    row["video_link"].includes("diamond.blissvideos") ? "third-iframe-container" : "hidden";

  var video_link = row["video_link"];
  if (row["video_link"].includes("diamond.blissvideos")) {
    video_link = `https://diamond.blissvideos.com/video.html?d=${row.id}&amp&z=1`;
  }
  // get warehoue by id in diamond object
  const warehouse = warehouses.find(warehouse => warehouse.id === row.warehouse_id);

  return (
    <>
      <tr className='flex-try'>
        {columns.map((column, colIndex) => (
          <td key={colIndex} className={`px-3 py-4 whitespace-nowrap text-text border-solid border-[1.5px] bg-black border-dark-grey ${column.field === "image" ? "align-middle text-center" : ""}`}>
            {
            column.field === "total" ? 
            <>
              {spotPrice ? <>
                <div className="flex flex-col">
                  <div className="flex"><p className='text-xs'>${formatNumberWithSpaces((row[column.field] / parseFloat(row.specifications.carat)).toFixed(2))}/ct</p></div>
                  <div className="flex"><p className='text-lg'>${formatNumberWithSpaces(parseFloat(row[column.field]).toFixed(2))}</p></div>
                  <div className="flex"><p>{formatNumberWithSpaces(spotPrice)} {currency.code}</p></div>
                </div>
              </> : <div className="flex flex-col">
                <div className="flex"><p className='text-lg'>N/A</p></div>
              </div>}
            </> : column.renderCell && column.field === "delivery" ?
            column.renderCell({ location: warehouse.country, from: warehouse.delivery_from, to: warehouse.delivery_to}) :
            column.renderCell ? 
            column.renderCell({ value: row[column.field], row: row }) : 
            row[column.field]
            }
          </td> 
        ))}
        <td className="px-3 py-4 w-1 whitespace-nowrap bg-black border-dark-grey">
          <button onClick={() => {handleExpand()}} className={`rounded-md w-6 h-6 duration-300 bg-black text-white`}>
            {isExpanded ? <ChevronUpIcon className='w-6 h-6'/> : <ChevronDownIcon className='w-6 h-6'/> }
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={1} className='bg-black'></td>
        <td colSpan={columns.length - 1} className={`
            border-0
          `}>
          <div className={`
            overflow-hidden border-none flex justify-between
            transition-max-height duration-500 ease-in-out pr-10
            ${isExpanded ? 'h-72' : 'h-0'}
          `}>
            <div className='flex flex-col items-center justify-top pt-4 pl-4'>
              <p className='font-bold text-primary'>Media</p>
              {!missingImage ?
              <div className={`${videoLinkFormat} ${gemLoaded ? 'block bg-accent' : 'hidden'}`}>
                {!gemDisabled ? 
                  <iframe src={video_link} onLoad={() => setGemLoaded(true)} className={`iframe-custom my-2`}></iframe> 
                : <div className='iframe-custom my-2 bg-text'></div>}
              </div> : 
              <img className='w-[164px] h-[148px] my-2' src="/assets/missing.png"/>}
              {gemLoaded || missingImage ? null : 
                <div className='iframe-container h-full flex items-center bg-white justify-center'><img className='w-5 h-5 text-white' src={loader}/></div>
              }
              {!missingImage && 
                <div onClick={() => navigator.clipboard.writeText(row["video_link"])} className="flex  cursor-pointer">
                  <div className="h-8 w-24 bg-text rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs font-semibold">Copy Video Link</p>
                  </div>
                </div>}
            </div>
            <div className='pt-4'>
              <p className='font-bold text-primary mb-2'>Information</p>
              <div className='mb-2'>
                <p className='text-primary'>{row.certificate}</p>
                <p className='font-semibold text-text flex'>
                  
                  {row.certificate === "IGI"  || row.certificate === "GIA" ? 
                  <>
                    <a 
                        className='text-text font-bold border-0 border-solid border-b-[1px]' 
                        target="_blank" 
                        rel="noreferrer" 
                        href={row.certificate === "IGI" ? `http://www.igi.org/verify.php?r=${row.cert_id}` : `https://diamond.blissvideos.com/?d=${row.id}`}
                    >
                        {row.cert_id}
                    </a>  
                    <ClipboardDocumentIcon 
                        className='w-5 h-5 text-text ml-2 mt-[1px] cursor-pointer'
                        onClick={() => {
                            if (row.certificate === "IGI") {
                                navigator.clipboard.writeText("http://www.igi.org/verify.php?r=" + row.cert_id);
                            } else if (row.certificate === "GIA") {
                                // Perform different action for GIA certificate
                                // For example: navigate to GIA website
                                window.open(`https://diamond.blissvideos.com/?d=${row.cert_id}`, "_blank");
                            }
                        }}  
                    />
                  </> : <>
                    <button className='text-text font-bold border-0 border-solid border-b-[1px] bg-black' onClick={() => downloadCertFile(row.cert_id)}>
                      {row.cert_id}
                    </button>    
                    <ArrowDownOnSquareStackIcon 
                      className='w-5 h-5 text-text ml-2 mt-[1px] cursor-pointer'
                      onClick={() => downloadCertFile(row.cert_id)}  
                    />
                  </>}
                </p>
              </div>
              <div className='mb-4'>
                <p className='text-primary'>Stock ID</p>
                <p className='font-semibold text-text'>{row.id}</p>
              </div>
              {/* <p className='mb-4 rounded-full border-solid border-[1.5px] border-dark-grey px-6 text-text'>Req. Shade</p>
              <p className='mb-2 rounded-full border-solid border-[1.5px] border-dark-grey px-6 text-text'>Req. Eye clean</p> */}
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Diamond Details</p>
              <div className='pb-2 text-text'>
                {/* {row.shape.toUpperCase()} {row.specifications.carat}ct {row.specifications.color} {row.specifications.clarity.toUpperCase()} {row.specifications.cut.toUpperCase()} {row.finish.polish.toUpperCase()} {row.finish.symmetry.toUpperCase()} {row.finish.fluorescence.toUpperCase()} */}
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
                  <p className='text-text'>{row.girdle}</p>
                </div>
              </div>

            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Delivery</p>
              {warehouse.delivery_from === "0" && warehouse.delivery_to === "0" ?
              <div className='text-text'>
                Not Available
                </div> :
              <div className="flex flex-col">
                <p className="text-primary">
                    Delivery Time:
                </p>
                <div className="flex mb-2">      
                  <p className="text-text">
                    {warehouse.delivery_from}
                  </p>
                  <p className="mx-2 text-text"> - </p>
                  <p className="text-text">
                    {warehouse.delivery_to}
                  </p>
                  <p className="ml-2 text-text">Days</p>
                </div>
                <div className='text-primary'>Location:</div>
                <div className='text-text'>
                  {warehouse.country}
                </div>
              </div>}
              
              {/* <p className='pb-2 text-text'>DELIVERY TYPE</p>
              <p className='pb-2 text-text'>DELIVERY TIME</p>
              <p className='pb-2 text-text'>RETURNABLE</p> */}
            </div>
            <div className='pt-4'>
              <p className='font-bold pb-2 text-primary'>Price</p>
              <p className='text-primary'>Total Price</p>
              <p className='text-text'>{row.total ? '$' + formatNumberWithSpaces(row.total) : 'N/A'}</p>
              <p className='text-text'>{row.total ? formatNumberWithSpaces(spotPrice) + " " + currency.code : 'N/A'}</p>
              <p className='text-primary pt-2'>Price Per Carat</p>
              <p className='text-text'>{row.total ? currency.symbol + " " + formatNumberWithSpaces((spotPrice / parseFloat(row.specifications.carat)).toFixed(2)) + '/ct' : 'N/A'}</p>
              <p className='text-text'></p>
              {row.diamond_type_id === 2 ? 
              <>
                <p className='text-primary pt-2'>Stock Amount</p>
                <p className='text-text'>{row.amount}</p>
              </> : null}
            </div>
            <div className='pt-4'>
              <p className='font-bold text-primary'>Actions</p>
              {row.diamond_type_id === 1 ?
              <button onClick={() => handleAddToCart()} className={`mt-4 h-7 w-32 rounded-md flex justify-center items-center text-white ${diamonds_in_cart.some(item => item.id === row.id) ? 'bg-red-400 border-solid border-accent' : 'bg-accent'}`}>{diamonds_in_cart.some(item => item.id === row.id) ? 'Remove from cart' : 'Add to cart'}</button>
              : 
              <div className='mt-4'>
                <p className='text-white font-semibold text-center'>Add to cart</p>
                <div>
                  <button className={`mt-2 h-7 w-32 rounded-md flex justify-center items-center text-white bg-accent`}>Request</button>
                </div>
              </div>}
              <button onClick={() => {navigate("/details/" + row["id"])}} className='mt-4 h-7 w-32 rounded-md border-solid border-[1.5px] flex justify-center items-center'>More details</button>

              {/* <div className='flex mt-4 justify-between'>
                <button className='group h-10 w-12 rounded-md border-solid border-[#e8413d]/30 border-[1.5px] flex justify-center items-center hover:border-[#e8413d]'>
                  <HeartIcon className='group-hover:text-[#e8413d] w-6 h-6 text-[#e8413d]/30'/>
                </button>
                <button className='group h-10 w-12 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black'>
                  <HandRaisedIcon className='group-hover:text-black w-6 h-6 text-grey'/>
                </button>
              </div> */}
            </div>
          </div>
        </td>
        <td colSpan={1} className='bg-black'></td>
      </tr>
    </>
  )
}