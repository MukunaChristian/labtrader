import { useSelector } from "react-redux"
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../components/toUpperCase";
import { ChevronLeftIcon } from "@heroicons/react/20/solid"

import { DetailsGrid } from "../components/detailsComponents/DetailsGrid";


export const Details = () => {
  const diamonds = useSelector(state => state.app.diamondData)
  const currency = useSelector(state => state.app.currency);
  const location = useLocation();
  const navigate = useNavigate();

  const diamondID = location.pathname.split('/')[2];
  const [diamond, setDiamond] = useState(null);

  

  useEffect(() => {
    setDiamond(diamonds.find(diamond => diamond.id === diamondID))
  }, [diamonds])

  return (
    <div className="w-full">

      <div className="border-0 pt-28 h-full mx-6">
        <div onClick={() => {navigate("/")}} className="flex items-center ml-40 mb-2 pr-2 w-24 py-1 rounded-md hover:bg-light-grey cursor-pointer">
          <ChevronLeftIcon className="w-7 h-7 mr-2 rounded-sm" />
          <p className="h-5 mb-[3px]">Return</p>
        </div>
        <div className=" flex h-[full] w-[75%] mx-auto p-8 border-solid border-[1.5px] shadow-lg">
          {diamond && 
            <>
              <div className="w-[25%] py-2">
                <div className='iframe-container-details border-none'>
                  <iframe src={diamond["video_link"]} className='iframe-custom my-2 border-none rounded-none'></iframe> 
                </div>
                <div className="flex mt-8">
                  <div className="h-8 w-24 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs font-semibold">Copy Video Link</p>
                  </div>
                </div>
                <div className="flex">
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="w-[75%] py-2 text-sm">
                <div className='pb-2 font-bold text-xl'>
                  {capitalizeFirstLetter(diamond.shape)} {diamond.specifications.carat}ct {diamond.specifications.clarity} {diamond.specifications.cut.toUpperCase()} {diamond.finish.polish.toUpperCase()} {diamond.finish.symmetry.toUpperCase()} {capitalizeFirstLetter(diamond.finish.fluorescence)}
                </div>
                <div className="flex">
                  <div className="flex">
                    <p className="pr-2">Cert ID IGI:</p>
                    <p className="text-dark-grey">{diamond.cert_id}</p>
                  </div>
                  <div className="ml-4 flex">
                    <p className="pr-2">Stock ID:</p>
                    <p className="font-bold">{diamond.id}</p>
                  </div>  
                </div>
                <div className="flex mt-4 mb-2">
                  <div>
                    <p className='pb-1'>COMPANY</p>
                    <div className='flex items-center pb-2'>
                      <p className='font-semibold'>LOCATION</p>
                    </div>
                    
                    <div className="flex">
                      <p className='pr-2'>DELIVERY TIME</p>
                      <p className='pb-1'>Returnable</p>
                    </div>
                    
                  </div>

                  <div className="ml-auto">
                    <p className='pb-2'>Total Price</p> 
                  </div>

                  <div className="w-32 text-right">
                    <p>{diamond["total"]}</p>
                    <p>{parseFloat(diamond["total"]) * currency.toOneUSD} {currency.code}</p>
                    <p>${(parseFloat(diamond["total"]) / parseFloat(diamond.specifications.carat)).toFixed(2)}/ct</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="h-6 w-32 mr-2 text-xs rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    REQUEST EYESHADE
                  </div>

                  <div className="h-6 w-32 text-xs rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    REQUEST EYE CLEAN
                  </div>
                </div>

                <DetailsGrid diamond={diamond}/>

                <div className="mt-6 flex justify-end">
                  <button className="h-8 px-2 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs">Copy Video Link</p>
                  </button>
                  <button className="h-8 ml-2 px-2 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs">Copy Video Link</p>
                  </button>
                  <button className="h-8 px-2 ml-2 rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs">Copy Video Link</p>
                  </button>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}