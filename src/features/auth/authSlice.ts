import { RootState } from "@/app/store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
const authKey = "userInfo"
const getLocalData = () => {
  const item = localStorage?.getItem(authKey);
  try {
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Failed to parse JSON from localStorage:", e);
    return null;
  }
}
const localData = getLocalData() || {}
const initialState = {
  email: localData?.email || "",
  id: localData?.id || "",
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (
      state,
      { payload: { email, id } }: PayloadAction<{ email: string; id: string }>,
    ) => {
      state.email = email
      state.id = id
    },
    removeAuth: (state) => {
      localStorage.removeItem(authKey)
      state.email = ""
      state.id = ""
    },
  },
})
export default authSlice.reducer
export const { setEmail, removeAuth } = authSlice.actions

export const selectCurrentEmail = (state: RootState) => state.auth.email
