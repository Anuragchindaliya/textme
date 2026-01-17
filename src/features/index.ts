import { combineReducers } from "@reduxjs/toolkit"
import counterSlice from "./counter/counterSlice"
// import noteSlice from "./note/noteSlice"
import { nodeBaseApi, textmeApi } from "@/app/services"
import authSlice from "./auth/authSlice"
import dynamicFormSlice from "./dynamicForm/dynamicFormSlice"
import cartSlice from "./products/cartSlice"
import taskReducer from "./task/taskSlice"

const rootReducer = combineReducers({
  counter: counterSlice,
  [textmeApi.reducerPath]: textmeApi.reducer,
  [nodeBaseApi.reducerPath]: nodeBaseApi.reducer,
  auth: authSlice,
  products:cartSlice,
  dynamicForm:dynamicFormSlice,
  tasks: taskReducer,
  // note: noteSlice,
})
export default rootReducer
