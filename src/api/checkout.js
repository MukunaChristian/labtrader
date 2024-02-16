import axios from "axios";

export const checkout = async (
  data,
  client_id,
  discount,
  delivery_fee,
  currency,
  deliver,
  user_id
) => {
  const response = await axios.post(
    "/checkout",
    {
      diamonds: data,
      client_id: client_id,
      discount: discount,
      delivery_fee: delivery_fee,
      currency: currency,
      deliver: deliver,
      user_id: user_id,
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

export const calculateDeliveryFee = async (data) => {
  const response = await axios.post(
    "/checkout",
    {
      diamonds: data,
      delivery_fee_check: true,
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
