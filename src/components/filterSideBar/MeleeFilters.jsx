import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { setMeleeFiltersState, resetMeleeFiltersState } from "../../reducers/AppSlice";
import { useSelector, useDispatch } from "react-redux";

import { FieldGroups, FancyColorFields } from "./fieldGroups";
import { 
  meleeShapes as diamondShapes, 
  melee_carat_list as carat_list, 
  melee_color_list as color_list, 
  melee_cut_list as cut_list, 
  melee_clarity_list as clarity_list
} from "./filterLists";
import { filterTemplate, filterTemplateMelee } from "./filterTemplate"
import { filter } from "lodash";


export const MeleeFilterSideBar = ({ setIsFilterSideBarOpen, isFilterSideBarOpen }) => {
  const imageDir = 'assets/diamond-shapes-neg/';  
  const [filtersLocal, setFiltersLocal] = useState(filterTemplateMelee);
  const dispatch = useDispatch();

  console.log(filtersLocal)

  const globalFilters = useSelector(state => state.app.meleeFilters);

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
    dispatch(setMeleeFiltersState(filtersLocal))
  }

  const handleReset = () => {
    setFiltersLocal(filterTemplateMelee);
    dispatch(resetMeleeFiltersState())
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
          {diamondShapes.map((diamondShape) => (
            <div 
              key={diamondShape.id} 
              onClick={() => handleFilterChange("shape", diamondShape.name)} 
              className={`flex flex-col bg-white items-center justify-around border-solid border-[1.5px] h-24 ${filtersLocal["shape"].includes(diamondShape.name.toLowerCase()) ? "border-red-100" : ""}`}
            >
              <p className="text-xs w-[80%] text-center">{diamondShape.name}</p>
              <img 
                className="w-12 h-12" 
                src={`${imageDir}${diamondShape.imgSrc}`} 
                alt={`Image of ${diamondShape.name}`}
              />
            </div>
          ))}  
          </div>

        </div>

        <div className="pt-12">
          <p className="font-bold pb-2">Carat (ct)</p>
          <div className="flex">
            <FieldGroups 
              fieldGroups={carat_list} 
              fieldGroupName="carat" 
              selectedFieldGroup={filtersLocal["carat"]} 
              onFieldGroupSelect={handleFilterChange}  
            />   
          </div>    
        </div>

        <div className="pt-12">
          <div className="flex">
            <p className="font-bold mb-4">Color</p>
          </div>
          <FieldGroups 
            fieldGroups={color_list} 
            fieldGroupName="color" 
            selectedFieldGroup={filtersLocal["color"]} 
            onFieldGroupSelect={handleFilterChange} />
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

        <div className="fixed py-4 flex justify-end mt-4 bottom-0 w-[93vh] bg-white border-0 border-solid border-t-[1px]">
          <button onClick={() => {handleReset()}} className="default-button w-16 mr-2" >Reset</button>
          <button onClick={() => {setIsFilterSideBarOpen(false)}} className="default-button w-16" >Cancel</button>
          <button onClick={() => {onSave()}} className="default-save-button ml-2 w-16" >Apply</button>
        </div>
      </div>
    </div>
  )
}