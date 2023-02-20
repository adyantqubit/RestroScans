// created by Yuvraj Sahu on 18-2-2023
//Reason - create store of redux toolkit state management

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slice/AuthSlice';

export const store = configureStore({
  reducer: {
    authUser: authReducer,
  },
});

export default store;