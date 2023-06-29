import { combineReducers } from "@reduxjs/toolkit"
import counterSlice from "./counter/counterSlice"
// import noteSlice from "./note/noteSlice"
import { textmeApi } from "@/app/services"

const rootReducer = combineReducers({
  counter: counterSlice,
  [textmeApi.reducerPath]: textmeApi.reducer,
  // note: noteSlice,
})
export default rootReducer
