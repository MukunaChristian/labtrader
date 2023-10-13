import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./reducers/appSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export default store;
