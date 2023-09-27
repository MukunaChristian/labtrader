import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { DataRows } from './DataRows';



export const CustomDataTable = () => {
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => 
        <img className="w-20 h-20 object-contain" src={params.value} />, // renderCell will render the component
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
            <div className="flex"><p>Measurements: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.ratio}</p></div>
            <div className="flex"><p>{params.value.measurements}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
    },
    {
      field: 'shipping',
      headerName: 'Shipping',
      width: 150,
    },

  ];

  
  const rows = [
    {
      id: 1,
      image: "src/assets/diamond-shapes/round.png",
      shape: "Round",
      specifications: {
        carat: "1.00",
        col: "D",
        cla: "IF",
        cut: "EX"
      },
      finish: {
        pol: "EX",
        sym: "EX",
        fluor: "N",
      },
      table_depth: {table: "40", depth: "60"},
      ratio_measurements: {ratio: "0.67", measurements: "6.67 x 6.67 x 4.00"},
      shipping: "7-10 days",
    },
    {
      id: 1,
      image: "src/assets/diamond-shapes/round.png",
      shape: "Round",
      specifications: {
        carat: "1.00",
        col: "D",
        cla: "IF",
        cut: "EX"
      },
      finish: {
        pol: "EX",
        sym: "EX",
        fluor: "N",
      },
      table_depth: {table: "40", depth: "60"},
      ratio_measurements: {ratio: "0.67", measurements: "6.67 x 6.67 x 4.00"},
      shipping: "7-10 days",
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
          {rows.map((row, rowIndex) => (
            <DataRows key={rowIndex} row={row} rowIndex={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}