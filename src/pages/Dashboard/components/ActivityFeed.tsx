import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const recentActivity = [
  {
    user: { name: "Sarah", src: "/avatars/01.png" },
    action: "moved",
    target: "Database Setup",
    to: "Done",
    time: "2m ago",
  },
  {
    user: { name: "Alex", src: "/avatars/02.png" },
    action: "commented on",
    target: "Task #402",
    time: "15m ago",
  },
  {
    user: { name: "Maria", src: "/avatars/03.png" },
    action: "created",
    target: "New Marketing Campaign",
    time: "1h ago",
  },
  {
    user: { name: "Bob", src: "/avatars/04.png" },
    action: "archived",
    target: "Old Project",
    time: "3h ago",
  },
]

export function ActivityFeed() {
  return (
    <Card className="col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.user.src} />
                  <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{item.user.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="font-medium">{item.target}</span>
                    {item.to && (
                      <span className="text-muted-foreground">
                        {" "}
                        to {item.to}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
