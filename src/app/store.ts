import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import rootReducer from "../features"
import thunkMiddleware from "redux-thunk"
import { nodeBaseApi, textmeApi } from "./services"
export const setupStore = (preloadedState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        thunkMiddleware,
        textmeApi.middleware,
        nodeBaseApi.middleware,
      )
    },
  })
}

export const store = setupStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
