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
import Editor from "./pages/Editor/page"
import Draw from "./pages/Draw/page"
import MyCalendar from "./pages/Calendar/page"
import ExportPdf from "./pages/ExportPdf/page"
import GovLink from "./pages/GovLink/page"
import Products from "./pages/Products/page"
import Cart from "./pages/Cart/page"
import Qrcode from "./pages/Qrcode/page"
import QRLayout from "./pages/Qrcode/QRLayout"
import QRCodeScanner from "./pages/Qrcode/QRCodeScanner"
export const ROUTES = {
  NOTES: "/",
  TASK: "/task",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PLAYGROUND: "/playground",
  MUSIC: "/music",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "",
  EDITOR: "/editor",
  DRAW: "/draw",
  CALENDAR: "/calendar",
  PDF: "/invoice-pdf",
  GOV_LINK: "/gov-link",
  PRODUCTS: "/products",
  CART: "/cart",
  QR_CODE: "/qrcode",
  QR_SCAN: "scan",
} as const
const Router = () => {
  return (
    <Routes>
      <Route path={ROUTES.NOTES} element={<Notes />} />
      <Route path={ROUTES.EDITOR} element={<Editor />} />
      <Route path={ROUTES.QR_CODE}>
        <Route index element={<Qrcode />} />
        <Route path={ROUTES.QR_SCAN} element={<QRCodeScanner />} />
      </Route>
      <Route path={ROUTES.DRAW} element={<Draw />} />
      <Route path={ROUTES.CALENDAR} element={<MyCalendar />} />
      <Route path={ROUTES.PDF} element={<ExportPdf />} />
      <Route path={ROUTES.PDF} element={<ExportPdf />} />
      {/* <Route path={"/sidebar"} element={<Sidebar />} /> */}
      <Route path={ROUTES.GOV_LINK} element={<GovLink />} />
      <Route path={ROUTES.PRODUCTS} element={<Products />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.TASK} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={"/register"} element={<AuthenticationPage />} />
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
