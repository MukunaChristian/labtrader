import { useState } from "react"

import { Header } from "../components/dashboard/header"
import { FilterBar } from "../components/dashboard/filterBar"
import { FilterSideBar } from "../components/filterSideBar"
import { DataTable } from "../components/dataTable/DataTable"
import { CustomDataTable } from "../components/dataTable/CustomDataTable"


export const Dashboard = () => {
  const [isFilterSideBarOpen, setIsFilterSideBarOpen] = useState(false);

  return (
    <div>
      <FilterSideBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} isFilterSideBarOpen={isFilterSideBarOpen} />
      <div className="border-0 border-b-[1.5px] border-solid pt-16 mx-6">
        <Header title='Lab Grown Diamonds' results={99999} />
        <FilterBar setIsFilterSideBarOpen={setIsFilterSideBarOpen} />
        <CustomDataTable />
      </div>
    </div>
  )
}
