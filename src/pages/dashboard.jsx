import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Header } from "../components/dashboard/header"
import { FilterBar } from "../components/dashboard/filterBar"
import { FilterSideBar } from "../components/filterSideBar"
import { CustomDataTable } from "../components/dataTable/CustomDataTable"
import { diamonds } from '../api/diamonds';
import { setDiamondDataState, setLoadingDataState, setCurrencyRateState, setWarehousesState } from '../reducers/AppSlice';
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
    diamonds(dispatch, setDiamondDataState, setLoadingDataState, setCurrencyRateState, setWarehousesState);
  }, [])




  function filterList() {
    return stateRows.filter(item => {
        for (const [key, value] of Object.entries(filters)) {  
            // Skip if the filter value is empty (empty array, empty string, or null)
            if (Array.isArray(value) && value.length === 0 || value === '' || value === null) {
                continue;
            }

            let itemValue = item; // Default item value

            // Determine the itemValue based on the key
            if (['clarity', 'color', 'cut'].includes(key)) {
                itemValue = item.specifications[key];
            } else if (['polish', 'symmetry', 'fluorescence', 'fluorescence_color'].includes(key)) {
                itemValue = item.finish[key];
            } else if (key === 'carat_range') {
                itemValue = item.specifications["carat"];
            } else {
                itemValue = item[key];
            }

            // If the itemValue is missing, skip this filter
            if (!itemValue) {
                continue;
            }

            // Logic for handling different filter types
            if (key === "carat_range") {
                if (itemValue < value["from"] || itemValue > value["to"]) {
                    return false;
                }
            } else if (key === "color") {
                let colorMatch = value.some(color => itemValue.toLowerCase().startsWith(color.toLowerCase()));
                if (!colorMatch) {
                    return false;
                }
            } else if (Array.isArray(value)) {
                if (!value.includes(itemValue.toUpperCase()) && !value.includes(itemValue.toLowerCase())) {
                    return false;
                }
            } else if (typeof value === 'boolean') {
                if (!item[key]) {
                    return false;
                }
            } else if (typeof value === 'string') {
                if (!String(item[key]).toLowerCase().includes(value.toLowerCase())) {
                    return false;
                }
            }
        }
        return true; // If none of the filters rejected the item, include it
    });
}


  useEffect(() => {
    const newData = filterList()
    console.log(newData)
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
