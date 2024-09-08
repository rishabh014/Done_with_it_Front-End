import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import listingReducer from "./listings";
import conversation from "./conversation";

const reducers = combineReducers({
  auth: authReducer,
  listing: listingReducer,
  conversation: conversation,
});

const store = configureStore({ reducer: reducers });

export type RootState = ReturnType<typeof store.getState>;

export default store;
