import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

export const FilterSideBar = ({ setIsFilterSideBarOpen, isFilterSideBarOpen }) => {
  const [showMore, setShowMore] = useState(false);

  const imageDir = 'src/assets/diamond-shapes/';

  const diamondShapes = [
    { id: 1, name: 'Round', imgSrc: 'round.png' },
    { id: 2, name: 'Princess', imgSrc: 'princess.png' },
    { id: 3, name: 'Emerald', imgSrc: 'emerald.png' },
    { id: 4, name: 'Sq. emerald', imgSrc: 'square-emerald.jpg' },
    { id: 5, name: 'Asscher', imgSrc: 'asscher.png' },
    { id: 6, name: 'Cushion', imgSrc: 'cushion.png' },
    { id: 7, name: 'Cushion bril modified', imgSrc: 'cushion.png' },
    { id: 8, name: 'Radiant', imgSrc: 'radiant.png' },
    { id: 9, name: 'Sq. radiant', imgSrc: 'radiant.png' },
    { id: 10, name: 'Pear', imgSrc: 'pear.png' },
    { id: 11, name: 'Oval', imgSrc: 'oval.jpg' },
    { id: 12, name: 'Marquise', imgSrc: 'marquise.png' },
    { id: 13, name: 'Heart', imgSrc: 'heart.png' },
    { id: 14, name: 'Old miner', imgSrc: 'old-miner.png' },
    { id: 15, name: 'Star', imgSrc: 'diamond.png' },
    { id: 16, name: 'Rose', imgSrc: 'diamond.png' },
    { id: 17, name: 'Trilliant', imgSrc: 'diamond.png' },
    { id: 18, name: 'Baguette', imgSrc: 'diamond.png' },
    { id: 19, name: 'Taper', imgSrc: 'diamond.png' },
    { id: 20, name: 'Half Moon', imgSrc: 'diamond.png' },
    { id: 21, name: 'Kite', imgSrc: 'diamond.png' },
    { id: 22, name: 'Shield', imgSrc: 'diamond.png' }
  ]

  const handleEsc = (event) => {
    if (event.keyCode === 27) {
      setIsFilterSideBarOpen(false);``
    }
  }
  document.addEventListener('keydown', handleEsc)


  const onSave = () => {
    setIsFilterSideBarOpen(false);
  }


  return (
    <div>
      <div onClick={() => {setIsFilterSideBarOpen(false)}} className={`fixed h-full w-full z-40 bg-dark-grey/20 duration-500 ${isFilterSideBarOpen ? "block" : "hidden"}`}></div>
      <div className={`flex flex-col fixed h-[100%] w-[100vh] overflow-auto z-50 p-4 bg-white shadow-2xl duration-300 top-0 ${isFilterSideBarOpen ? "left-0" : "left-[-100%]"}`}>
        <div className="flex border-solid border-0 border-b-[1.5px] pb-4">
          <p className="font-bold">Filters</p>
          <XMarkIcon onClick={() => {setIsFilterSideBarOpen(false)}} className="w-6 h-6 text-dark-grey hover:text-navy-blue ml-auto cursor-pointer" />
        </div>
        <div className="flex justify-between border-solid border-0 border-b-[1.5px] pt-4 pb-10">
          <div className="w-1/4">
            <p className="font-bold pb-2">Delivery time</p>
            <div className="flex flex-wrap">
              <div className="default-button mr-2 my-2">5d or less</div>
              <div className="default-button mr-2 my-2">8d or less</div>
            </div>
          </div>
          <div className="w-1/3">
            <p className="font-bold pb-2">Certificate</p>
            <div className="flex flex-wrap">
              <div className="default-filter-button">GIA</div>
              <div className="default-filter-button">IGI</div>
              <div className="default-filter-button">HRD</div>
              <div className="default-filter-button">GCAL</div>
              <div className="default-filter-button">EGL</div>
              <div className="default-filter-button">IIDGR</div>
              <div className="default-filter-button">GSI</div>
              <div className="default-filter-button">SGL</div>
              <div className="default-filter-button">Supplier-cert</div>
              <div className="default-filter-button">Non-cert</div>
            </div>
          </div>
          <div className="w-1/3">
            <p className="font-bold pb-4">Show/Hide Results</p>
            <div className="flex pb-2">
              <input type="checkbox"/>
              <label className="ml-2 text-sm">Show only image</label>
            </div>
            <div className="flex pb-2">
              <input type="checkbox"/>
              <label className="ml-2 text-sm">Show only video</label>
            </div>
            <div className="flex pb-2">
              <input type="checkbox"/>
              <label className="ml-2 text-sm">Show only returnable</label>
            </div>
            <div className="flex pb-2">
              <input type="checkbox"/>
              <label className="ml-2 text-sm">Show only available for immediate purchase</label>
            </div>
            
          </div>
        </div>

        <div>
          <p className="font-bold pt-4 pb-4">Shape</p>
          <div className="grid grid-cols-4 gap-4">
            {showMore ? 
            diamondShapes.map((diamondShape) => (
              <div key={diamondShape.id} className="flex flex-col items-center justify-around border-solid border-[1.5px] h-24">
                <p className="text-xs w-[80%] text-center">{diamondShape.name}</p>
                <img className="w-12 h-12" src={imageDir + diamondShape.imgSrc}/>
              </div>
            )) : 
            diamondShapes.slice(0, 16).map((diamondShape) => (
              <div key={diamondShape.id} className="flex flex-col items-center justify-around border-solid border-[1.5px] h-24">
                <p className="text-xs w-[80%] text-center">{diamondShape.name}</p>
                <img className="w-12 h-12" src={imageDir + diamondShape.imgSrc}/>
              </div>
            ))}

            
          </div>
          {!showMore ? (
            <div onClick={() => {setShowMore(true)}} className="flex items-center justify-center mt-4">
              <p className="text-sm">Show more</p>
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </div>
          ) : (
            <div onClick={() => {setShowMore(false)}} className="flex items-center justify-center mt-4">
              <p className="text-sm font-bold">Show less</p>
              <ChevronUpIcon className="w-4 h-4 ml-1" />
            </div>
          )}

        </div>

        <div className="flex mt-4 ml-auto">
          <button onClick={() => {setIsFilterSideBarOpen(false)}} className="default-button w-16" >Cancel</button>
          <button onClick={() => {onSave()}} className="default-save-button ml-2 w-16" >Apply</button>
        </div>
      </div>
    </div>
  )
}