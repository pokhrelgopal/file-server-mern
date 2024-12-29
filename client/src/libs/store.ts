import { configureStore } from "@reduxjs/toolkit";
import { keyApi } from "./features/keyApi";
import { fileApi } from "./features/fileApi";
import keyReducer from "./features/keySlice";
import { userApi } from "./features/userApi";

export const store = configureStore({
  reducer: {
    [keyApi.reducerPath]: keyApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    key: keyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      keyApi.middleware,
      fileApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Appstore = typeof store;
