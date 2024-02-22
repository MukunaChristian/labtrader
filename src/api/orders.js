import axios from "axios";
import { set } from "lodash";

export const getOrders = async (
  dispatch,
  setData,
  setLoading,
  setAmount,
  page,
  filters
) => {
  if (setLoading) setLoading(true);
  console.log("getting orders");
  console.log(filters);
  const response = await axios.post(
    "/get_orders",
    {
      filters: filters,
      page: page,
      page_size: 20,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  console.log(response.data.orders);
  let objectList = response.data.orders;

  setData(objectList);
  if (setAmount) setAmount(response.data.count);
  if (setLoading) setLoading(false);
  return objectList;
};

export const updateStatus = async (id, status) => {
  const response = await axios.post(
    "/update_order",
    {
      id: id,
      status: status,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  console.log(response.data);
  return response.data;
};

export const updateLabel = async (id, label) => {
  const response = await axios.post(
    "/update_order",
    {
      id: id,
      label: label,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  console.log(response.data);
  return response.data;
};

export const getOrderInvoice = async (id, profoma) => {
  const response = await axios.post(
    "/get_invoice",
    {
      id: id,
      profoma: profoma,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      responseType: "blob",
    }
  );

  console.log(response.data);

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "invoice.pdf"); // or any other filename
  document.body.appendChild(link);
  link.click();

  return response.data;
};

export const getOrderInvoiceDetails = async (id) => {
  const response = await axios.post(
    "/get_invoice_details",
    {
      id: id,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};
