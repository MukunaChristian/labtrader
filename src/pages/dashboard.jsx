import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Header } from "../components/dashboard/header"
import { FilterBar } from "../components/dashboard/filterBar"
import { FilterSideBar } from "../components/filterSideBar"
import { CustomDataTable } from "../components/dataTable/CustomDataTable"
import { diamonds } from '../api/diamonds';
import { setDiamondDataState, setLoadingDataState } from '../reducers/AppSlice';
import { useDispatch } from 'react-redux';


export const Dashboard = () => {
  const stateRows = useSelector(state => state.app.diamondData);
  const loading = useSelector(state => state.app.loadingData);
  const [isFilterSideBarOpen, setIsFilterSideBarOpen] = useState(false);
  const [currentRows, setCurrentRows] = useState(stateRows);
  const filters = useSelector(state => state.app.filters);
  const dispatch = useDispatch();


  useEffect(() => {
    setCurrentRows(stateRows)
  }, [stateRows])

  useEffect(() => {
    diamonds(dispatch, setDiamondDataState, setLoadingDataState);
  }, [])


  function filterList() {
    console.log(filters)
    return stateRows.filter(item => {
        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value) && value.length > 0 || (key === 'carat_range' && (value["from"] || value["to"]))) {
                // Handling nested properties
                let itemValue = item;
                console.log(key)

                if (key === "clarity") {
                  console.log("item: ", item)
                }
                

                if (['clarity', 'color', 'cut'].includes(key)) {
                    itemValue = item.specifications[key];
                } else if (['polish', 'symmetry', 'fluorescence', 'fluorescence_color'].includes(key)) {
                    itemValue = item.finish[key];
                } else if (key === 'carat_range') {
                    itemValue = item.specifications["carat"];
                } else {
                    itemValue = item[key];
                }

                if (!itemValue) {
                  console.log(`filter ${key} does not exist`)
                  return false;
                }


                if (key === "carat_range") {
                  if (!value["from"] || !value["to"]) {
                    return true;
                  }
                  if (value["from"] > itemValue || value["to"] < itemValue) {
                    return false;
                  } else {
                    return true
                  }
                }


                if (key === "color") {
                  console.log("Checking color")
                  // iterate through each color in the filter and check starts with
                  let colorMatch = false;
                  value.forEach(color => {
                    if (itemValue.toLowerCase().startsWith(color.toLowerCase())) {
                      colorMatch = true;
                      console.log("color: ", color, "itemValue: ", itemValue)
                    }
                  })
                  if (!colorMatch) {
                    return false;
                  } else {
                    return true
                  }
                }

                if (!value.includes(itemValue.toUpperCase()) && !value.includes(itemValue.toLowerCase())) {
                    return false; // Doesn't match this filter, so don't include in result
                }
            } else if (typeof value === 'boolean' && value) {
                if (!item[key]) {
                    return false; // Doesn't match this boolean filter, so don't include in result
                }
            }
        }
        return true; // Matches all filters
    });
  }


  useEffect(() => {
    const newData = filterList()
    setCurrentRows(newData)

  }, [filters])


  return (
    <div className="pb-4">
      <FilterSideBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} isFilterSideBarOpen={isFilterSideBarOpen} />
      <div className="border-0 pt-16 mx-6">
        <Header title='Lab Grown Diamonds' results={currentRows ? currentRows.length : 0} />
        <FilterBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} setCurrentRows={setCurrentRows} currentRows={currentRows} />
        {loading ? <div className="flex justify-center items-center h-96"><p className="border-solid border-[1.5px] p-2 rounded-lg animate-pulse bg-light-grey">Loading...</p></div> : <CustomDataTable currentRows={currentRows} />}
        
      </div>
    </div>
  )
}
