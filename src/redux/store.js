// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import villaReducer from "./slices/villaSlice";
import blogReducer from "./slices/blogslice";

const store = configureStore({
  reducer: {
    villa: villaReducer,
    blogs: blogReducer,
  },
});

export default store;
