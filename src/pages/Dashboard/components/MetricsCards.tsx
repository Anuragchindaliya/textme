import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertCircle, CheckCircle2, Folder } from "lucide-react"
import { useGetAssignedTasksQuery } from "@/features/task/tasksApi"
import { useAppSelector } from "@/app/hooks"
import { selectCurrentId } from "@/features/auth/authSlice"

export function MetricsCards() {
  // Mock User ID
  const userId = useAppSelector(selectCurrentId)

  const { data: tasks } = useGetAssignedTasksQuery(userId)

  const activeProjectsCount = 12 // Placeholder until project API connected
  const pendingTasksCount =
    tasks?.filter((t) => t.status !== "done").length || 0
  const overdueTasksCount = 3 // Logic needs due date comparison
  const velocity = 87 // Placeholder

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Folder className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjectsCount}</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasksCount}</div>
          <p className="text-xs text-muted-foreground">tasks waiting for you</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {overdueTasksCount}
          </div>
          <p className="text-xs text-muted-foreground">Action required</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{velocity}%</div>
          <p className="text-xs text-muted-foreground">Completion rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
