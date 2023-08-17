import { RootState } from "@/app/store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
const initialState = {
  email: "",
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (
      state,
      { payload: { email } }: PayloadAction<{ email: string }>,
    ) => {
      state.email = email
    },
  },
})
export default authSlice.reducer
export const { setEmail } = authSlice.actions

export const selectCurrentEmail = (state: RootState) => state.auth.email
