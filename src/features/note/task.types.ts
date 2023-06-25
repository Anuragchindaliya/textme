import { LucideIcon } from "lucide-react"

export type Status = {
  value: string
  label: string
  icon: LucideIcon
}
export interface TaskType {
  id: string
  title: string
  status: Status | null
}

export interface DragEndResult {
  draggableId: string
  type: string
  source: {
    index: number
    droppableId: string
  }
  destination: {
    index: number
    droppableId: string
  } | null
}
