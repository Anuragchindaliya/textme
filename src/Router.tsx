import React from "react"
import { Routes, Route } from "react-router-dom"
import About from "./pages/About"
import PublicLayout from "./pages/PublicLayout/PublicLayout"
import Home from "./pages/Home/Home"
import DashboardPage from "./pages/Dashboard/page"
import TaskPage from "./pages/Tasks/page"
import DashboardLayout from "./pages/DashboardLayout"
import SettingsProfilePage from "./pages/Forms/page"
import SettingsLayout from "./pages/Forms/layout"
import SettingsAccountPage from "./pages/Forms/account/page"
import SettingsAppearancePage from "./pages/Forms/appearance/page"
import SettingsNotificationsPage from "./pages/Forms/notifications/page"
import SettingsDisplayPage from "./pages/Forms/display/page"
import MusicPage from "./pages/music/page"

import { LoginPage } from "./pages/Login/page"
import AuthenticationPage from "./pages/authentication/page"
import PlaygroundPage from "./pages/playground/page"
import Notes from "./pages/Notes/page"

const Router = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={"/"} element={<Home />} />
        <Route path={"/about"} element={<About />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/register"} element={<AuthenticationPage />} />
        <Route path={"/notes"} element={<Notes />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path={"/dashboard"} element={<DashboardPage />} />
        <Route path={"/tasks"} element={<TaskPage />} />
        <Route path={"/playground"} element={<PlaygroundPage />} />
        <Route path={"/music"} element={<MusicPage />} />
        <Route element={<SettingsLayout />}>
          <Route path={"/settings"} element={<SettingsProfilePage />} />
          <Route path={"/settings/account"} element={<SettingsAccountPage />} />
          <Route
            path={"/settings/appearance"}
            element={<SettingsAppearancePage />}
          />
          <Route
            path={"/settings/notifications"}
            element={<SettingsNotificationsPage />}
          />
          <Route path={"/settings/display"} element={<SettingsDisplayPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default Router
