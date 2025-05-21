import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import executiveReducer from './slices/executiveSlice';
import salesReducer from './slices/salesSlice';
import clientReducer from './slices/clientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    executive: executiveReducer,
    sales: salesReducer,
    client: clientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 