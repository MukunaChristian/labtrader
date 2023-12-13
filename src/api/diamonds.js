import axios from "axios";
import { transformedList } from "../data/getDiamondData";

export const diamonds = async (
  dispatch,
  setData,
  setLoading,
  setRates,
  setWarehouses
) => {
  dispatch(setLoading(true));
  const response = await axios.get(
    "/item/8868260a-42fd-450a-81a7-225a55fb70e5",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  let objectList = response.data.items.map((str) => JSON.parse(str));
  objectList = transformedList(objectList);
  console.log(response.data);
  dispatch(setData(objectList));
  dispatch(setRates(response.data.rates));
  dispatch(setWarehouses(response.data.warehouses));
  dispatch(setLoading(false));
};

export const getFilteredData = async (
  dispatch,
  setData,
  setLoading,
  setRates,
  setDiamondAmount,
  page,
  filters
) => {
  dispatch(setLoading(true));
  const response = await axios.post(
    "/diamond",
    {
      filters: filters,
      page: page,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  let objectList = response.data.items.map((str) => JSON.parse(str));
  objectList = transformedList(objectList);
  console.log(objectList);

  dispatch(setData(objectList));
  dispatch(setDiamondAmount(response.data.item_length));
  dispatch(setRates(response.data.rates));
  dispatch(setLoading(false));
};

// upload stock excel file
export const uploadStock = async (
  file,
  warehouse,
  dispatch,
  setUploadLoading,
  setErrors
) => {
  const formData = new FormData();
  formData.append("file", file);
  // formData.append("warehouse", warehouse.WarehouseCode);
  const response = await axios.post("/stock", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  dispatch(setErrors(response.data.errors));
  dispatch(setUploadLoading(false));

  return response.data;
};
