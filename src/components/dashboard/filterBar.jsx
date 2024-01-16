import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { FilterDropdown } from "../Dropdowns/filterDropdown"
import { BarsArrowUpIcon } from "@heroicons/react/20/solid"
import { useState } from "react"
import { useApp } from "../../hooks/useApp"
import { useSelector } from "react-redux"


export const FilterBar = ({ setIsFilterSideBarOpen, setCurrentRows, currentRows }) => {
  const filters = useSelector(state => state.app.filters);
  const { setFilters } = useApp()
  const [upDown, setUpDown] = useState(null);

  const sortPrice = () => {

    if (upDown === "up" || upDown === null) {
      setFilters({...filters, sort_price: "desc"});
      setUpDown("down");
    } else {
      setFilters({...filters, sort_price: "asc"});
      setUpDown("up");
    }

    let sortedRows = [...currentRows];
  
    const compareFunction = (a, b) => {
      // Both values are undefined, consider them equal
      if (a.total === undefined && b.total === undefined) {
        return 0;
      }
      // a is undefined, b is not, a should be considered greater (to move to the end)
      if (a.total === undefined) {
        return 1;
      }
      // b is undefined, a is not, b should be considered greater
      if (b.total === undefined) {
        return -1;
      }
      // Normal comparison when both values are defined
      if (upDown === "down") {
        return a.total < b.total ? 1 : -1;
      } else {
        return a.total > b.total ? 1 : -1;
      }
    };
  
    sortedRows.sort(compareFunction);
  
    console.log(sortedRows)
    setCurrentRows(sortedRows);
  
    // Toggle the sorting direction
    if (upDown === "up" || upDown === null) {
      setUpDown("down");
    } else {
      setUpDown("up");
    }
  }

  const searchRows = (searchTerm) => {
    console.log(searchTerm)
    // set search id in filters

    setFilters({...filters, cert_id: searchTerm, stock_id: searchTerm});
  }

  return (
    <div className="flex flex-wrap p-4 pt-0">
      <button onClick={() => {setIsFilterSideBarOpen(true)}} className="flex bg-accent rounded-lg h-8 w-24 text-white justify-center items-center cursor-pointer">
        <AdjustmentsHorizontalIcon className="w-4 h-4 text-white mr-1" />
        <p>All Filters</p>
      </button>
      <div className="border border-solid border-black h-8 rounded-lg ml-4 bg-white flex items-center">
        <MagnifyingGlassIcon className="w-5 h-5 text-black ml-2" />
        <input onChange={(e) => searchRows(String(e.target.value))} value={filters['cert_id']} className="w-64 h-full p-2 border-none focus:outline-none" type="text" placeholder='Enter certificate No or stock ID' />
      </div> 
      <button onClick={() => sortPrice()} className="default-button ml-auto bg-accent text-white rounded-lg">
        <p>Price: low to high</p>
        <BarsArrowUpIcon className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}
  