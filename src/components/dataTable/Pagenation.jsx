import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { ChevronRightIcon } from "@heroicons/react/20/solid"


export const Pagenation = ({ currentPage, setCurrentPage, lastPage }) => {


  return (
    <div className="w-60 h-10 px-4 bg-white border-solid border-[1.5px] border-dark-grey flex justify-between items-center rounded-md">
      { currentPage === 1 ? <ChevronLeftIcon className="w-7 h-7 text-grey rounded-sm" />
      : <ChevronLeftIcon onClick={() => {setCurrentPage(currentPage - 1)}} className="w-7 h-7 text-dark-grey hover:bg-grey rounded-sm" />}

      { currentPage !== 1 && (
        <>
          <button onClick={() => {setCurrentPage(currentPage - 1)}} className="w-7 h-7 text-dark-grey rounded-sm flex justify-center items-center hover:bg-grey">{ currentPage - 1 }</button>
        </>
      )}

      <button className="w-7 h-7 text-white rounded-sm flex justify-center items-center bg-accent ">{currentPage}</button>

      { !lastPage && (
        <>
          <button onClick={() => {setCurrentPage(currentPage + 1)}} className="w-7 h-7 text-dark-grey rounded-sm flex justify-center items-center hover:bg-grey">{ currentPage + 1 }</button>
        </>
      )}

      { lastPage ? <ChevronRightIcon className="w-7 h-7 text-grey rounded-sm" /> : 
      <ChevronRightIcon onClick={() => {setCurrentPage(currentPage + 1)}} className="w-7 h-7 text-dark-grey hover:bg-grey rounded-sm" />}
    </div>
  )
}