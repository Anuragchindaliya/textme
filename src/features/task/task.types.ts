import { LucideIcon } from "lucide-react"

export type Status = {
  id: string
  value: string
  label: string
  icon?: LucideIcon
}
export interface TaskType {
  id: string
  title: string
  status: string | null
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
