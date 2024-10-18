import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
