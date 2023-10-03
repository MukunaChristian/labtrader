import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Header } from "../components/dashboard/header"
import { FilterBar } from "../components/dashboard/filterBar"
import { FilterSideBar } from "../components/filterSideBar"
import { CustomDataTable } from "../components/dataTable/CustomDataTable"
import diamondRows from "../data/output.json"



export const Dashboard = () => {
  const stateRows = useSelector(state => state.app.diamondData);
  console.log(stateRows)
  const [isFilterSideBarOpen, setIsFilterSideBarOpen] = useState(false);
  const [currentRows, setCurrentRows] = useState(stateRows);
  const filters = useSelector(state => state.app.filters);


  useEffect(() => {
    setCurrentRows(stateRows)
  }, [stateRows])


  function filterList() {
    return stateRows.filter(item => {
        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value) && value.length > 0) {
                // Handling nested properties
                let itemValue = item;

                if (['carat', 'clarity', 'color', 'cut'].includes(key)) {
                    itemValue = item.specifications[key];
                } else if (['polish', 'symmetry', 'fluorescence', 'fluorescence_color'].includes(key)) {
                    itemValue = item.finish[key];
                } else {
                    itemValue = item[key];
                }


                console.log('item', item)
                console.log('itemValue', itemValue)
                console.log('value', value)

                if (!value.includes(itemValue)) {
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
    <div>
      <FilterSideBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} isFilterSideBarOpen={isFilterSideBarOpen} />
      <div className="border-0 pt-16 mx-6">
        <Header title='Lab Grown Diamonds' results={99999} />
        <FilterBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} setCurrentRows={setCurrentRows} currentRows={currentRows} />
        <CustomDataTable currentRows={currentRows} />
      </div>
    </div>
  )
}
