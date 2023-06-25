import React from "react"
import { TaskType } from "../task.types"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../Note"
import { ComboboxPopover } from "./StatusPopover"
import { colorClassConfig } from "../utils"
import { ComboboxDropdownMenu } from "./MoreOption"

interface TaskListProps {
  tasks: TaskType[]
  onDragEnd: (result: any) => void
  onToggleStatus: (taskId: string) => (statusValue: string) => void
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDragEnd,
  onToggleStatus,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="taskList">
        {(provided) => (
          <ul
            className="space-y-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center justify-between px-4 rounded-lg shadow bg-white dark:bg-gray-800`}
                  >
                    <span
                      className={`flex-1 
                                            `}
                      // ${task.status ? 'line-through text-green-600' : ''}
                    >
                      {task.title}
                    </span>
                    <ComboboxPopover
                      selectedStatus={task.status}
                      setSelectedStatus={onToggleStatus(task.id)}
                    />
                    <ComboboxDropdownMenu />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
export default TaskList
