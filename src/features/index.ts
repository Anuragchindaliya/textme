import { combineReducers } from "@reduxjs/toolkit"
import counterSlice from "./counter/counterSlice"
// import noteSlice from "./note/noteSlice"
import { nodeBaseApi, textmeApi } from "@/app/services"
import authSlice from "./auth/authSlice"
import dynamicFormSlice from "./dynamicForm/dynamicFormSlice"
import cartSlice from "./products/cartSlice"
import taskReducer from "./task/taskSlice"
import workspacesReducer from "./workspaces/workspacesSlice"

const rootReducer = combineReducers({
  counter: counterSlice,
  [textmeApi.reducerPath]: textmeApi.reducer,
  [nodeBaseApi.reducerPath]: nodeBaseApi.reducer,
  auth: authSlice,
  products:cartSlice,
  dynamicForm:dynamicFormSlice,
  tasks: taskReducer,
  workspaces: workspacesReducer,
  // note: noteSlice,
})
export default rootReducer
