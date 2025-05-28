import React, { useEffect } from "react"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { addTask, loadTasks, reorderTasks, updateTaskStatus } from "./taskSlice"

const Task = () => {
  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks)

  const handleAddTask = (title: string) => {
    dispatch(addTask({ title }))
  }

  const handleToggleTaskStatus = (taskId: string) => (statusValue: string) => {
    dispatch(updateTaskStatus({ id: taskId, status: statusValue }))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    dispatch(reorderTasks({ oldIndex, newIndex }))
  }

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      dispatch(loadTasks(JSON.parse(storedTasks)))
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <TaskList
        tasks={tasks}
        onDragEnd={handleDragEnd}
        onToggleStatus={handleToggleTaskStatus}
      />
      <TaskForm onAddTask={handleAddTask} />
    </div>
  )
}

export default Task
