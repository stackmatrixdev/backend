import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { api } from "../Api/api";
import authReducer from "./authSlice"; // 👈 import authSlice

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // শুধু auth persist হবে
};

const rootReducer = combineReducers({
  auth: authReducer, // 👈 এখানে auth যোগ করো
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredActionPaths: ["register", "rehydrate"],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
