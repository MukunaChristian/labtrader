import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

import { FieldGroups } from "./fieldGroups";
import { 
  diamondShapes, 
  carat_list, 
  color_list, 
  cut_list, 
  clarity_list, 
  polish_symmetry_list,
  fluorescence_list,
  fluorescence_color_list,
  certificate_list
} from "./filterLists";

export const FilterSideBar = ({ setIsFilterSideBarOpen, isFilterSideBarOpen }) => {
  const [showMore, setShowMore] = useState(false);
  const [whiteFancy, setWhiteFancy] = useState("white");

  const imageDir = 'src/assets/diamond-shapes/';
  const filtersGlobal = useSelector((state) => state.app.filters);
  
  const [filters, setFilters] = useState(filtersGlobal);

  const handleFilterChange = (filterName, filterItem) => {
    if (typeof filterItem === 'string') {
      const newFilters = { ...filters };
      console.log(newFilters[filterName])
      if (newFilters[filterName].includes(filterItem)) {
        newFilters[filterName] = newFilters[filterName].filter((item) => item !== filterItem);
      } else {
        newFilters[filterName] = [ ...newFilters[filterName], filterItem]
      }
      setFilters(newFilters);
    } else {
      // if filter is boolean
      console.log(filterName)
      const newFilters = { ...filters };
      newFilters[filterName] = !newFilters[filterName];
      setFilters(newFilters);
    }
  }

  const handleEsc = (event) => {
    if (event.keyCode === 27) {
      setIsFilterSideBarOpen(false);``
    }
  }
  document.addEventListener('keydown', handleEsc)


  const onSave = () => {
    setIsFilterSideBarOpen(false);
  }

  const resetFilters = () => {
    setIsFilterSideBarOpen(false);
  }


  return (
    <div>
      <div onClick={() => {setIsFilterSideBarOpen(false)}} className={`fixed h-full w-full z-40 bg-dark-grey/20 duration-500 ${isFilterSideBarOpen ? "block" : "hidden"}`}></div>
      <div className={`flex flex-col fixed h-[100%] w-[100vh] overflow-auto z-50 py-20 px-4 bg-white shadow-2xl duration-300 top-0 ${isFilterSideBarOpen ? "left-0" : "left-[-100%]"}`}>
        <div className="fixed bg-white flex py-4 w-[93vh] top-0">
          <p className="font-bold">Filters</p>
          <XMarkIcon onClick={() => {setIsFilterSideBarOpen(false)}} className="w-6 h-6 text-dark-grey hover:text-navy-blue ml-auto cursor-pointer" />
        </div>
        <div className="flex justify-between border-solid border-0 border-b-[1.5px] pb-12">
          <div className="w-1/4">
            <p className="font-bold pb-2">Delivery time</p>
            <FieldGroups 
              fieldGroups={["5d or less", "8d or less", "10d or less", "15d or less"]} 
              fieldGroupName="delivery_time" 
              selectedFieldGroup={filters["delivery_time"]} 
              onFieldGroupSelect={handleFilterChange}  
            /> 
          </div>
          <div className="w-1/3">
            <p className="font-bold pb-2">Certificate</p>
            <FieldGroups 
              fieldGroups={certificate_list} 
              fieldGroupName="certificate" 
              selectedFieldGroup={filters["certificate"]} 
              onFieldGroupSelect={handleFilterChange}  
            /> 
          </div>
          <div className="w-1/3">
            <p className="font-bold pb-4">Show/Hide Results</p>
            <div className="flex pb-2">
              <input onClick={() => handleFilterChange("show_only_image")} type="checkbox"/>
              <label className="ml-2 text-sm">Show only image</label>
            </div>
            <div className="flex pb-2">
              <input onClick={() => handleFilterChange("show_only_video")} type="checkbox"/>
              <label className="ml-2 text-sm">Show only video</label>
            </div>
            <div className="flex pb-2">
              <input onClick={() => handleFilterChange("show_only_returnable")} type="checkbox"/>
              <label className="ml-2 text-sm">Show only returnable</label>
            </div>
            <div className="flex pb-2">
              <input onClick={() => handleFilterChange("show_only_immediate_purchase")} type="checkbox"/>
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

        <div className="pt-12">
          <p className="font-bold pb-2">Carat (ct)</p>
          <div className="flex">
            <div className="flex">
              <div>
                <label className="text-xs">Min</label>
                <div className="flex border-solid border-[1.5px] rounded-md">
                  <input className="w-24 p-1 rounded-md" />
                  <p className="text-xs text-dark-grey px-2">ct</p>
                </div>
                
              </div>

              <div className="ml-2">
                <label className="text-xs">Max</label>
                <div className="flex border-solid border-[1.5px] rounded-md">
                  <input className="w-24 p-1 rounded-md" />
                  <p className="text-xs text-dark-grey px-2">ct</p>
                </div>
              </div>
            </div>  

            <div className="flex flex-wrap ml-8">
              {carat_list.map((carat) => (
                <div key={carat} className="default-filter-button w-12">{carat}</div>
              ))}
            </div>
          </div>    
        </div>

        <div className="pt-12">
          <div className="flex">
            <p className="font-bold mb-4">Color</p>
            <div className="flex items-center h-8 border-solid border-[1.5px] rounded-lg ml-auto mr-4">
              <button 
                className={`
                  text-xs px-2 h-full flex items-center rounded-l-lg 
                  ${whiteFancy === "white" && 'default-button-focus'}
                `}
                onClick={() => {setWhiteFancy("white")}}
              >White</button>
              <button 
                className={`
                  text-xs px-2 h-full flex items-center rounded-r-lg 
                  ${whiteFancy === "fancy" && 'default-button-focus'}
                `}
                onClick={() => {setWhiteFancy("fancy")}}
              >Fancy</button>
            </div>
          </div>
          <FieldGroups 
            fieldGroups={color_list} 
            fieldGroupName="color" 
            selectedFieldGroup={filters["color"]} 
            onFieldGroupSelect={handleFilterChange} />  
        </div>

        <div className="flex">
          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Clarity</p>
            <FieldGroups 
              fieldGroups={clarity_list} 
              fieldGroupName="clarity" 
              selectedFieldGroup={filters["clarity"]} 
              onFieldGroupSelect={handleFilterChange}  
            />   
          </div>

          <div className="pt-12 w-[50%] ">
            <p className="font-bold pb-2">Cut</p>
            <FieldGroups 
              fieldGroups={cut_list} 
              fieldGroupName="cut" 
              selectedFieldGroup={filters["cut"]} 
              onFieldGroupSelect={handleFilterChange}  
            />   
          </div>
        </div>
        
        <div className="flex">
          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Polish</p>
            <FieldGroups 
              fieldGroups={polish_symmetry_list} 
              fieldGroupName="polish" 
              selectedFieldGroup={filters["polish"]} 
              onFieldGroupSelect={handleFilterChange}  />    
          </div>

          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Symmetry</p>
            <FieldGroups 
              fieldGroups={polish_symmetry_list} 
              fieldGroupName="symmetry" 
              selectedFieldGroup={filters["symmetry"]} 
              onFieldGroupSelect={handleFilterChange}  />   
          </div>
        </div>

        <div className="flex">
          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Fluorescence</p>
            <FieldGroups 
              fieldGroups={fluorescence_list} 
              fieldGroupName="fluorescence" 
              selectedFieldGroup={filters["fluorescence"]} 
              onFieldGroupSelect={handleFilterChange}  />    
          </div>

          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Fluorescence Color</p>
            <FieldGroups 
              fieldGroups={fluorescence_color_list} 
              fieldGroupName="fluorescence_color" 
              selectedFieldGroup={filters["fluorescence_color"]} 
              onFieldGroupSelect={handleFilterChange} 
            />   
          </div>
        </div>

        <div className="pt-12 w-[50%]">
          <p className="font-bold pb-2">Eye clean</p>
          <FieldGroups 
            fieldGroups={["Yes", "No", "Borderline"]} 
            fieldGroupName="eye_clean" 
            selectedFieldGroup={filters["eye_clean"]} 
            onFieldGroupSelect={handleFilterChange} 
          />  
        </div>

        <div className="flex pb-2">
          <input onClick={() => handleFilterChange("with_unknown_eye_clean")} type="checkbox"/>
          <label className="ml-2 text-sm">Allow unknown eye clean</label>
        </div>

        <div className="pt-12 w-[50%]">
          <p className="font-bold pb-2">Shade and Luster</p>
          <div className="flex pb-2">
            <input onClick={() => handleFilterChange("no_bgm")} type="checkbox"/>
            <label className="ml-2 text-sm">No BGM</label>
          </div>
          <div className="flex pb-2">
            <input onClick={() => handleFilterChange("with_unknown_shade")} type="checkbox"/>
            <label className="ml-2 text-sm">Allow unknown shade</label>
          </div>
          <div className="flex pb-2">
            <input onClick={() => handleFilterChange("with_unknown_luster")} type="checkbox"/>
            <label className="ml-2 text-sm">Allow unknown luster</label>
          </div>
        </div>
      

        <div className="fixed py-4 flex justify-end mt-4 bottom-0 w-[93vh] bg-white">
          <button onClick={() => {resetFilters()}} className="default-button w-16 mr-2" >Reset</button>
          <button onClick={() => {setIsFilterSideBarOpen(false)}} className="default-button w-16" >Cancel</button>
          <button onClick={() => {onSave()}} className="default-save-button ml-2 w-16" >Apply</button>
        </div>
      </div>
    </div>
  )
}