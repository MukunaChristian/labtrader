import { DataRows } from "./DataRows";
import { DataRowsMelee } from "./DataRowsMelee";
import { Pagenation } from "./Pagenation";
import { diamondColumns, meleeColumns } from "./columnData";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getFilteredData } from "../../api/diamonds";
import {
  setDiamondDataState,
  setLoadingDataState,
  setCurrencyRateState,
  setDiamondAmountState,
} from "../../reducers/AppSlice";

export const CustomDataTable = ({ currentRows, diamondsType }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currency = useSelector((state) => state.app.currency);
  const diamondAmount = useSelector((state) => state.app.diamondAmount);
  const rates = useSelector((state) => state.app.rates);
  const loading = useSelector((state) => state.app.loadingData);
  const filters = useSelector((state) => state.app.filters);
  const meleeFilters = useSelector((state) => state.app.meleeFilters);
  const warehouses = useSelector((state) => state.app.warehouses);

  const maxItems = 5;

  const maxPages = Math.ceil(diamondAmount / maxItems);
  const lastPage = currentPage === maxPages;

  const dispatch = useDispatch();

  const formatNumberWithSpaces = (number) => {
    const formatter = new Intl.NumberFormat("en-US");
    return formatter.format(number).replace(/,/g, ",");
  };

  useEffect(() => {
    if (diamondsType === "melee") {
      getFilteredData(
        dispatch,
        setDiamondDataState,
        setLoadingDataState,
        setDiamondAmountState,
        currentPage,
        meleeFilters
      );
      return;
    }
    getFilteredData(
      dispatch,
      setDiamondDataState,
      setLoadingDataState,
      setDiamondAmountState,
      currentPage,
      filters
    );
  }, [currentPage, diamondsType, filters, meleeFilters]);

  useEffect(() => {
    // if filters change set page to 1
    setCurrentPage(1);
  }, [filters, meleeFilters]);

  let columns = [];
  if (diamondsType === "melee") {
    columns = meleeColumns;
  } else if (diamondsType === "diamond") {
    columns = diamondColumns;
  }
  console.log(meleeFilters);

  // const warehouse = warehouses.find(warehouse => warehouse.id === row.warehouse_id);

  return (
    <>
      {currentRows.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-text">
            No items in your search criteria are currently in stock
          </p>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <p className="border-solid border-[1.5px] p-2 rounded-lg animate-pulse bg-black">
                Loading...
              </p>
            </div>
          ) : (
            <table className="bg-secondary table-auto border-collapse w-full pb-4">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <>
                      {diamondsType === "diamond" ? (
                        <th
                          key={index}
                          width={
                            column.headerName === "Image"
                              ? "50"
                              : column.headerName === "Total"
                              ? "50"
                              : column.width
                          }
                          className={`px-3 py-3 text-md text-left leading-4 text-text border-solid border-[1.5px] bg-black`}
                        >
                          {column.headerName}
                        </th>
                      ) : (
                        <th
                          key={index}
                          width={
                            column.headerName === "Image"
                              ? "40"
                              : column.headerName === "Total"
                              ? "100"
                              : column.width
                          }
                          className={`px-3 py-3 text-md text-left leading-4 text-text border-solid border-[1.5px] bg-black`}
                        >
                          {column.headerName}
                        </th>
                      )}
                    </>
                  ))}
                  {diamondsType === "diamond" && (
                    <th
                      key={7}
                      width={"2%"}
                      className="px-3 py-3 text-md text-left leading-4 text-text bg-black border-light-grey"
                    ></th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentRows.map((row, rowIndex) => (
                  <>
                    {diamondsType === "diamond" ? (
                      <DataRows
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        columns={columns}
                      />
                    ) : (
                      <DataRowsMelee
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        columns={columns}
                      />
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}

          <div className="w-full flex flex-wrap sm:hidden">
            {currentRows.length > 0 && (
              <div className="w-full flex flex-wrap sm:hidden">
                {currentRows.map((row, rowIndex) => {
                  // Calculate spotPrice here
                  let spotPrice = null;
                  if (row.total) {
                    spotPrice = (
                      (parseFloat(row.total) * rates[currency.code] * 10) /
                      10
                    ).toFixed(2);
                  }

                  const warehouse = warehouses.find(
                    (warehouse) => warehouse.id === row.warehouse_id
                  );

                  return (
                    <div key={rowIndex} className="card-wrapper">
                      <div className="card">
                        <div className="card-content">
                          <div className="card-details">
                            <div className="image-center">
                            <img
                              src={row.image}
                              alt="Diamond Image"
                              className="card-img"
                            />
                            </div>
                          
                            <p>Diamond Information:</p>
                            <p>
                              Specifications: Carat - {row.specifications.carat}
                              , Color - {row.specifications.color}, Clarity -{" "}
                              {row.specifications.clarity}, Cut -{" "}
                              {row.specifications.cut}
                            </p>
                            {/* Other Information */}
                            <p>
                              Price per Carat:{" "}
                              {formatNumberWithSpaces(
                                (
                                  row.total /
                                  parseFloat(row.specifications.carat)
                                ).toFixed(2)
                              )}
                            </p>
                            <p>
                              Measurements: Ratio -{" "}
                              {row.ratio_measurements.ratio} depth
                              {row.ratio_measurements.measurements.depth} height
                              {row.ratio_measurements.measurements.height} width
                              {row.ratio_measurements.measurements.width}{" "}
                            </p>
                            <p>Final Price: {row.total}</p>
                            <p>
                              Rand Conversion:{" "}
                              {formatNumberWithSpaces(spotPrice)}{" "}
                              {currency.code}
                            </p>
                            <p>
                              Delivery Time: From:{warehouse.delivery_from} to:{" "}
                              {warehouse.delivery_to} Loaction:
                              {warehouse.country}{" "}
                            </p>
                            <p>Certificate: {row.certificate}</p>
                            <p>Video Links: {row.videoLinks}</p>
                            <div onClick={() => navigator.clipboard.writeText(row.video_link)}>
                              <a>Copy and Paste in Web Browser </a>
                            </div>
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="w-full my-1 flex justify-center">
            <Pagenation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
            />
          </div>
        </div>
      )}
    </>
  );
};
