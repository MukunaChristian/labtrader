import axios from "axios";

export const getOrders = async (
  dispatch,
  setData,
  setLoading,
  setAmount,
  page,
  filters
) => {
  setLoading(true);
  console.log("getting orders");
  const response = await axios.post(
    "/get_orders",
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

  console.log(response.data.orders);
  let objectList = response.data.orders;

  setData(objectList);
  setAmount(response.data.count);
  setLoading(false);
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
