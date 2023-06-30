import { configureStore } from '@reduxjs/toolkit';
import user from './userSlice';
import { api } from './api';

export const store = configureStore({
  reducer: { user, [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
