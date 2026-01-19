import { ROUTES } from "@/Router"
import { cn } from "@/lib/utils"
import { Link, NavLink } from "react-router-dom"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Overview
      </NavLink>
      {/* <NavLink
        to={ROUTES.PRODUCTS}
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Products
      </NavLink> */}
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Tasks
      </NavLink>
      <NavLink
        to="/playground"
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Playground
      </NavLink>
      <NavLink
        to="/music"
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Music
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn("text-sm font-medium  transition-colors hover:text-primary", {
            "text-muted-foreground": !isActive,
          })
        }
      >
        Settings
      </NavLink>
    </nav>
  )
}
