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
export const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
]
