import React, { useEffect, useState } from "react"
import TaskList from "./components/TaskList"
import { v4 as uuid } from "uuid"
import TaskForm from "./components/TaskForm"
import { TaskType } from "./task.types"
import { Droppable, DroppableProps } from "react-beautiful-dnd"
import { statuses } from "./utils"

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}
const Task = () => {
  const [tasks, setTasks] = useState<TaskType[]>([])

  const handleAddTask = (title: string) => {
    const newTask = {
      id: uuid(),
      title,
      status: statuses[1],
    }

    setTasks((prevTasks) => [...prevTasks, newTask])
  }
  const handleToggleTaskStatus = (taskId: string) => {
    return (statusValue: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status:
                  statuses.find((status) => status.value === statusValue) ||
                  null,
              }
            : task,
        ),
      )
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newTasks = Array.from(tasks)
    const [reorderedTask] = newTasks.splice(result.source.index, 1)
    newTasks.splice(result.destination.index, 0, reorderedTask)

    setTasks(newTasks)
  }

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
