import { DataRows } from './DataRows';
import { DataRowsMelee } from './DataRowsMelee';
import { Pagenation } from './Pagenation';
import { diamondColumns, meleeColumns } from './columnData';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getFilteredData } from '../../api/diamonds';
import { setDiamondDataState, setLoadingDataState, setCurrencyRateState, setDiamondAmountState } from '../../reducers/AppSlice';



export const CustomDataTable = ({ currentRows, diamondsType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const currency = useSelector(state => state.app.currency);
  const diamondAmount = useSelector(state => state.app.diamondAmount);
  const rates = useSelector(state => state.app.rates);
  const loading = useSelector(state => state.app.loadingData);
  const filters = useSelector(state => state.app.filters);
  const meleeFilters = useSelector(state => state.app.meleeFilters);
  const maxItems = 5;

  const maxPages = Math.ceil(diamondAmount / maxItems);
  const lastPage = currentPage === maxPages;

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("currentPage", currentPage)
    if (diamondsType === "melee") {
      console.log("meleeFilters", meleeFilters)
      getFilteredData(dispatch, setDiamondDataState, setLoadingDataState, setDiamondAmountState, currentPage, meleeFilters);
      return
    }
    getFilteredData(dispatch, setDiamondDataState, setLoadingDataState, setDiamondAmountState, currentPage, filters);
    
  }, [currentPage, diamondsType, filters, meleeFilters])

  console.log("diamondsType", diamondsType)
  let columns = [];
  if (diamondsType === "melee") {
    columns = meleeColumns
  } else if (diamondsType === "diamond") {
    columns = diamondColumns 
  }


  return (
    <div>
      {loading ? <div className="flex justify-center items-center h-96"><p className="border-solid border-[1.5px] p-2 rounded-lg animate-pulse bg-black">Loading...</p></div> :
        <table className="bg-secondary table-auto border-collapse w-full pb-4">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  width={column.headerName === "Image" ? "40" : column.headerName === "Total" ? "100" : "40"}
                  className={`px-3 py-3 text-md text-left leading-4 text-text border-solid border-[1.5px] bg-black`}>
                  {column.headerName}
                </th>
              ))}
              {diamondsType === "diamond" &&
                <th key={7} width={'2%'} className="px-3 py-3 text-md text-left leading-4 text-text bg-black border-light-grey"></th>
              }
            </tr>
          </thead>
          <tbody className='text-sm'>
            {currentRows.map((row, rowIndex) => (
              <>
                { diamondsType === "diamond" ?
                  <DataRows key={rowIndex} row={row} rowIndex={rowIndex} columns={columns} /> :
                  <DataRowsMelee key={rowIndex} row={row} rowIndex={rowIndex} columns={columns} />
                }
              </>
            ))}
          </tbody>
        </table>
      }
      <div className='w-full my-1 flex justify-center'>
        <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={lastPage} />
      </div>
      
      
      
    </div>
  );
}