import axios from "axios";
import {
  setCompaniesState,
  setCurrencyRateState,
  setWarehousesState,
} from "../reducers/AppSlice";

export const getSupplimentalData = async (dispatch) => {
  const response = await axios.get("/get_supplemental_data", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  if (response.status === 200) {
    dispatch(setCurrencyRateState(response.data.rates));
    // load string object and set
    dispatch(
      setCompaniesState(
        response.data.suppliers.map((supplierStr) => JSON.parse(supplierStr))
      )
    );
    dispatch(
      setWarehousesState(
        response.data.warehouses.map((warehouseStr) => JSON.parse(warehouseStr))
      )
    );
  } else {
    console.error("Error fetching companies:", response.data.message);
  }
};

export const getJewellersByReseller = async (resellerId, repId) => {
  const response = await axios.post(
    `/get_jewellers_by_reseller`,
    {
      reseller_id: resellerId,
      rep_id: repId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );
  return response.data;
};
