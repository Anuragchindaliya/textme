import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react"
import { Status } from "./task.types"
export const colorClassConfig = {
  backlog: "bg-blue-200 dark:bg-blue-700",
  todo: "bg-yellow-200 dark:bg-yellow-700",
  in_progress: "bg-green-200 dark:bg-green-700",
  done: "bg-teal-200 dark:bg-teal-700",
  canceled: "bg-red-200 dark:bg-red-700",
}
export const statusConfig: { [key: string]: Status } = {
  backlog: {
    id: "backlog",
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  todo: {
    id: "todo",
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  progress: {
    id: "progress",
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  done: {
    id: "done",
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  canceled: {
    id: "canceled",
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
}
export const statuses: Status[] = [
  {
    id: "backlog",
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    id: "todo",
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    id: "progress",
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    id: "done",
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    id: "canceled",
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
]
