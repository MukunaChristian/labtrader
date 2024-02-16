import { capitalizeFirstLetter } from "../toUpperCase";
import { LinkIcon } from '@heroicons/react/20/solid';


export const diamondColumns = [
  {
    field: "image",
    headerName: "Image",
    width: 80,
    renderCell: (params) => (
      <img className="w-20 h-20 object-contain bg-black" src={params.value} />
    ), // renderCell will render the component
  },
  {
    field: "shape",
    headerName: "Shape",
    width: 50,
    renderCell: (params) => (
      <p>{capitalizeFirstLetter(params.value)}</p>
    ),
  },
  {
    field: "specifications",
    headerName: "Specifications",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className="flex mb-1">
          <div className="w-[30%]">
            <p>Carat: </p>
          </div>
          <div className="w-[50%]">
            <p>{params.value.carat}</p>
          </div>
        </div>

        <div className="flex mb-1">
          <div className="w-[30%]">
            <p>Color: </p>
          </div>
          <div className="w-[70%] whitespace-normal">{params.value.color}</div>
        </div>

        <div className="flex mb-1">
          <div className="w-[30%]">
            <p>Clarity: </p>
          </div>
          <div className="w-[50%]">
            <p>{params.value.clarity}</p>
          </div>
        </div>

        <div className="flex mb-1">
          <div className="w-[30%]">
            <p>Cut: </p>
          </div>
          <div className="w-[50%]">
            <p>{params.value.cut}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "finish",
    headerName: "Finish",
    width: 150,
    renderCell: (params) => (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex">
            <p>Polish: </p>
          </div>
          <div className="flex">
            <p>Symmetry: </p>
          </div>
          <div className="flex">
            <p>Fluor: </p>
          </div>
          <div className="flex">
            <p>Fluor Color: </p>
          </div>
        </div>

        <div>
          <div className="flex">
            <p>{capitalizeFirstLetter(params.value.polish)}</p>
          </div>
          <div className="flex">
            <p>{capitalizeFirstLetter(params.value.symmetry)}</p>
          </div>
          <div className="flex">
            <p>{capitalizeFirstLetter(params.value.fluorescence)}</p>
          </div>
          <div className="flex">
            <p>{capitalizeFirstLetter(params.value.fluorescence_color)}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "table_depth",
    headerName: "Table/Depth",
    width: 100,
    renderCell: (params) => (
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex">
            <p>Table: </p>
          </div>
          <div className="flex">
            <p>Depth: </p>
          </div>
        </div>

        <div>
          <div className="flex">
            <p>{params.value.table}</p>
          </div>
          <div className="flex">
            <p>{params.value.depth}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "ratio_measurements",
    headerName: "Ratio/Measurements",
    width: 50,
    renderCell: (params) => (
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex">
            <p>Ratio: </p>
          </div>
          <div className="flex">
            <p>Width: </p>
          </div>
          <div className="flex">
            <p>Height: </p>
          </div>
          <div className="flex">
            <p>Depth: </p>
          </div>
        </div>

        <div>
          <div className="flex">
            <p>{params.value.ratio}</p>
          </div>
          <div className="flex">
            <p>{params.value.measurements.width}</p>
          </div>
          <div className="flex">
            <p>{params.value.measurements.height}</p>
          </div>
          <div className="flex">
            <p>{params.value.measurements.depth}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "total",
    headerName: "Total",
    width: 50,
    renderCell: (params) => (
      <div className="flex flex-col">
        <div className="flex">
          <p className="text-xs">
            $
            {(
              parseFloat(params.value) /
              parseFloat(params.row.specifications.carat)
            ).toFixed(2)}
            /ct
          </p>
        </div>
        <div className="flex">
          <p className="text-lg">${params.value}</p>
        </div>
        <div className="flex">
          <p>
            {Math.round(parseFloat(params.total) * rates[currency.code] * 10) /
              10}{" "}
            {currency.code}
          </p>
        </div>
      </div>
    ),
  },
  {
    field: "delivery",
    headerName: "Delivery",
    width: 50,
    renderCell: (params) => (
      <div className="flex flex-col">
        <p className="">
            Delivery Time:
        </p>
        <div className="flex mb-2">      
          <p className="">
            {params.from}
          </p>
          <p className="mx-2"> - </p>
          <p className="">
            {params.to}
          </p>
          <p className="ml-2">Days</p>
        </div>
        <div>Location:</div>
        <div>
          {params.location}
        </div>
      </div>
    ),
  },
];


export const meleeColumns = [
  {
    field: "image",
    headerName: "Image",
    width: 80,
    renderCell: (params) => (
      <img className="w-14 h-14 object-contain bg-black" src={params.value} />
    ), // renderCell will render the component
  },
  {
    field: "information",
    headerName: "Information",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className=''>
          <p className='text-primary'>IGI</p>
          <p className='font-semibold text-text'>
            <a className='text-text font-bold border-0 border-solid border-b-[1px]' target="_blank" rel="noreferrer" href={`http://www.igi.org/verify.php?r=${params.value.cert_id}`}>
              {params.value.cert_id}
            </a>
            <LinkIcon className='w-4 h-4 text-text ml-1'/>
          </p>
        </div>
        <div className=''>
          <p className='text-primary'>Stock ID</p>
          <p className='font-semibold text-text'>{params.value.id}</p>
        </div>
      </div>
    ),
  },
  {
    field: "shape",
    headerName: "Shape",
    width: 50,
    renderCell: (params) => (
      <p className="text-wrap">{capitalizeFirstLetter(params.value)}</p>
    ),
  },
  {
    field: "specifications",
    headerName: "Carat",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className="flex mb-1">
          <div className="w-[50%]">
            <p>{params.value.carat}</p>
          </div>
        </div>
      </div>
    ),
  },

  {
    field: "specifications",
    headerName: "Color",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className="flex mb-1">
          <div className="w-[70%] whitespace-normal">{params.value.color}</div>
        </div>
      </div>
    ),
  },

  {
    field: "specifications",
    headerName: "Clarity",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className="flex mb-1">
          <div className="w-[50%]">
            <p>{params.value.clarity}</p>
          </div>
        </div>
      </div>
    ),
  },

  {
    field: "specifications",
    headerName: "Cut",
    width: 50,
    renderCell: (params) => (
      <div>
        <div className="flex mb-1">
          <div className="w-[50%]">
            <p>{params.value.cut}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    field: "size",
    headerName: "Size (mm)",
    width: 50,
    renderCell: (params) => (
      <div className="grid grid-cols-2 gap-6">
        {params.row.size_from && params.row.size_to ? 
          <p>{params.row.size_from} - {params.row.size_to}</p> :
          <p>N/A</p>
        } 
      </div>
    ),
  },
  {
    field: "ppc",
    headerName: "Price Per Carat",
    width: 100,
    renderCell: (params) => (
      <div className="flex flex-col">
        <div className="flex">
          <p className="text-xs">
            {(
              parseFloat(params.value) /
              parseFloat(params.row.specifications.carat)
            ).toFixed(2)}
          </p>
        </div>
        <div className="flex">
          <p>
            {Math.round((
              parseFloat(params.value) /
              parseFloat(params.row.specifications.carat)
            ).toFixed(2) * rates[currency.code] * 10) /
              10}{" "}
            {currency.code}
          </p>
        </div>
      </div>
    ),
  },
  {
    field: "order",
    headerName: "Order",
    width: 100,
    renderCell: (params) => (
      <></>
    ),
  },
  {
    field: "total",
    headerName: "Total",
    width: 150,
    renderCell: (params) => (
      <div className="flex flex-col">
        <div className="flex">
          <p className="text-xs">
            $
            {(
              parseFloat(params.value) /
              parseFloat(params.row.specifications.carat)
            ).toFixed(2)}
            /ct
          </p>
        </div>
        <div className="flex">
          <p className="text-lg">${params.value}</p>
        </div>
        <div className="flex">
          <p>
            {Math.round(parseFloat(params.total) * rates[currency.code] * 10) /
              10}{" "}
            {currency.code}
          </p>
        </div>
      </div>
    ),
  },
  {
    field: "delivery",
    headerName: "Delivery",
    width: 100,
    renderCell: (params) => (
      <div className="flex flex-col">
        <p className="">
            Delivery Time:
        </p>
        <div className="flex mb-2">      
          <p className="">
            {params.from}
          </p>
          <p className="mx-2"> - </p>
          <p className="">
            {params.to}
          </p>
          <p className="ml-2">Days</p>
        </div>
        <div>Location:</div>
        <div>
          {params.location}
        </div>
      </div>
    ),
  },
  {
    field: "cart",
    headerName: "",
    width: 50,
    renderCell: (params) => (
      <></>
    ),
  }
];