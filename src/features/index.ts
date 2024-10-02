import { combineReducers } from "@reduxjs/toolkit"
import counterSlice from "./counter/counterSlice"
// import noteSlice from "./note/noteSlice"
import { textmeApi } from "@/app/services"
import authSlice from "./auth/authSlice"
import cartSlice from "./products/cartSlice"

const rootReducer = combineReducers({
  counter: counterSlice,
  [textmeApi.reducerPath]: textmeApi.reducer,
  auth: authSlice,
  products:cartSlice
  // note: noteSlice,
})
export default rootReducer
