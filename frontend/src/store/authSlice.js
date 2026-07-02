import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  userId: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.userId = action.payload.userId;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.userId = null;
      state.isAdmin = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
