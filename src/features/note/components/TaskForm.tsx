import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TaskFormProps {
  onAddTask: (title: string) => void
}
const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim())
      setTitle("")
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 p-2 rounded-lg shadow dark:bg-gray-700"
        placeholder="Add a task..."
      />
      <button
        type="submit"
        className={`ml-4 p-2 rounded-lg bg-blue-500 text-white dark:bg-blue-200 font-semibold dark:text-gray-900`}
      >
        Add Task
      </button>
    </form>
  )
}
export default TaskForm
