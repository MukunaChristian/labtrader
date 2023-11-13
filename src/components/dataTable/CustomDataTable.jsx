import { DataRows } from './DataRows';
import { Pagenation } from './Pagenation';
import { capitalizeFirstLetter } from '../toUpperCase';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


export const CustomDataTable = ({ currentRows }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRowsLocal, setCurrentRowsLocal] = useState(currentRows); // diamondRows.slice(0, 5) // [0, 5
  const [cutRows, setCutRows] = useState([]); // [0, 5
  
  const currency = useSelector(state => state.app.currency);
  const maxItems = 5;

  const maxPages = Math.ceil(currentRows.length / maxItems);
  const lastPage = currentPage === maxPages;


  useEffect(() => {
    let cutDiamondRows = currentRows.slice((currentPage - 1) * maxItems, currentPage * maxItems);
    setCutRows(cutDiamondRows);
  }, [currentPage])

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => 
        <img className="w-20 h-20 object-contain border-solid border-[1px] bg-white rounded-full" src={params.value} />, // renderCell will render the component
    },
    {
      field: 'shape',
      headerName: 'Shape',
      width: 100,
      renderCell: (params) => (
        <p className='w-32'>{capitalizeFirstLetter(params.value)}</p>
      )
    },
    {
      field: 'specifications',
      headerName: 'Specifications',
      width: 200,
      renderCell: (params) => (
          <div>
            <div className='flex mb-1'>
              <div className='w-[30%]'>
                <p>Carat: </p>
              </div>
              <div className='w-[50%]'>
                <p>{params.value.carat}</p>
              </div>
            </div>

            <div className='flex mb-1'>
              <div className='w-[30%]'>
                <p>Color: </p>
              </div>
              <div className='w-[70%] whitespace-normal'>
                {params.value.color}
              </div>
            </div>

            <div className='flex mb-1'>
              <div className='w-[30%]'>
                <p>Clarity: </p>
              </div>
              <div className='w-[50%]'>
                <p>{params.value.clarity}</p>
              </div>
            </div>

            <div className='flex mb-1'>
              <div className='w-[30%]'>
                <p>Cut: </p>
              </div>
              <div className='w-[50%]'>
                <p>{params.value.cut}</p>
              </div>
            </div>
          </div>
      )
    },
    {
      field: 'finish',
      headerName: 'Finish',
      width: 200,
      renderCell: (params) => (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex"><p>Polish: </p></div>
            <div className="flex"><p>Symmetry: </p></div>
            <div className="flex"><p>Fluor: </p></div>
            <div className="flex"><p>Fluor Color: </p></div>
          </div>

          <div>
            <div className="flex"><p>{capitalizeFirstLetter(params.value.polish)}</p></div>
            <div className="flex"><p>{capitalizeFirstLetter(params.value.symmetry)}</p></div>
            <div className="flex"><p>{capitalizeFirstLetter(params.value.fluorescence)}</p></div>
            <div className="flex"><p>{capitalizeFirstLetter(params.value.fluorescence_color)}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'table_depth',
      headerName: 'Table/Depth',
      width: 50,
      renderCell: (params) => (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex"><p>Table: </p></div>
            <div className="flex"><p>Depth: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.table}</p></div>
            <div className="flex"><p>{params.value.depth}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'ratio_measurements',
      headerName: 'Ratio/Measurements',
      width: 80,
      renderCell: (params) => (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex"><p>Ratio: </p></div>
            <div className="flex"><p>Width: </p></div>
            <div className="flex"><p>Height: </p></div>
            <div className="flex"><p>Depth: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.ratio}</p></div>
            <div className="flex"><p>{params.value.measurements.width}</p></div>
            <div className="flex"><p>{params.value.measurements.height}</p></div>
            <div className="flex"><p>{params.value.measurements.depth}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-col">
          <div className="flex"><p className='text-xs'>${(parseFloat(params.value) / parseFloat(params.row.specifications.carat)).toFixed(2)}/ct</p></div>
          <div className="flex"><p className='text-lg'>${params.value}</p></div>
          <div className="flex"><p>{parseFloat(params.value) * currency.toOneUSD} {currency.code}</p></div>
        </div>
      )
    },
    {
      field: 'shipping',
      headerName: 'Shipping',
      width: 150,
    },

  ];


  useEffect(() => {
    let cutDiamondRows = currentRows.slice((currentPage - 1) * maxItems, currentPage * maxItems);
    setCutRows(cutDiamondRows);
  }, [currentRows])

  console.log(currentRows[0])


  return (
    <div>
      <div className='w-full my-1'>
        <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={lastPage} />
      </div>
      <table className="bg-secondary table-auto border-collapse w-full pb-4">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} width={column.width} className="px-3 py-3 text-md text-left leading-4 text-text border-solid border-[1.5px] border-dark-grey">{column.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody className='text-sm'>
          {cutRows.map((row, rowIndex) => (
            <DataRows key={rowIndex} row={row} rowIndex={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
      
      
      
    </div>
  );
}