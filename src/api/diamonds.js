import axios from "axios";
import { transformedList } from "../data/getDiamondData";

export const diamonds = async (dispatch, setData, setLoading) => {
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
  console.log(response.data.items.length);
  dispatch(setData(objectList));
  dispatch(setLoading(false));
};

// upload stock excel file
export const uploadStock = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/stock", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  return response.data;
};
