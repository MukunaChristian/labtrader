import { configureStore } from "@reduxjs/toolkit";
import catalogueSlice from "./reducers/catalogueSlice";
import itemSlice from "./reducers/itemSlice";
import datesSlice from "./reducers/datesSlice";
import mediaSlice from "./reducers/mediaSlice";
import userSlice from "./reducers/userSlice";

const store = configureStore({
  reducer: {
    catalogue: catalogueSlice,
    item: itemSlice,
    dates: datesSlice,
    media: mediaSlice,
    user: userSlice,
  },
});

export default store;
