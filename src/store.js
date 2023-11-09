import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./reducers/AppSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export default store;
