import axios from "axios";
import {
  setCompaniesState,
  setCurrencyRateState,
  setWarehousesState,
} from "../reducers/AppSlice";

export const getSupplimentalData = async (dispatch) => {
  const response = await axios.get("/get_companies", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  console.log(response.data.data);
  console.log(response.data.rates);
  console.log(response.data.warehouses);

  dispatch(setCurrencyRateState(response.data.rates));
  dispatch(setCompaniesState(response.data.data));
  dispatch(setWarehousesState(response.data.warehouses));
};
