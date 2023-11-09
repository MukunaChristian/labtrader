import { useSelector } from "react-redux"
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../components/toUpperCase";
import { ChevronLeftIcon } from "@heroicons/react/20/solid"

import { DetailsGrid } from "../components/detailsComponents/DetailsGrid";
import loader from '../assets/loader.gif';


export const Details = () => {
  const diamonds = useSelector(state => state.app.diamondData)
  const currency = useSelector(state => state.app.currency);
  const location = useLocation();
  const navigate = useNavigate();

  const diamondID = location.pathname.split('/')[2];
  const [diamond, setDiamond] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  

  useEffect(() => {
    setDiamond(diamonds.find(diamond => diamond.id === diamondID))
  }, [diamonds])

  return (
    <div className="w-full pb-4">

      <div className="border-0 pt-28 h-full ml-6 mr-12">
        <div onClick={() => {navigate("/")}} className="flex text-text items-center ml-40 mb-2 pr-2 w-24 py-1 rounded-md bg-secondary hover:bg-light-grey cursor-pointer">
          <ChevronLeftIcon className="w-7 h-7 mr-2 rounded-sm" />
          <p className="h-5 mb-[3px]">Return</p>
        </div>
        <div className=" flex h-[full] w-[75%] mx-auto bg-secondary p-8 border-solid border-[1px] shadow-lg">
          {diamond && 
            <>
              <div className="w-[25%] py-2">
                <div className="bg-text pr-4 w-[94%]">
                  <div className={`${diamond["video_link"].includes("videos.gem360.in") ? 'iframe-container-second-details' : 'iframe-container-details'} border-none ${!isLoaded && "hidden"}`}>
                    <iframe src={diamond["video_link"]} onLoad={() => {setIsLoaded(true)}} className='iframe-custom my-2 border-none rounded-none'></iframe>
                  </div>
                </div>
                

                {!isLoaded &&
                  <div className={`${diamond["video_link"].includes("videos.gem360.in") ? 'iframe-container-second-details' : 'iframe-container-details'} border-none`}>
                    <div className='iframe-custom h-full my-2 bg-light-grey flex items-center justify-center'><img className='w-5 h-5' src={loader}/></div> :
                  </div>
                }
                <div className="flex mt-8">
                  <div className="h-8 w-24 bg-text rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    <p className="text-xs font-semibold">Copy Video Link</p>
                  </div>
                </div>
                <div className="flex">
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="w-[75%] py-2 text-sm">
                <div className='pb-2 font-bold text-xl text-primary'>
                  {capitalizeFirstLetter(diamond.shape)} {diamond.specifications.carat}ct {diamond.specifications.clarity} {diamond.specifications.cut.toUpperCase()} {diamond.finish.polish.toUpperCase()} {diamond.finish.symmetry.toUpperCase()} {capitalizeFirstLetter(diamond.finish.fluorescence)}
                </div>
                <div className="flex">
                  <div className="flex">
                    <p className="pr-2 text-primary">Cert ID IGI:</p>
                    <p className="text-dark-grey text-text">{diamond.cert_id}</p>
                  </div>
                  <div className="ml-4 flex">
                    <p className="pr-2 text-primary">Stock ID:</p>
                    <p className="font-bold text-text">{diamond.id}</p>
                  </div>  
                </div>
                <div className="flex mt-4 mb-2">
                  <div>
                    <p className='pb-1 text-text'>COMPANY</p>
                    <div className='flex items-center pb-2'>
                      <p className='font-semibold text-text'>LOCATION</p>
                    </div>
                    
                    <div className="flex">
                      <p className='pr-2 text-text'>DELIVERY TIME</p>
                      <p className='pb-1 text-text'>Returnable</p>
                    </div>
                    
                  </div>

                  <div className="ml-auto">
                    <p className='pb-2 text-primary   '>Total Price</p> 
                  </div>

                  <div className="w-32 text-right">
                    <p className="text-text">{diamond["total"]}</p>
                    <p className="text-text">{parseFloat(diamond["total"]) * currency.toOneUSD} {currency.code}</p>
                    <p className="text-text">${(parseFloat(diamond["total"]) / parseFloat(diamond.specifications.carat)).toFixed(2)}/ct</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="h-6 w-32 mr-2 text-xs rounded-md bg-text border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                    REQUEST EYESHADE
                  </div>

                  <div className="h-6 w-32 text-xs rounded-md bg-text border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
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