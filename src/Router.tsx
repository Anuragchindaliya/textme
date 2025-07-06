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
import QRCodeScanner from "./pages/Qrcode/Scan/QRCodeScanner"
import { QR_ROUTES } from "./pages/Qrcode/QRSidebar"
import QRCodeUploader from "./pages/Qrcode/QRCodeUploader/QRCodeUploader"
import QRLCodeScanner from "./pages/Qrcode/QRL/QRLCodeScanner"
import AddRedirectUrl from "./pages/Qrcode/QRL/AddRedirectUrl"
import Location from "./pages/Location/page"
import { FormBuilderPage } from "./pages/DynamicForm/DynamicForm"
import PreviewForm from "./pages/DynamicForm/PreviewForm"
import FormList from "./pages/DynamicForm/FormList"
import FormLayout from "./pages/DynamicForm/FormLayout"
import FormSubmissionList from "./pages/DynamicForm/FormSubmissionList"
import TaxPlan from "./pages/PlanTax/PlanTax"
import OcrApp from "./pages/OCR/Ocr"
import ReactFlow from "./pages/ReactFlow/page"
import WeatherApp from "./pages/Weather/page"
import CityWeather from "./pages/Weather/cityWeather"
import PDFEditor from "./pages/PDFEditor/page"
import ShareContent from "./pages/ShareContent/page"
export const ROUTES = {
  NOTES: "/",
  SHARE_CONTENT: "/share-content",
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
  LOCATION:"/location",
  CALENDAR: "/calendar",
  PDF: "/invoice-pdf",
  GOV_LINK: "/gov-link",
  PRODUCTS: "/products",
  CART: "/cart",
  QR_CODE: QR_ROUTES.QR_CODE,
  QR_SCAN: QR_ROUTES.QR_SCAN,
  QR_UPLOAD: QR_ROUTES.QR_UPLOAD,
  QRL_DYNAMIC: QR_ROUTES.QRL_DYNAMIC,
  FORMS:"/form-list",
  FORM_DATA:"/formdata-list",
  CREATE_FORMS:"/create-form",
  TAX_CALCULATOR:"/calculate-tax",
  OCR:"/ocr",
  REACT_FLOW:"/react-flow",
  WEATHER: "/weather",
  WEATHER_SEARCH: "/weather-search",
  PDF_EDITOR: "/pdf-editor",
} as const
const Router = () => {
  return (
    <Routes>
      <Route path={ROUTES.NOTES} element={<Notes />} />
      <Route path={ROUTES.SHARE_CONTENT} element={<ShareContent />} />
      <Route path={ROUTES.EDITOR} element={<Editor />} />
      <Route path={ROUTES.QR_CODE} element={<Qrcode />} />
      <Route path={ROUTES.QR_SCAN} element={<QRCodeScanner />} />
      <Route path={ROUTES.QR_UPLOAD} element={<QRCodeUploader />} />
      <Route path={ROUTES.QRL_DYNAMIC} element={<QRLCodeScanner />} />
      <Route path={ROUTES.QRL_DYNAMIC + "/add"} element={<AddRedirectUrl />} />
      <Route path={ROUTES.DRAW} element={<Draw />} />
      <Route path={ROUTES.LOCATION} element={<Location />} />
      <Route path={ROUTES.CALENDAR} element={<MyCalendar />} />
      <Route path={ROUTES.REACT_FLOW} element={<ReactFlow />} />
      <Route path={ROUTES.WEATHER} element={<WeatherApp />} />
      <Route path={ROUTES.WEATHER_SEARCH} element={<CityWeather />} />
      <Route path={ROUTES.PDF_EDITOR} element={<PDFEditor />} />
      <Route path={ROUTES.PDF} element={<ExportPdf />} />
        <Route path={ROUTES.FORMS} element={<FormList />} />
        <Route path={`${ROUTES.FORM_DATA}/:id`} element={<FormSubmissionList />} />
      <Route element={<FormLayout />}>
        <Route path={ROUTES.CREATE_FORMS} element={<FormBuilderPage />} />
        <Route path="/form/:id" element={<PreviewForm />} />
      </Route>

      {/* <Route path={"/sidebar"} element={<Sidebar />} /> */}
      <Route path={ROUTES.TAX_CALCULATOR} element={<TaxPlan />} />
      <Route path={ROUTES.OCR} element={<OcrApp />} />
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
