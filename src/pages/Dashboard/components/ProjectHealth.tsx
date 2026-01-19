import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    name: "Website Redesign",
    completed: 12,
    total: 20,
    members: [
      { name: "Alice", src: "/avatars/01.png" },
      { name: "Bob", src: "/avatars/02.png" },
    ],
  },
  {
    name: "Mobile App",
    completed: 45,
    total: 100,
    members: [
      { name: "Charlie", src: "/avatars/03.png" },
      { name: "Alice", src: "/avatars/01.png" },
      { name: "Dave", src: "/avatars/04.png" },
    ],
  },
  {
    name: "Internal Tools",
    completed: 9,
    total: 10,
    members: [{ name: "Eve", src: "/avatars/05.png" }],
  },
]

export function ProjectHealth() {
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
                    <div className="font-medium">{project.name}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.completed}/{project.total} Tasks
                </div>
              </div>
              <Progress value={(project.completed / project.total) * 100} />
              <div className="flex items-center -space-x-2 overflow-hidden">
                {project.members.map((member, i) => (
                    <Avatar key={i} className="inline-block h-6 w-6 ring-2 ring-background">
                        <AvatarImage src={member.src} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
