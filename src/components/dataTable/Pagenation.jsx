import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { ChevronRightIcon } from "@heroicons/react/20/solid"


export const Pagenation = ({ currentPage, setCurrentPage, lastPage }) => {


  return (
    <div className="w-60 h-10 px-4 shadow-lg border-solid border-[1px] flex justify-between items-center rounded-md">
      <ChevronLeftIcon className="w-7 h-7 text-dark-grey hover:bg-grey rounded-sm" />

      { currentPage !== 1 && (
        <>
          <button onClick={() => {setCurrentPage(currentPage - 1)}} className="w-7 h-7 text-dark-grey rounded-sm flex justify-center items-center hover:bg-grey">{ currentPage - 1 }</button>
        </>
      )}

      <button className="w-7 h-7 bg-navy-blue text-white rounded-sm flex justify-center items-center hover:bg-navy-blue/90">1</button>

      { !lastPage && (
        <>
          <button onClick={() => {setCurrentPage(currentPage + 1)}} className="w-7 h-7 text-dark-grey rounded-sm flex justify-center items-center hover:bg-grey">{ currentPage + 1 }</button>
        </>
      )}
      <ChevronRightIcon className="w-7 h-7 text-dark-grey hover:bg-grey rounded-sm" />
    </div>
  )
}