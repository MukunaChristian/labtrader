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

// get data for specific stock ids
export const getDataByIds = async (stockIds) => {
  const response = await axios.post(
    "/diamond",
    {
      filters: { stock_id: stockIds },
      page: 1,
      page_size: stockIds.length,
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
  return objectList;
};

export const getFilteredData = async (
  dispatch,
  setData,
  setLoading,
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
      page_size: 5,
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
  dispatch(setLoading(false));
};

// upload stock excel file
export const uploadStock = async (
  file,
  warehouse,
  supplier,
  dispatch,
  setUploadLoading,
  setErrors
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("warehouse_id", warehouse.id);
  formData.append("supplier_id", supplier.id);
  try {
    const response = await axios.post("/stock", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    dispatch(setErrors(response.data.errors));
    dispatch(setUploadLoading(false));

    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(setUploadLoading(false));
    return 500;
  }
};

export const exportStock = async (
  warehouse,
  supplier,
  selectedTimeFrom,
  selectedTimeTo,
  setSelectedSupplier,
  setSelectedWarehouse
) => {
  console.log(selectedTimeFrom, selectedTimeTo);
  const response = await axios.post(
    "/export",
    {
      warehouse_id: warehouse.id,
      supplier_id: supplier.id,
      date_from: selectedTimeFrom,
      date_to: selectedTimeTo,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  // the filename you want
  a.download = "exported_file.xlsx";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);

  setSelectedSupplier(null);
  setSelectedWarehouse(null);
};
