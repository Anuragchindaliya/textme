import { Sidebar } from "./Dashboard/components/Sidebar"
import { Outlet } from "react-router-dom"
import TeamSwitcher from "./Dashboard/components/team-switcher"
import { Search } from "./Dashboard/components/search"
import { UserNav } from "./Dashboard/components/user-nav"
import { MainNav } from "./Dashboard/components/main-nav"

const DashboardLayout = () => {
  return (
    <>
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
    <div className="flex h-[90vh] overflow-hidden">
      <Sidebar className="w-64 hidden md:block" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default DashboardLayout
