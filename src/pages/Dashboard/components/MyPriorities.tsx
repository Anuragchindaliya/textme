import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, CheckSquare, Square } from "lucide-react"
import {
  useGetAssignedTasksQuery,
  useUpdateTaskMutation,
} from "@/features/task/tasksApi"
import { useAppSelector } from "@/app/hooks"
import { selectCurrentEmail, selectCurrentId } from "@/features/auth/authSlice" // Assuming we use email/id
import { Button } from "@/components/ui/button"

export function MyPriorities() {
  // Assuming we have a way to get ID, using email for now or hardcoded '1' for mock
  const userId = useAppSelector(selectCurrentId)
  console.log({ userId })
  const { data: tasks, isLoading } = useGetAssignedTasksQuery(userId)
  const [updateTask] = useUpdateTaskMutation()

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done"
    updateTask({ id, status: newStatus as any })
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>My Priorities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:bg-accent ${
                  task.status === "done" ? "opacity-50" : ""
                }`}
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleToggleStatus(task.id, task.status)}
                    >
                      {task.status === "done" ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                    <span
                      className={`text-sm font-medium ${
                        task.status === "done" ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <Badge
                      variant={
                        task.priority === "urgent" ? "destructive" : "secondary"
                      }
                      className="text-[10px] px-1 py-0 uppercase"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground ml-8">
                    {task.id}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {task.status.replace("_", " ")}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            {(!tasks || tasks.length === 0) && (
              <div className="text-center text-muted-foreground">
                No tasks assigned.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
