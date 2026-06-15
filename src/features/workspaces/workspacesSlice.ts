import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@/app/store"

interface WorkspacesState {
  currentWorkspaceId: string | null
}

const initialState: WorkspacesState = {
  currentWorkspaceId: "1", // Defaulting to '1' for now, ideally retrieved from localStorage or user prefs
}

const workspacesSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload
    },
  },
})

export const { setCurrentWorkspace } = workspacesSlice.actions

export const selectCurrentWorkspaceId = (state: RootState) =>
  state.workspaces.currentWorkspaceId

export default workspacesSlice.reducer
