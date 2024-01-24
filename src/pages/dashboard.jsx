import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { Header } from "../components/dashboard/header.jsx"
import { FilterBar } from "../components/dashboard/filterBar.jsx"
import { FilterSideBar } from "../components/filterSideBar"
import { MeleeFilterSideBar } from "../components/FilterSideBar/MeleeFilters.jsx"
import { CustomDataTable } from "../components/dataTable/CustomDataTable.jsx"


export const Dashboard = () => {
  const stateRows = useSelector(state => state.app.diamondData);
  const diamondAmount = useSelector(state => state.app.diamondAmount);
  const diamondType = useSelector(state => state.app.diamond_type);
  const [isFilterSideBarOpen, setIsFilterSideBarOpen] = useState(false);
  const [currentRows, setCurrentRows] = useState(stateRows);

  let current_title = '';
  if (diamondType === "diamond") {
    current_title = 'Lab Grown Diamonds';
  } else if (diamondType === "melee") {
    current_title = 'Lab Grown Melee';
  }


  useEffect(() => {
    setCurrentRows(stateRows)
  }, [stateRows])


  return (
    <div className="pb-4 bg-light-grey">
      {diamondType === "diamond" ?
        <FilterSideBar 
            setIsFilterSideBarOpen={setIsFilterSideBarOpen} 
            isFilterSideBarOpen={isFilterSideBarOpen} 
        /> : 
        <MeleeFilterSideBar 
            setIsFilterSideBarOpen={setIsFilterSideBarOpen} 
            isFilterSideBarOpen={isFilterSideBarOpen}
        />}
      <div className="border-0 mx-6">
        <Header title={current_title} results={diamondAmount} />
        <FilterBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} setCurrentRows={setCurrentRows} currentRows={currentRows} />
        <CustomDataTable currentRows={currentRows} diamondsType={diamondType}/>
            
      </div>
    </div>
  )
}
