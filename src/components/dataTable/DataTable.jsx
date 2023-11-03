import { DataGrid } from "@mui/x-data-grid";
import diamondIcon from "../../assets/diamond-shapes/round.png";

export const DataTable = () => {
  // image, shape, carat, col, cla, cut, pol, sym, fluor, table, depth, ratio, measurements, total, shipping 
  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => <img className="w-full h-full object-contain" src={params.value} />, // renderCell will render the component
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
            <div className="flex"><p>Polish: </p></div>
            <div className="flex"><p>Symmetry: </p></div>
            <div className="flex"><p>Fluor: </p></div>
          </div>

          <div>
            <div className="flex"><p>{params.value.carat}</p></div>
            <div className="flex"><p>{params.value.col}</p></div>
            <div className="flex"><p>{params.value.cla}</p></div>
            <div className="flex"><p>{params.value.cut}</p></div>
            <div className="flex"><p>{params.value.pol}</p></div>
            <div className="flex"><p>{params.value.sym}</p></div>
            <div className="flex"><p>{params.value.fluor}</p></div>
          </div>
        </div>
      )
    },
    {
      field: 'table',
      headerName: 'Table',
      width: 80,
    },
    {
      field: 'depth',
      headerName: 'Depth',
      width: 80,
    },
    {
      field: 'ratio',
      headerName: 'Ratio',
      width: 80,
    },
    {
      field: 'measurements',
      headerName: 'Measurements',
      width: 150,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 150,
    },
    {
      field: 'origin',
      headerName: 'Origin',
      width: 80,
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
      image: diamondIcon,
      shape: "Round",
      specifications: {
        carat: "1.00",
        col: "D",
        cla: "IF",
        cut: "EX",
        pol: "EX",
        sym: "EX",
        fluor: "N",
      },
      table: "50%",
      depth: "50%",
      ratio: "1.00",
      measurements: "6.67 x 6.67 x 4.00",
      origin: "India",
      shipping: "7-10 days",
    },
    {
      id: 1,
      image: diamondIcon,
      shape: "Round",
      specifications: {
        carat: "1.00",
        col: "D",
        cla: "IF",
        cut: "EX",
        pol: "EX",
        sym: "EX",
        fluor: "N",
      },
      table: "40%",
      depth: "60%",
      ratio: "0.67",
      measurements: "6.67 x 6.67 x 4.00",
      origin: "India",
      shipping: "7-10 days",
    },
  ];


  return (
    <div className="mt-7">
      <DataGrid
        disableRowSelectionOnClick={true}
        disableColumnMenu={true}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowHeight={180}
        checkboxSelection
        onSelectionModelChange={(ids) => {
          console.log(ids)
        }}
      />
    </div>
  );
}
