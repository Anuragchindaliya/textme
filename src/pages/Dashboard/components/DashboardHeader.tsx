import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Plus, Search } from "lucide-react"
import { useAppSelector } from "@/app/hooks"
import { selectCurrentEmail } from "@/features/auth/authSlice"

export function DashboardHeader() {
  const email = useAppSelector(selectCurrentEmail)
  const name = email ? email.split("@")[0] : "User"

  return (
    <div className="flex items-center justification-between space-y-2 border-b p-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight">
          Good Morning, {name}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, projects..."
            className="w-[200px] pl-8 lg:w-[300px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New Project</DropdownMenuItem>
            <DropdownMenuItem>New Task</DropdownMenuItem>
            <DropdownMenuItem>Invite Member</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
