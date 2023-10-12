import axios from "axios";
import { transformedList } from "../data/getDiamondData";

export const diamonds = (dispatch, setData) => {
  return axios
    .get("/item/8868260a-42fd-450a-81a7-225a55fb70e5", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
      let objectList = response.data.items.map((str) => JSON.parse(str));
      objectList = transformedList(objectList);
      dispatch(setData(objectList));
    });
};
