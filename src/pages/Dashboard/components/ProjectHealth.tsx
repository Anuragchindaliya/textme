import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGetProjectHealthQuery } from "@/features/task/tasksApi"

export function ProjectHealth() {
  const workspaceId = '1'
  const { data: healthMetrics, isLoading } = useGetProjectHealthQuery(workspaceId)

  // Fallback data if API not ready
  const projects = healthMetrics || [
      {
        projectId: "1",
        completed: 12,
        total: 20,
      }
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Project Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="font-medium">Project {project.projectId}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.completed}/{project.total} Tasks
                </div>
              </div>
              <Progress value={(project.completed / project.total) * 100} />
              <div className="flex items-center -space-x-2 overflow-hidden">
                    <Avatar className="inline-block h-6 w-6 ring-2 ring-background">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
