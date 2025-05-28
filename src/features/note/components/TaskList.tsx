// Updated TaskList.tsx using dnd-kit
import React from "react"
import { TaskType } from "../task.types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableItem } from "./SortableItem"
import { ComboboxPopover } from "./StatusPopover"
import { ComboboxDropdownMenu } from "./MoreOption"

interface TaskListProps {
  tasks: TaskType[]
  onDragEnd: (event: any) => void
  onToggleStatus: (taskId: string) => (statusValue: string) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDragEnd, onToggleStatus }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              <li className="flex items-center justify-between px-4 rounded-lg shadow bg-white dark:bg-gray-800">
                <span className="flex-1">{task.title}</span>
                <ComboboxPopover
                  selectedStatus={task.status}
                  setSelectedStatus={onToggleStatus(task.id)}
                />
                <ComboboxDropdownMenu />
              </li>
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

export default TaskList
