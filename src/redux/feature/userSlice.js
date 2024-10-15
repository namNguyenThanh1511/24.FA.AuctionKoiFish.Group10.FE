import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, actions) => {
      state = actions.payload;
      return state;
    },
    logout: () => {
      return null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (store) => store.user;
export default userSlice;
