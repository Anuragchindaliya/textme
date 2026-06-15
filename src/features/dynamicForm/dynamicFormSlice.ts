import { RootState } from "@/app/store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
type InitialStateType = {
  isTourActive: boolean
}
const initialState: InitialStateType = {
  isTourActive: false,
}
const dynamicForm = createSlice({
  name: "dynamicForm",
  initialState,
  reducers: {
    startTourActive: (state) => {
      state.isTourActive = true
    },
    setIsTourActive(
      state,
      { payload: { isTourActive } }: PayloadAction<{ isTourActive: boolean }>,
    ) {
      state.isTourActive = isTourActive
    },
  },
})
export default dynamicForm.reducer
export const { startTourActive, setIsTourActive } = dynamicForm.actions

export const selectIsTourActive = (state: RootState) =>
  state.dynamicForm.isTourActive
