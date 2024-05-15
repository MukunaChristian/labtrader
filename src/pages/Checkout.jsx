import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api/checkout";
import {
  clearCart,
  removeDiamondFromCart,
  addDiamondToCart,
} from "../reducers/UserSlice";
import { CheckoutDropdown } from "../components/dropdowns/CheckoutDropdown";
import { calculateDeliveryFee } from "../api/checkout";
import { getJewellersByReseller } from "../api/getSupplimentalData";
import { getUsersCompany } from "../api/company";
// import the index.css file
import "../index.css";
import { set } from "lodash";

const optionsDelivery = ["Collect", "Deliver"];
// get id and delivery method from the url

export const Checkout = () => {
  const { checkout_id, delivery_method } = useParams();
  const diamonds_in_cart = useSelector((state) => state.user.diamonds_in_cart);
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.user.id);
  const user_role = useSelector((state) => state.user.user.role);
  const currency = useSelector((state) => state.app.currency);
  const warehouses = useSelector((state) => state.app.warehouses);

  const [selectedDiamond, setSelectedDiamond] = useState();

  const [delivery, setDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [pay_later, setPayLater] = useState(false);

  const [repPurchase, setRepPurchase] = useState(false);

  const [jewellers, setJewellers] = useState([]);
  const [jewellerCompanyNames, setJewellerCompanyNames] = useState([]);
  const [filteredJewellers, setFilteredJewellers] = useState([]);
  const [filteredJewellerCompanyNames, setFilteredJewellerCompanyNames] =
    useState([]);

  const [selectedJeweller, setSelectedJeweller] = useState({});

  const rates = useSelector((state) => state.app.rates);
  const navigate = useNavigate();

  const subTotal = diamonds_in_cart
    .reduce(
      (acc, curr) =>
        acc +
        parseFloat(curr.total) * curr.amount_in_cart * rates[currency.code],
      0
    )
    .toFixed(2);
  const total = (parseFloat(subTotal) + parseFloat(deliveryFee)).toFixed(2);

  const isNumeric = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
  };

  useEffect(() => {
    setFilteredJewellerCompanyNames(jewellerCompanyNames);
    setFilteredJewellers(jewellers);
  }, [jewellers]);

  const formatNumberWithSpaces = (number) => {
    // Specify options to retain up to 2 decimal places, for example
    const options = {
      minimumFractionDigits: 2, // Minimum decimal places to show
      maximumFractionDigits: 2, // Maximum decimal places to show
    };

    const formatter = new Intl.NumberFormat("en-US", options);
    return formatter.format(number).replace(/,/g, " ");
  };

  const toggleDelivery = (option) => {
    if (option === "Deliver") {
      const idsToFind = diamonds_in_cart.map((obj) => obj.warehouse_id);
      const diamond_warehouses = warehouses.filter((obj) =>
        idsToFind.includes(obj.id)
      );

      let deliveryFee = 0;
      diamond_warehouses.forEach((warehouse) => {
        if (warehouse.delivery_fee && isNumeric(warehouse.delivery_fee)) {
          deliveryFee += parseInt(warehouse.delivery_fee);
        }
      });

      deliveryFee = (deliveryFee * rates[currency.code] * 10) / 10;

      console.log(deliveryFee);

      setDeliveryFee(deliveryFee);
      setDelivery(true);
      return;
    } else {
      setDelivery(false);
      setDeliveryFee(0);
    }
  };

  const toggleJeweller = (option) => {
    setSelectedJeweller(
      jewellers.find((jeweller) => jeweller.email === option)
    );
  };

  useEffect(() => {
    if (!(user_id && user_role)) {
      return;
    }

    console.log(user_role);
    console.log(checkout_id);
    console.log(delivery_method);
    if (user_role === "Admin") {
      getUsersCompany(user_id).then((res) => {
        console.log(res);
        if (!(res.type_id === 2)) {
          return;
        }

        getJewellersByReseller(res.id, null).then((res) => {
          console.log(res);
          setJewellers(res.data);
          setJewellerCompanyNames(res.company_names);
          setRepPurchase(true);
        });
      });
    } else if (user_role === "Sales Rep") {
      getJewellersByReseller(null, user_id).then((res) => {
        console.log(res);
        setJewellers(res.data);
        setJewellerCompanyNames(res.company_names);
        // iter though jewellers and append to jewellerNames
        setRepPurchase(true);
      });
    }
  }, [user_id, user_role]);

  const handlePayNow = () => {
    if (pay_later) {
      setPayLater(false);
    } else {
      setPayLater(true);
    }
    console.log(pay_later);
  };

  const handleCheckout = () => {
    console.log(repPurchase);
    console.log(selectedJeweller);
    if (repPurchase && selectedJeweller.email === "---") {
      return;
    }

    if (repPurchase) {
      checkout(
        diamonds_in_cart,
        selectedJeweller.id,
        0,
        deliveryFee,
        currency.code,
        delivery,
        user_id
      ).then((res) => {
        console.log(res);
        console.log("repurchase");
        dispatch(clearCart());
        navigate("/confirm");
      });
      return;
    } else {
      checkout(
        diamonds_in_cart,
        user_id,
        0,
        deliveryFee,
        currency.code,
        delivery,
        user_id
      ).then((res) => {
        console.log(res);
        dispatch(clearCart());
        navigate("/confirm");
      });
    }
  };

  const updateCurrentAmount = (e) => {
    let amount;
    if (e.target.value === "") {
      amount = 0;
    } else {
      amount = e.target.value;
    }

    console.log(amount);

    if (amount >= 0) {
      const diamond = { ...selectedDiamond, amount_in_cart: parseInt(amount) };
      setSelectedDiamond(diamond);
      const diamondIndex = diamonds_in_cart.findIndex(
        (diamond) => diamond.id === selectedDiamond.id
      );
      dispatch(removeDiamondFromCart(selectedDiamond.id));
      dispatch(addDiamondToCart({ diamond: diamond, index: diamondIndex }));
    }
  };

  const searchJeweller = (search) => {
    if (search === "") {
      setFilteredJewellers(jewellers);
      setFilteredJewellerCompanyNames(jewellerCompanyNames);
      return;
    }

    const filteredIndexes = [];
    // filter if email or company name includes search
    const filteredJewellers = jewellers.filter((jeweller, index) => {
      if (
        jeweller.email.toLowerCase().includes(search.toLowerCase()) ||
        jewellerCompanyNames[index].toLowerCase().includes(search.toLowerCase())
      ) {
        filteredIndexes.push(index);
        return true;
      } else {
        return false;
      }
    });

    const filteredJewellerCompanyNames = jewellerCompanyNames.filter(
      (_, index) => filteredIndexes.includes(index)
    );

    setFilteredJewellers(filteredJewellers);
    setFilteredJewellerCompanyNames(filteredJewellerCompanyNames);
  };

  const getWarehouseDeliveryTime = (warehouse_id) => {
    const warehouse = warehouses.find(
      (warehouse) => warehouse.id === warehouse_id
    );
    if (warehouse) {
      return warehouse.delivery_from + " - " + warehouse.delivery_to;
    }
    return "N/A";
  };
  if (delivery_method === "deliver")
    return (
      <div className="justify-center items-center align-center flex  m-auto">
        <container className="">
          <div className=" checkout_container  flex-col sm:flex-row">
            <section className="pt-24 pr-0 bg-light-grey pb-3 relative mr-0 first_section  lg:pl-2">
              <div className="hover:bg-grey rounded-full mb-4 p-2 w-11 h-11 cursor-pointer">
                <ArrowLeftIcon
                  className="h-7 w-7"
                  onClick={() => window.history.back()}
                />
              </div>

              <div className="flex flex-col items-start pb-2">
                <p className="text-2xl font-bold h-full mr-4">Checkout</p>
                <p className="inline-block h-full font-semibold pb-[2px] text-text">
                  {diamonds_in_cart.length} items in Cart
                </p>
              </div>
              <section className="checkout_cart_container min-w-[39rem] pr-0 lg:pr-6 pr-0">
                <div
                  className="border-solid h-[32rem] border-[1px] border-b-0 rounded-t-lg z-0 overflow-auto text-white"
                  style={{ backgroundColor: "rgb(50 50 50)" }}
                >
                  {diamonds_in_cart.length === 0 ? (
                    <div className="flex justify-center items-center h-[100%] text-[25px]">
                      There are no items in your cart.
                    </div>
                  ) : (
                    diamonds_in_cart.map((diamond, index) => {
                      return (
                        <div
                          key={diamond.id}
                          onClick={() => setSelectedDiamond(diamond)}
                          className={`relative flex items-center cursor-pointer justify-between border-solid border-0 border-b-[1px] h-[6rem] border-gray-500 pl-4 ${
                            index === 0 && "rounded-t-lg"
                          } ${selectedDiamond === diamond ? "bg-grey/40" : ""}`}
                        >
                          <div className="flex items-center w-full">
                            <img
                              src={diamond.image}
                              alt=""
                              className="h-[4rem] w-[4rem]"
                            />
                            <div className="ml-10 h-full">
                              <div className="font-semibold diamond_detail_text">
                                {diamond.shape.toUpperCase()}{" "}
                                {diamond.specifications.carat}ct{" "}
                                {diamond.specifications.color}{" "}
                                {diamond.specifications.clarity.toUpperCase()}{" "}
                                {diamond.specifications.cut.toUpperCase()}{" "}
                                {diamond.finish.polish.toUpperCase()}{" "}
                                {diamond.finish.symmetry.toUpperCase()}{" "}
                                {diamond.finish.fluorescence.toUpperCase()}
                              </div>
                              <p className="diamond_detail_text_2">
                                {diamond.id}
                              </p>
                              <p className="diamond_detail_text_2">
                                {diamond.ratio_measurements.measurements.width}{" "}
                                -{" "}
                                {diamond.ratio_measurements.measurements.height}{" "}
                                x{" "}
                                {diamond.ratio_measurements.measurements.depth}
                              </p>
                            </div>

                            {diamond.diamond_type_id == 2 && (
                              <div className="ml-auto text-right border-solid border-0 border-r-[1px] pr-4 mr-32 border-white">
                                <p className="mb-2">
                                  {diamond.amount ? diamond.amount : 0}{" "}
                                  Available
                                </p>
                                <div className="flex">
                                  <input
                                    className={`w-[6rem] h-[1.5rem] px-2 rounded-sm mr-2`}
                                    value={
                                      diamond.amount_in_cart === 0
                                        ? null
                                        : diamond.amount_in_cart
                                    }
                                    onChange={(e) => {
                                      updateCurrentAmount(e);
                                    }}
                                  />
                                  <p>~ pcs</p>
                                </div>
                              </div>
                            )}

                            <div
                              className={`${
                                diamond.diamond_type_id === 2
                                  ? "ml-0"
                                  : "ml-auto"
                              } text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-white`}
                            >
                              <p className="diamond_detail_text_3">
                                Delivery Time
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                {getWarehouseDeliveryTime(diamond.warehouse_id)}
                              </p>
                            </div>

                            <div
                              className={`text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-white`}
                            >
                              <p className="diamond_detail_text_3">
                                Price in USD
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                ${" "}
                                {formatNumberWithSpaces(
                                  (
                                    diamond.total * diamond.amount_in_cart
                                  ).toFixed(2)
                                )}
                              </p>
                            </div>

                            <div className="text-right mr-4">
                              <p className="diamond_detail_text_3">
                                Price in {currency.name}
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                {diamond.total
                                  ? currency.symbol +
                                    " " +
                                    formatNumberWithSpaces(
                                      (
                                        (parseFloat(diamond.total) *
                                          diamond.amount_in_cart *
                                          rates[currency.code] *
                                          10) /
                                        10
                                      ).toFixed(2)
                                    )
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <p className="">{diamond.price}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center border-solid px-8 h-[8rem] border-[1px] border-black rounded-b-lg bg-black">
                  <div className="text-white">
                    <p className="mb-2">Sub Total</p>
                    <p className="mb-2">Delivery Fee</p>
                    <p className="font-semibold text-lg">
                      Total (Excluding VAT)
                    </p>
                  </div>
                  <div className="ml-auto text-white ">
                    <p className="mb-2 text-right">
                      {currency.symbol} {formatNumberWithSpaces(subTotal)}
                    </p>
                    <p className="mb-2 text-right">
                      {currency.symbol}{" "}
                      {formatNumberWithSpaces(deliveryFee.toFixed(2))}
                    </p>
                    <p className="font-semibold text-lg text-right">
                      {currency.symbol} {formatNumberWithSpaces(total)}
                    </p>
                  </div>
                </div>
              </section>
            </section>
            <section className="address_section rounded-b-lg rounded-t-lg max-w-[39rem] md:mt-[13.8rem]  pt-0 h-96">
              <div className="address_content text-white px-10 bg-light-grey relative address_top">
                <h2 className="text-lg mb-2 mt-2 text-center">
                  Your Delivery Address
                </h2>
                <p className="address_paragraph pl-0">
                  William Penn St, Milnerton, Cape Town, 7435,
                  eeeeeeeeeeeeeeeeeeeeeeeeeeeee ,eeeeeeeeeeeeeeeeeeee
                  ,eeeeeeeeeeeeeeeeeeee ,eeeeeeeeeeeeeee ,eeeeeeeeeeee
                </p>
              </div>
              <div className=" text-center address_content text-white px-10 bg-light-grey relative h-20 py-5">
                <button className="bg-accent rounded-lg text-white px-8 py-3 h-10">
                  Change Delivery Address
                </button>
              </div>
            </section>
          </div>
          <div className="text-right mt-4">
            <button
              onClick={() => handlePayNow()}
              className="bg-accent rounded-lg text-white px-8 py-3 h-10 mr-8 "
            >
              Proceed to checkout
            </button>
          </div>
        </container>
      </div>
    );
  if (delivery_method === "collect") {
    return (
      <div className="justify-center items-center align-center flex  m-auto">
        <container className="">
          <div className=" checkout_container  flex-col sm:flex-row">
            <section className="pt-24 pr-0 bg-light-grey pb-3 relative mr-0 first_section  lg:pl-2">
              <div className="hover:bg-grey rounded-full mb-4 p-2 w-11 h-11 cursor-pointer">
                <ArrowLeftIcon
                  className="h-7 w-7"
                  onClick={() => window.history.back()}
                />
              </div>

              <div className="flex flex-col items-start pb-2">
                <p className="text-2xl font-bold h-full mr-4">Checkout</p>
                <p className="inline-block h-full font-semibold pb-[2px] text-text">
                  {diamonds_in_cart.length} items in Cart
                </p>
              </div>
              <section className="checkout_cart_container min-w-[39rem] pr-0 lg:pr-6 pr-0">
                <div
                  className="border-solid h-[32rem] border-[1px] border-b-0 rounded-t-lg z-0 overflow-auto text-white"
                  style={{ backgroundColor: "rgb(50 50 50)" }}
                >
                  {diamonds_in_cart.length === 0 ? (
                    <div className="flex justify-center items-center h-[100%] text-[25px]">
                      There are no items in your cart.
                    </div>
                  ) : (
                    diamonds_in_cart.map((diamond, index) => {
                      return (
                        <div
                          key={diamond.id}
                          onClick={() => setSelectedDiamond(diamond)}
                          className={`relative flex items-center cursor-pointer justify-between border-solid border-0 border-b-[1px] h-[6rem] border-gray-500 pl-4 ${
                            index === 0 && "rounded-t-lg"
                          } ${selectedDiamond === diamond ? "bg-grey/40" : ""}`}
                        >
                          <div className="flex items-center w-full">
                            <img
                              src={diamond.image}
                              alt=""
                              className="h-[4rem] w-[4rem]"
                            />
                            <div className="ml-10 h-full">
                              <div className="font-semibold diamond_detail_text">
                                {diamond.shape.toUpperCase()}{" "}
                                {diamond.specifications.carat}ct{" "}
                                {diamond.specifications.color}{" "}
                                {diamond.specifications.clarity.toUpperCase()}{" "}
                                {diamond.specifications.cut.toUpperCase()}{" "}
                                {diamond.finish.polish.toUpperCase()}{" "}
                                {diamond.finish.symmetry.toUpperCase()}{" "}
                                {diamond.finish.fluorescence.toUpperCase()}
                              </div>
                              <p className="diamond_detail_text_2">
                                {diamond.id}
                              </p>
                              <p className="diamond_detail_text_2">
                                {diamond.ratio_measurements.measurements.width}{" "}
                                -{" "}
                                {diamond.ratio_measurements.measurements.height}{" "}
                                x{" "}
                                {diamond.ratio_measurements.measurements.depth}
                              </p>
                            </div>

                            {diamond.diamond_type_id == 2 && (
                              <div className="ml-auto text-right border-solid border-0 border-r-[1px] pr-4 mr-32 border-white">
                                <p className="mb-2">
                                  {diamond.amount ? diamond.amount : 0}{" "}
                                  Available
                                </p>
                                <div className="flex">
                                  <input
                                    className={`w-[6rem] h-[1.5rem] px-2 rounded-sm mr-2`}
                                    value={
                                      diamond.amount_in_cart === 0
                                        ? null
                                        : diamond.amount_in_cart
                                    }
                                    onChange={(e) => {
                                      updateCurrentAmount(e);
                                    }}
                                  />
                                  <p>~ pcs</p>
                                </div>
                              </div>
                            )}

                            <div
                              className={`${
                                diamond.diamond_type_id === 2
                                  ? "ml-0"
                                  : "ml-auto"
                              } text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-white`}
                            >
                              <p className="diamond_detail_text_3">
                                Delivery Time
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                {getWarehouseDeliveryTime(diamond.warehouse_id)}
                              </p>
                            </div>

                            <div
                              className={`text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-white`}
                            >
                              <p className="diamond_detail_text_3">
                                Price in USD
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                ${" "}
                                {formatNumberWithSpaces(
                                  (
                                    diamond.total * diamond.amount_in_cart
                                  ).toFixed(2)
                                )}
                              </p>
                            </div>

                            <div className="text-right mr-4">
                              <p className="diamond_detail_text_3">
                                Price in {currency.name}
                              </p>
                              <p className="font-semibold diamond_detail_text_4">
                                {diamond.total
                                  ? currency.symbol +
                                    " " +
                                    formatNumberWithSpaces(
                                      (
                                        (parseFloat(diamond.total) *
                                          diamond.amount_in_cart *
                                          rates[currency.code] *
                                          10) /
                                        10
                                      ).toFixed(2)
                                    )
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <p className="">{diamond.price}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center border-solid px-8 h-[8rem] border-[1px] border-black rounded-b-lg bg-black">
                  <div className="text-white">
                    <p className="mb-2">Sub Total</p>
                    <p className="mb-2">Delivery Fee</p>
                    <p className="font-semibold text-lg">
                      Total (Excluding VAT)
                    </p>
                  </div>
                  <div className="ml-auto text-white ">
                    <p className="mb-2 text-right">
                      {currency.symbol} {formatNumberWithSpaces(subTotal)}
                    </p>
                    <p className="mb-2 text-right">
                      {currency.symbol}{" "}
                      {formatNumberWithSpaces(deliveryFee.toFixed(2))}
                    </p>
                    <p className="font-semibold text-lg text-right">
                      {currency.symbol} {formatNumberWithSpaces(total)}
                    </p>
                  </div>
                </div>
              </section>
            </section>
            <section className="address_section rounded-b-lg rounded-t-lg max-w-[39rem] md:mt-[13.8rem]  pt-2 h-36">
              <div className="address_content text-white px-10 bg-light-grey relative ">
                <h2 className="text-lg mb-2 mt-2 text-center">
                  {" "}
                  Collection Address
                </h2>
                <p className="address_paragraph pl-0">
                  Office 210B, 5 Sturdee Avenue, Rosebank
                </p>
              </div>
            </section>
          </div>
          <div className="text-right mt-4">
            <button
              onClick={() => handlePayNow()}
              className="bg-accent rounded-lg text-white px-8 py-3 h-10 mr-8 "
            >
              Proceed to checkout
            </button>
          </div>
        </container>
      </div>
    );
  }
};
