import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";

import { FieldGroups, FancyColorFields } from "./fieldGroups";
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
import { filterTemplate } from "./filterTemplate"

import { useApp } from "../../hooks/useApp"

export const FilterSideBar = ({ setIsFilterSideBarOpen, isFilterSideBarOpen }) => {
  const [showMore, setShowMore] = useState(false);
  const [whiteFancy, setWhiteFancy] = useState("white");

  const imageDir = 'assets/diamond-shapes-neg/';  
  const [filtersLocal, setFiltersLocal] = useState(filterTemplate);

  const { setFilters, resetFilters } = useApp()

  const globalFilters = useSelector(state => state.app.filters);

  useEffect(() => {
    setFiltersLocal(globalFilters)
  }, [])

  const handleFilterChange = (filterName, filterItemInp) => {
    const filterItem = filterItemInp.toLowerCase();

    console.log(filterName, filterItem)

    if (filterName === "fancyColor") {
      const newFilters = { ...filtersLocal };
      if (newFilters["color"].includes(filterItem)) {
        newFilters["color"] = newFilters["color"].filter((item) => item !== filterItem);
      } else {
        newFilters["color"] = [ ...newFilters["color"], filterItem]
      }
      setFiltersLocal(newFilters);
      return  
    }

    if (typeof filterItem === 'string') {
      const newFilters = { ...filtersLocal };
      console.log(newFilters[filterName])
      if (newFilters[filterName].includes(filterItem)) {
        newFilters[filterName] = newFilters[filterName].filter((item) => item !== filterItem);
      } else {
        newFilters[filterName] = [ ...newFilters[filterName], filterItem]
      }
      setFiltersLocal(newFilters);
    } else {
      // if filter is boolean
      console.log(filterName)
      const newFilters = { ...filtersLocal };
      newFilters[filterName] = !newFilters[filterName];
      setFiltersLocal(newFilters);
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
    setFilters(filtersLocal)
  }

  const handleReset = () => {
    setFiltersLocal(filterTemplate);
    resetFilters()
  }

  // Triggered if min or max is changed
  // validate if min is less than max and vice versa
  // also validate if min and max are numbers or float
  const handleCaratInput = (event) => {
    const { name, value } = event.target;
    console.log(name, value)

    if (value.isInteger) {
      console.log("not a number or float")
      return
    }

    if (filtersLocal["carat_range"]["from"] === 0 && filtersLocal["carat_range"]["to"] === 0) {
      console.log("both are 0")
      const newFilters = { ...filtersLocal };
      newFilters["carat_range"]["from"] = value;
      newFilters["carat_range"]["to"] = value;
      setFiltersLocal(newFilters);
    }

    if (name === "min") {
      let newFilters = { ...filtersLocal, carat_range: { ...filtersLocal["carat_range"], from: value } };
      setFiltersLocal(newFilters);
    } else {
      let newFilters = { ...filtersLocal, carat_range: { ...filtersLocal["carat_range"], to: value } };
      setFiltersLocal(newFilters);
    }
  }


  const checkIfCaratInRange = (carat) => {
    if (carat.endsWith("ct")) {
      carat = carat.slice(0, -2)
    } else if (carat.endsWith("s")) {
      carat = carat.slice(0, -1) / 100
    } else if (carat.endsWith("ct+")) {
      carat = carat.slice(0, -3)
    }

    // if only "to" or "from" is set check if value is exactly equal to "to" or "from"
    if (filtersLocal["carat_range"]["from"] && !filtersLocal["carat_range"]["to"]) {
      if (carat === filtersLocal["carat_range"]["to"]) {
        return true
      } else {
        return false
      }
    } else if (!filtersLocal["carat_range"]["from"] && filtersLocal["carat_range"]["to"]) {
      if (carat === filtersLocal["carat_range"]["from"]) {
        return true
      } else {
        return false
      }
    }

    if (carat >= filtersLocal["carat_range"]["from"] && carat <= filtersLocal["carat_range"]["to"]) {
      return true
    } else {  
      return false
    }
  }


  return (
    <div>
      <div onClick={() => {setIsFilterSideBarOpen(false)}} className={`fixed h-full top-0 left-0 w-full z-40 bg-dark-grey/40 duration-500 cursor-pointer ${isFilterSideBarOpen ? "block" : "hidden"}`}></div>
      <div className={`flex flex-col fixed h-[100%] w-[100vh] overflow-auto z-50 py-20 px-4 bg-white shadow-2xl duration-300 top-0 ${isFilterSideBarOpen ? "left-0" : "left-[-100%]"}`}>
        <div className="fixed flex py-4 w-[93vh] top-0 border-0 border-solid border-b-[1px] bg-white">
          <p className="font-bold">Filters</p>
          <XMarkIcon onClick={() => {setIsFilterSideBarOpen(false)}} className="w-6 h-6 text-dark-grey hover:text-navy-blue ml-auto cursor-pointer" />
        </div>


        <div>
          <p className="font-bold pt-4 pb-4">Shape</p>
          <div className="grid grid-cols-4 gap-4">
            {showMore ? 
            diamondShapes.map((diamondShape) => (
              <div key={diamondShape.id} onClick={() => {handleFilterChange("shape", diamondShape.name)}} className={`flex flex-col bg-white items-center justify-around border-solid border-[1.5px] h-24 ${filtersLocal["shape"].includes(diamondShape.name.toLowerCase()) && "border-red-100"}`}>
                <p className="text-xs w-[80%] text-center">{diamondShape.name}</p>
                <img className="w-12 h-12" src={imageDir + diamondShape.imgSrc}/>
              </div>
            )) : 
            diamondShapes.slice(0, 16).map((diamondShape) => (
              <div key={diamondShape.id} onClick={() => {handleFilterChange("shape", diamondShape.name)}} className={`flex flex-col bg-white items-center justify-around border-solid border-[2px] h-24 ${filtersLocal["shape"].includes(diamondShape.name.toLowerCase()) && "border-primary"}`}>
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
                  <input name="min" className="w-24 p-1 rounded-md" onChange={handleCaratInput} value={filtersLocal["carat_range"]["from"] ? filtersLocal["carat_range"]["from"] : ""}/>
                  <p className="text-xs text-dark-grey px-2">ct</p>
                </div>
                
              </div>

              <div className="ml-2">
                <label className="text-xs">Max</label>
                <div className="flex border-solid border-[1.5px] rounded-md">
                  <input name="max" className="w-24 p-1 rounded-md" onChange={handleCaratInput} value={filtersLocal["carat_range"]["to"] ? filtersLocal["carat_range"]["to"] : ""}/>
                  <p className="text-xs text-dark-grey px-2">ct</p>
                </div>
              </div>
            </div>  

            <div className="flex flex-wrap ml-8">
              {carat_list.map((carat) => (
                <div key={carat} className={`default-filter-button w-12 ${checkIfCaratInRange(carat) && 'bg-dark-grey'}`}>{carat}</div>
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
          {whiteFancy === "white" ? (
          <FieldGroups 
            fieldGroups={color_list} 
            fieldGroupName="color" 
            selectedFieldGroup={filtersLocal["color"]} 
            onFieldGroupSelect={handleFilterChange} /> ) : (
          <FancyColorFields selectedFieldGroup={filtersLocal["color"]} onFieldGroupSelect={handleFilterChange} />
            )} 
        </div>

        <div className="flex">
          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Clarity</p>
            <FieldGroups 
              fieldGroups={clarity_list} 
              fieldGroupName="clarity" 
              selectedFieldGroup={filtersLocal["clarity"]} 
              onFieldGroupSelect={handleFilterChange}  
            />   
          </div>

          <div className="pt-12 w-[50%] ">
            <p className="font-bold pb-2">Cut</p>
            <FieldGroups 
              fieldGroups={cut_list} 
              fieldGroupName="cut" 
              selectedFieldGroup={filtersLocal["cut"]} 
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
              selectedFieldGroup={filtersLocal["polish"]} 
              onFieldGroupSelect={handleFilterChange}  />    
          </div>

          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Symmetry</p>
            <FieldGroups 
              fieldGroups={polish_symmetry_list} 
              fieldGroupName="symmetry" 
              selectedFieldGroup={filtersLocal["symmetry"]} 
              onFieldGroupSelect={handleFilterChange}  />   
          </div>
        </div>

        <div className="flex">
          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Fluorescence</p>
            <FieldGroups 
              fieldGroups={fluorescence_list} 
              fieldGroupName="fluorescence" 
              selectedFieldGroup={filtersLocal["fluorescence"]} 
              onFieldGroupSelect={handleFilterChange}  />    
          </div>

          <div className="pt-12 w-[50%]">
            <p className="font-bold pb-2">Fluorescence Color</p>
            <FieldGroups 
              fieldGroups={fluorescence_color_list} 
              fieldGroupName="fluorescence_color" 
              selectedFieldGroup={filtersLocal["fluorescence_color"]} 
              onFieldGroupSelect={handleFilterChange} 
            />   
          </div>
        </div>

        <div className="fixed py-4 flex justify-end mt-4 bottom-0 w-[93vh] bg-white border-0 border-solid border-t-[1px]">
          <button onClick={() => {handleReset()}} className="default-button w-16 mr-2" >Reset</button>
          <button onClick={() => {setIsFilterSideBarOpen(false)}} className="default-button w-16" >Cancel</button>
          <button onClick={() => {onSave()}} className="default-save-button ml-2 w-16" >Apply</button>
        </div>
      </div>
    </div>
  )
}