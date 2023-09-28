import { diamondRows } from '../diamondData/diamondRows';
import { DataRows } from './DataRows';
import { Pagenation } from './Pagenation';

import { useState } from 'react';
import { useSelector } from 'react-redux';


export const CustomDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const currency = useSelector(state => state.app.currency);
  const maxItems = 5;

  const maxPages = Math.ceil(diamondRows.length / maxItems);
  const lastPage = currentPage === maxPages;

  let cutDiamondRows = diamondRows.slice((currentPage - 1) * maxItems, currentPage * maxItems);

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => 
        <img className="w-20 h-20 object-contain border-solid border-[1px]" src={params.value} />, // renderCell will render the component
    },
    {
      field: 'shape',
      headerName: 'Shape',
      width: 100,
    },
    {
      field: 'specifications',
      headerName: 'Specifications',
      width: 200,
      renderCell: (params) => (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex"><p>Carat: </p></div>
            <div className="flex"><p>Color: </p></div>
            <div className="flex"><p>Clarity: </p></div>
            <div className="flex"><p>Cut: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.carat}</p></div>
            <div className="flex"><p>{params.value.col}</p></div>
            <div className="flex"><p>{params.value.cla}</p></div>
            <div className="flex"><p>{params.value.cut}</p></div>

          </div>
        </div>
      )
    },
    {
      field: 'finish',
      headerName: 'Finish',
      width: 200,
      renderCell: (params) => (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex"><p>Polish: </p></div>
            <div className="flex"><p>Symmetry: </p></div>
            <div className="flex"><p>Fluor: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.pol}</p></div>
            <div className="flex"><p>{params.value.sym}</p></div>
            <div className="flex"><p>{params.value.fluor}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'table_depth',
      headerName: 'Table/Depth',
      width: 80,
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
          <div className="flex"><p className='text-xs text-[#79de43]'>${parseFloat(params.value) / parseFloat(params.row.specifications.carat)}/ct</p></div>
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



  return (
    <div>
      <table className="bg-white table-auto border-collapse w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-3 py-3 text-md text-left leading-4 text-dark-grey border-solid border-[1.5px]">{column.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody className='text-sm'>
          {cutDiamondRows.map((row, rowIndex) => (
            <DataRows key={rowIndex} row={row} rowIndex={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
      
      <div className='w-full my-6'>
        <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={lastPage} />
      </div>
      
    </div>
  );
}