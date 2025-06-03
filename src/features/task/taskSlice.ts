import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaskType } from "./task.types"
import { statuses } from "./utils"

const initialState: TaskType[] = []

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    loadTasks(state, action: PayloadAction<TaskType[]>) {
      return action.payload
    },
    addTask(state, action: PayloadAction<{ title: string }>) {
      const newTask: TaskType = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        status: statuses[1].value, // Default status
      }
      state.unshift(newTask)
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const task = state.find((t) => t.id === action.payload.id)
      if (task) task.status = action.payload.status
    },
    deleteTask(state, action: PayloadAction<string>) {
      return state.filter((t) => t.id !== action.payload)
    },
    reorderTasks(state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) {
      const [movedTask] = state.splice(action.payload.oldIndex, 1)
      state.splice(action.payload.newIndex, 0, movedTask)
    },
  },
})

export const { addTask, updateTaskStatus, deleteTask, reorderTasks, loadTasks } = taskSlice.actions
export default taskSlice.reducer
