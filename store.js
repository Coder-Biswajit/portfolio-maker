import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./slices/PortfolioSlice";
export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});