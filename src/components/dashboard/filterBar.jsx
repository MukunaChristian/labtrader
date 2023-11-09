import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { FilterDropdown } from "../dropdowns/filterDropdown"
import { BarsArrowUpIcon } from "@heroicons/react/20/solid"


export const FilterBar = ({ setIsFilterSideBarOpen, setCurrentRows, currentRows }) => {

  const sortPrice = () => {
    let sortedRows = [...currentRows];
    sortedRows.sort((a, b) => a.total > b.total ? 1 : -1);
    console.log(sortedRows)
    setCurrentRows(sortedRows);
  }

  return (
    <div className="flex flex-wrap p-4 pt-0">
      <button onClick={() => {setIsFilterSideBarOpen(true)}} className="flex bg-accent rounded-sm h-8 w-24 text-white justify-center items-center cursor-pointer hover:bg-light-blue">
        <AdjustmentsHorizontalIcon className="w-4 h-4 text-white mr-1" />
        <p>All Filters</p>
      </button>
      <div className="border border-solid border-[1.5px] h-8 rounded-sm ml-4 bg-white flex items-center">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-2" />
        <input className="w-64 h-full p-2 border-none focus:outline-none" type="text" placeholder='Enter certificate No or stock ID' />
      </div> 
      <div className="ml-4">
        <FilterDropdown />
      </div>
      <button onClick={() => sortPrice()} className="default-button ml-auto">
        <p>Price: low to high</p>
        <BarsArrowUpIcon className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}
  