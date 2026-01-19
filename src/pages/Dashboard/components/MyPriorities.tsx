import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight } from "lucide-react"

const priorities = [
  {
    id: "TASK-123",
    title: "Implement Auth Flow",
    priority: "urgent",
    status: "in_progress",
  },
  {
    id: "TASK-124",
    title: "Design Dashboard Mockups",
    priority: "high",
    status: "todo",
  },
  {
    id: "TASK-125",
    title: "Fix Navigation Bug",
    priority: "mid",
    status: "in_review",
  },
  {
    id: "TASK-126",
    title: "Update Documentation",
    priority: "low",
    status: "done",
  },
  {
    id: "TASK-127",
    title: "Setup CI/CD Pipeline",
    priority: "high",
    status: "blocked",
  },
]

export function MyPriorities() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>My Priorities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {priorities.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:bg-accent hover:cursor-pointer"
              >
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{task.title}</span>
                        <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] px-1 py-0 uppercase">
                            {task.priority}
                        </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
