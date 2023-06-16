import React from 'react'
import { MainNav } from './Dashboard/components/main-nav'
import { Outlet } from 'react-router-dom'
import TeamSwitcher from './Dashboard/components/team-switcher'
import { Search } from './Dashboard/components/search'
import { UserNav } from './Dashboard/components/user-nav'

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
            <Outlet />
        </>
    )
}

export default DashboardLayout