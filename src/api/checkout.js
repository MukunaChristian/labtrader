import axios from "axios";

export const checkout = async (data) => {
  const response = await axios.post("/checkout", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  return response.data;
};
