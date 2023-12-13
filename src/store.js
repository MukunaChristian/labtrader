import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./reducers/AppSlice";
import UserSlice from "./reducers/UserSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    user: UserSlice,
  },
});

export default store;
