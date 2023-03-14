// created by Yuvraj Sahu on 18-2-2023
//Reason - create slice for redux toolkit state management

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  userToken: null,
  userData: null,
};

//helps you organize all of your Redux-related logic for a given slice into a single file.
const authSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    restoreToken: (state, action) => {
      state.userToken = action.payload.token;
      state.userData = action.payload.userData;
      state.isLoading = false;
    },
    authLogin: (state, action) => {
      // console.log('===================');
      // console.log(action.payload.userData);
      // console.log(action.payload.token);
      state.userToken = action.payload.token;
      state.userData = action.payload.userData;
      state.isLoading = false;
    },
    authLogout: (state) => {
      state.userToken = null;
      state.userData = null;
    },
    setUserData: (state, action) => {
      state.userData = action.payload.userData;
    },
  },
});

export const { restoreToken, authLogin, authLogout } = authSlice.actions;

export default authSlice.reducer;
