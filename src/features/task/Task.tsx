import React, { useEffect, useState } from "react"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { addTask, loadTasks, reorderTasks, updateTaskStatus } from "./taskSlice"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./components/data-table-faceted-filter"
import { statuses } from "./utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const Task = () => {
  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  // console.log({ searchTerm, selectedStatus, tasks })

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

  const filtertedTask = tasks.filter((task) => {
    if (searchTerm && selectedStatus.length > 0) {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        task.status &&
        selectedStatus.includes(task.status)
      )
    } else if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase())
    } else if (selectedStatus.length > 0 && task.status) {
      return selectedStatus.includes(task.status)
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      {/* <p className="mb-6">
        Manage your tasks efficiently with drag and drop functionality.
      </p> */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-6 mb-4">
          <div className="flex-1">
            <TaskForm onAddTask={handleAddTask} />
          </div>
          <div className="flex-1 flex items-center space-x-2 mt-4">
          <Input
            placeholder="Filter tasks..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px] flex-1"
          />
          <DataTableFacetedFilter
            selectedValues={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            tasks={tasks.filter((task) =>
              task.title.toLowerCase().includes(searchTerm.toLowerCase()),
            )}
            title="Status"
            options={statuses}
          />
          {selectedStatus?.length ? (
            <Button
              variant="ghost"
              onClick={() => setSelectedStatus([])}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
          </div>
        </div>
      </div>

      <TaskList
        tasks={filtertedTask}
        onDragEnd={handleDragEnd}
        onToggleStatus={handleToggleTaskStatus}
      />
    </div>
  )
}

export default Task
