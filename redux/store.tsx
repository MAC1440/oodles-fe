import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './services/api';
import themeSlice from './slices/themeSlice';
// Create the Redux store
const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    theme:themeSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Optional: Set up listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;