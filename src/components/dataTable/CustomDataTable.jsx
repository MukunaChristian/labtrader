import { DataRows } from "./DataRows";
import { DataRowsMelee } from "./DataRowsMelee";
import { Pagenation } from "./Pagenation";
import { diamondColumns, meleeColumns } from "./columnData";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import {
  clearCart,
  removeDiamondFromCart,
  addDiamondToCart,
} from "../../reducers/UserSlice";
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
import { useNavigate } from "react-router-dom";

export const CustomDataTable = ({ currentRows, diamondsType }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currency = useSelector((state) => state.app.currency);
  const diamondAmount = useSelector((state) => state.app.diamondAmount);
  const rates = useSelector((state) => state.app.rates);
  const loading = useSelector((state) => state.app.loadingData);
  const filters = useSelector((state) => state.app.filters);
  const meleeFilters = useSelector((state) => state.app.meleeFilters);
  const warehouses = useSelector((state) => state.app.warehouses);
  const [selectedDiamond, setSelectedDiamond] = useState();
  const diamonds_in_cart = useSelector((state) => state.user.diamonds_in_cart);
  const [currentAmount, setCurrentAmount] = useState("");
  const navigate = useNavigate();

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

          <div className="show-mobile ">
            {currentRows.length > 0 && (
              <div>
                {currentRows.map((row, rowIndex) => {
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

                  const currentAmountForRow = currentAmount[rowIndex];

                  const inCart = diamonds_in_cart.some(
                    (item) => item.id === row.id
                  );
                  const checkoutUnallowed =
                    (currentAmountForRow === "0" ||
                      currentAmountForRow === "" ||
                      currentAmountForRow > row.amount) &&
                    !inCart;

                  const updateCurrentAmount = (e, rowIndex) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) || value === "") {
                      setCurrentAmount((prevState) => {
                        const newState = [...prevState];
                        newState[rowIndex] = value;
                        return newState;
                      });
                    }
                  };

                  const calcTotalPrice = (convert, currentAmount) => {
                    if (!(currentAmount > 0)) {
                      return 0;
                    }

                    if (convert) {
                      return (
                        ((parseFloat(row.total) * rates[currency.code] * 10) /
                          10) *
                        currentAmount
                      ).toFixed(2);
                    } else {
                      return (
                        ((parseFloat(row.total) * 10) / 10) *
                        currentAmount
                      ).toFixed(2);
                    }
                  };

                  const handleAddToCart = () => {
                    if (diamonds_in_cart.some((item) => item.id === row.id)) {
                      dispatch(removeDiamondFromCart(row.id));
                    } else {
                      dispatch(addDiamondToCart(row));
                    }
                  };

                  return (
                    <div key={rowIndex} className="card-wrapper">
                      <div className="card">
                        <div className="card-content">
                          <div className="card-details">
                            <div className="section1-flex">
                              <div className="">
                                {" "}
                                <div className="flex-img">
                                  <img
                                    src={row.image}
                                    alt="Diamond Image"
                                    className="card-img"
                                  />
                                  <div className="position-round">
                                    {row.shape.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                              <div className="contact-section">
                                <div className="carat">
                                  <p>Price:</p>
                                  {diamondsType !== "melee" && (
                                    <div className="btn-left">
                                      $
                                      {formatNumberWithSpaces(
                                        (
                                          row.total /
                                          parseFloat(row.specifications.carat)
                                        ).toFixed(2)
                                      )}
                                      /ct
                                    </div>
                                  )}
                                </div>{" "}
                                {diamondsType !== "melee" && (
                                  <div className="contact-flex">
                                    <div>Total Price:</div>
                                    <div>
                                      <div className="total-font">
                                        ${row.total}
                                      </div>
                                      <div>
                                        R{formatNumberWithSpaces(spotPrice)}{" "}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="contact-flex">
                                  <div>Delivery Time:</div>
                                  <div>
                                    {warehouse.delivery_from}-{" "}
                                    {warehouse.delivery_to}Days
                                  </div>
                                </div>
                                <div className="contact-flex">
                                  <div>Location:</div>
                                  <div>{warehouse.country}</div>
                                </div>
                                <div className="btn-cart">
                                  {row.diamond_type_id === 1 ? (
                                    <button
                                      onClick={() => handleAddToCart()}
                                      className={`btn-card-add-to-cart ${
                                        diamonds_in_cart.some(
                                          (item) => item.id === row.id
                                        )
                                          ? "bg-red-400"
                                          : "bg-blue-400"
                                      }`}
                                    >
                                      {diamonds_in_cart.some(
                                        (item) => item.id === row.id
                                      )
                                        ? "Remove from cart"
                                        : "Add to cart"}
                                    </button>
                                  ) : (
                                    <div className="mt-4">
                                      <p className=" btn-card-add-to-cart">
                                        Add to cart
                                      </p>
                                      <div>
                                        <button
                                          className={`mt-2 h-7 w-32 rounded-md flex justify-center items-center text-white bg-accent`}
                                        >
                                          Request
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <hr className="white-line" />
                            <div className="specs-container">
                              <p className="title-padding">Specifications</p>
                            </div>
                            <div className="container-flex">
                              <div className="specifications-flex">
                                <p> Carat</p>
                                <div>{row.specifications.carat}</div>
                              </div>
                              <div className="specifications-flex">
                                <p> Color</p>
                                <div>{row.specifications.color}</div>
                              </div>
                              <div className="specifications-flex">
                                <p> Clarity</p>
                                <div>{row.specifications.clarity}</div>
                              </div>
                              <div className="specifications-flex">
                                <p> Cut</p>
                                <div>{row.specifications.cut}</div>
                              </div>
                              {diamondsType !== "melee" && (
                                <>
                                  <div className="specifications-flex">
                                    <p> Measurements</p>
                                    <div className="data-flex">
                                      <div>{row.ratio_measurements.ratio}-</div>
                                      <div>
                                        {
                                          row.ratio_measurements.measurements
                                            .depth
                                        }
                                      </div>
                                      <div>
                                        {
                                          row.ratio_measurements.measurements
                                            .height
                                        }
                                      </div>
                                      <div>
                                        {
                                          row.ratio_measurements.measurements
                                            .width
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {diamondsType !== "diamond" && (
                                <>
                                  <div className="specifications-flex">
                                    <div> size</div>
                                    <div>
                                      {row.size_from} - {row.size_to}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            {diamondsType !== "melee" && (
                              <>
                                <div className="btn-side">
                                  <button
                                    className="btn-card"
                                    onClick={() => {
                                      navigate("/details/" + row["id"]);
                                    }}
                                  >
                                    More Details
                                  </button>
                                </div>
                              </>
                            )}
                            <hr className="white-line" />
                            <div className="text-container">
                              <p>Stock ID - {row.id}</p>
                            </div>
                            <div className="link-container">
                              <p>IGI</p>
                              {row.certificate === "IGI" ||
                              row.certificate === "GIA" ? (
                                <>
                                  <a
                                    className="text-text font-bold border-0  ml-[-10px]"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={
                                      row.certificate === "IGI"
                                        ? `http://www.igi.org/verify.php?r=${row.cert_id}`
                                        : `https://diamond.blissvideos.com/?d=${row.id}`
                                    }
                                  >
                                    {row.cert_id}
                                  </a>
                                  <ClipboardDocumentIcon
                                    className="w-5 h-5 ml-[-10px] cursor-pointer"
                                    onClick={() => {
                                      if (row.certificate === "IGI") {
                                        navigator.clipboard.writeText(
                                          "http://www.igi.org/verify.php?r=" +
                                            row.cert_id
                                        );
                                      } else if (row.certificate === "GIA") {
                                        // Perform different action for GIA certificate
                                        // For example: navigate to GIA website
                                        window.open(
                                          `https://diamond.blissvideos.com/?d=${row.cert_id}`,
                                          "_blank"
                                        );
                                      }
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-text font-bold border-0 border-solid border-b-[1px] bg-black"
                                    onClick={() =>
                                      downloadCertFile(row.cert_id)
                                    }
                                  >
                                    {row.cert_id}
                                  </button>
                                  {/* <ArrowDownOnSquareStackIcon
                                    className="w-5 h-5 text-text ml-2 mt-[1px] cursor-pointer"
                                    onClick={() =>
                                      downloadCertFile(row.cert_id)
                                    }
                                  /> */}
                                </>
                              )}
                              

                              {diamondsType !== "melee" && (
                                <>
                                  <a
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        row.video_link
                                      )
                                    }
                                  >
                                    Video Link
                                  </a>
                                  <ClipboardDocumentIcon className="w-5 h-5 cursor-pointer ml-[-10px]" />
                                </>
                              )}
                              

                              {diamondsType !== "diamond" && (
                                <div className="flex-data">
                                  {/* <div>
                                    R{" "}
                                    {(
                                      parseFloat(row["total"]) /
                                      parseFloat(row.specifications.carat)
                                    ).toFixed(2)}
                                  </div> */}
                                  <div>
                                    ${" "}
                                    {(
                                      spotPrice /
                                      parseFloat(row.specifications.carat)
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              )}
                            </div>
                           

                            <hr className="white-line" />

                            {diamondsType !== "diamond" && (
                              <>
                                <div className="order-section">
                                  <p>Order</p>
                                  <div className="flex-amount-available">
                                    <p className="mb-2">
                                      {row.amount ? row.amount : 0} Available
                                    </p>
                                    <div className="flex">
                                      <input
                                        disabled={inCart}
                                        className={`w-[4em] h-[1.5rem] px-2 rounded-sm mr-2 ${
                                          inCart ? "bg-light-grey" : ""
                                        }`}
                                        value={currentAmountForRow}
                                        onChange={(e) => {
                                          updateCurrentAmount(e, rowIndex);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {diamondsType !== "diamond" && (
                              <div className="total-price-flex">
                                <div>Total Price:</div>
                                <div className="contact-flex">
                                  {spotPrice ? (
                                    <div className="flex flex-col">
                                      <div className="flex">
                                        <p className="">
                                          ${" "}
                                          {calcTotalPrice(
                                            false,
                                            currentAmountForRow
                                          )}
                                        </p>
                                      </div>
                                      <div className="flex">
                                        <p>
                                          R{" "}
                                          {calcTotalPrice(
                                            true,
                                            currentAmountForRow
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col">
                                      <div className="flex">
                                        <p className="text-lg">N/A</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className=" margin w-full my-1 flex justify-center ">
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
