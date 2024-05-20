// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getFilteredData } from "../api/diamonds";
// import { DataRows } from "./dataTable/DataRows";
// import { DataRowsMelee } from "./dataTable/DataRowsMelee";
// import { diamondColumns, meleeColumns } from "./dataTable/columnData";

// export const MobileView = ({ diamondsType, row }) => {
//   const [currentRows, setCurrentRows] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [columns, setColumns] = useState([]);
//   const [currentAmount, setCurrentAmount] = useState("");
//   const warehouses = useSelector(state => state.app.warehouses);  

//   const warehouse = warehouses.find(
//     (warehouse) => warehouse.id === row.warehouse_id
//   );

//   const dispatch = useDispatch();
//   const filters = useSelector((state) => state.app.filters);
//   const meleeFilters = useSelector((state) => state.app.meleeFilters);

//   useEffect(() => {
//     setCurrentPage(1); // Reset page to 1 when filters change
//   }, [filters, meleeFilters]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getFilteredData(
//         dispatch,
//         setCurrentRows,
//         setCurrentPage,
//         currentPage,
//         diamondsType === "melee" ? meleeFilters : filters
//       );
//       setCurrentRows(data);
//       setColumns(diamondsType === "melee" ? meleeColumns : diamondColumns);
//     };

//     fetchData();
//   }, [currentPage, diamondsType, filters, meleeFilters, dispatch]);

//   return (
//     <div className="show-mobile">
//       {currentRows.length > 0 && (
//         <div>
//           {currentRows.map((row, rowIndex) => {
//             // Calculate spotPrice here
//             let spotPrice = null;
//             if (row.total) {
//               spotPrice = (
//                 (parseFloat(row.total) * rates[currency.code] * 10) /
//                 10
//               ).toFixed(2);
//             }

//             const warehouse = warehouses.find(
//               (warehouse) => warehouse.id === row.warehouse_id
//             );

            

//             const handleAddToCart = () => {
//               if (diamonds_in_cart.some((item) => item.id === row.id)) {
//                 dispatch(removeDiamondFromCart(row.id));
//               } else {
//                 dispatch(
//                   addDiamondToCart({
//                     ...row,
//                     amount_in_cart: parseInt(currentAmount),
//                   })
//                 );
//               }
//             };

//             const calcTotalPrice = (convert) => {
//               if (!currentAmount > 0) {
//                 return 0;
//               }

//               if (convert) {
//                 return (
//                   ((parseFloat(row.total) * rates[currency.code] * 10) / 10) *
//                   currentAmount
//                 ).toFixed(2);
//               } else {
//                 return (
//                   ((parseFloat(row.total) * 10) / 10) *
//                   currentAmount
//                 ).toFixed(2);
//               }
//             };

//             const updateCurrentAmount = (e) => {
//               console.log(e.target.value);
//               if (!/^[^0-9]*$/.test(e.target.value) || e.target.value === "") {
//                 setCurrentAmount(e.target.value);
//               }
//             };

//             const inCart = diamonds_in_cart.some((item) => item.id === row.id);
//             const checkoutUnallowed =
//               (currentAmount === "0" ||
//                 currentAmount === "" ||
//                 currentAmount > row.amount) &&
//               !inCart;

//             return (
//               <div key={rowIndex} className="card-wrapper">
//                 <div className="card">
//                   <div className="card-content">
//                     <div className="card-details">
//                       <div className="image-center">
//                         <img
//                           src={row.image}
//                           alt="Diamond Image"
//                           className="card-img"
//                         />
//                       </div>

//                       <hr className="white-line" />
//                       <div className="link-container">
//                         <a
//                           target="_blank"
//                           rel="noreferrer"
//                           href={
//                             row.certificate === "IGI"
//                               ? `http://www.igi.org/verify.php?r=${row.cert_id}`
//                               : `https://diamond.blissvideos.com/?d=${row.id}`
//                           }
//                         >
//                           IGI Link
//                         </a>
//                         <a
//                           onClick={() =>
//                             navigator.clipboard.writeText(row.video_link)
//                           }
//                         >
//                           Video Link
//                         </a>
//                         {diamondsType !== "melee" && (
//                           <>
//                             <div className="btn-left">${row.total}/ct</div>
//                           </>
//                         )}
//                         {diamondsType !== "diamond" && (
//                           <>
//                             <div className="flex-data">
//                               <div>
//                                 R{" "}
//                                 {(
//                                   parseFloat(row["total"]) /
//                                   parseFloat(row.specifications.carat)
//                                 ).toFixed(2)}
//                               </div>
//                               <div>
//                                 ${" "}
//                                 {(
//                                   spotPrice /
//                                   parseFloat(row.specifications.carat)
//                                 ).toFixed(2)}
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <div className="text-container">
//                         <p>Stock ID - {row.id}</p>
//                         <p>
//                           {" "}
//                           {row.shape.toUpperCase()} {row.specifications.carat}ct{" "}
//                           {row.specifications.color}{" "}
//                           {row.specifications.clarity.toUpperCase()}{" "}
//                           {row.specifications.cut.toUpperCase()}{" "}
//                           {row.finish.polish.toUpperCase()}{" "}
//                           {row.finish.symmetry.toUpperCase()}{" "}
//                           {row.finish.fluorescence.toUpperCase()}
//                         </p>
//                       </div>
//                       <hr className="white-line" />
//                       <div className="specs-container">
//                         <p>Specifications</p>
//                         <button>More Details</button>
//                       </div>
//                       <div className="container-flex">
//                         <div className="specifications-flex">
//                           <div> Carat</div>
//                           <div>{row.specifications.carat}</div>
//                         </div>
//                         <div className="specifications-flex">
//                           <div> color</div>
//                           <div>{row.specifications.color}</div>
//                         </div>
//                         <div className="specifications-flex">
//                           <div> Clarity</div>
//                           <div>{row.specifications.clarity}</div>
//                         </div>
//                         <div className="specifications-flex">
//                           <div> Cut</div>
//                           <div>{row.specifications.cut}</div>
//                         </div>
//                         {diamondsType !== "melee" && (
//                           <>
//                             <div className="specifications-flex">
//                               <div> Table</div>
//                               <div>{row.table_depth.table}</div>
//                             </div>
//                             <div className="specifications-flex">
//                               <div> Depth</div>
//                               <div>{row.table_depth.depth}</div>
//                             </div>

//                             <div className="specifications-flex">
//                               <div> Measurements</div>
//                               <div className="data-flex">
//                                 {row.ratio_measurements.ratio}
//                                 {row.ratio_measurements.measurements.depth}
//                                 {row.ratio_measurements.measurements.height}
//                                 {row.ratio_measurements.measurements.width}{" "}
//                               </div>
//                             </div>
//                             <div className="specifications-flex">
//                               <div> Ratio</div>
//                               <div>{row.ratio_measurements.ratio}</div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <hr className="white-line" />
//                       <div className="contact-flex">
//                         <div>Location:</div>
//                         <div>{warehouse.country}</div>
//                       </div>
//                       <div className="contact-flex">
//                         <div>Delivery Time:</div>
//                         <div>
//                           {" "}
//                           {warehouse.delivery_from} to {warehouse.delivery_to}
//                         </div>
//                       </div>

//                       <hr className="white-line" />

//                       <p className="mb-2">
//                         {row.amount ? row.amount : 0} Available
//                       </p>
//                       <div className="flex">
//                         <input
//                           disabled={inCart}
//                           className={`w-[6rem] h-[1.5rem] px-2 rounded-sm mr-2 ${
//                             inCart ? "bg-light-grey" : ""
//                           }`}
//                           value={currentAmount}
//                           onChange={(e) => {
//                             updateCurrentAmount(e);
//                           }}
//                         />
//                       </div>

//                       {diamondsType !== "melee" && (
//                         <>
//                           <div className="contact-flex">
//                             <div>Total Price:</div>
//                             <div>R{row.total}</div>
//                           </div>
//                         </>
//                       )}
//                       {diamondsType !== "diamond" && (
//                         <>
//                           <div className="total-price-flex">
//                             <div>Total Price:</div>

//                             <div className="contact-flex">
//                               {spotPrice ? (
//                                 <div className="flex flex-col">
//                                   <div className="flex">
//                                     <p className="">
//                                       $ {calcTotalPrice(false)}
//                                     </p>
//                                   </div>
//                                   <div className="flex">
//                                     <p>R {calcTotalPrice(true)}</p>
//                                   </div>
//                                 </div>
//                               ) : (
//                                 <div className="flex flex-col">
//                                   <div className="flex">
//                                     <p className="text-lg">N/A</p>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </>
//                       )}
//                       <div className="btn-cart">
//                         <button>Add to Cart</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
