import { combineReducers } from "@reduxjs/toolkit"
import counterSlice from "./counter/counterSlice"
// import noteSlice from "./note/noteSlice"
import { textmeApi } from "@/app/services"
import authSlice from "./auth/authSlice"
import cartSlice from "./products/cartSlice"
import dynamicFormSlice from "./dynamicForm/dynamicFormSlice"
import taskReducer from "./task/taskSlice"

const rootReducer = combineReducers({
  counter: counterSlice,
  [textmeApi.reducerPath]: textmeApi.reducer,
  auth: authSlice,
  products:cartSlice,
  dynamicForm:dynamicFormSlice,
  tasks: taskReducer,
  // note: noteSlice,
})
export default rootReducer
