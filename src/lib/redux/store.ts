import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './slices/leadsSlice';
import authReducer from '@/lib/redux/slices/authSlice';

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 