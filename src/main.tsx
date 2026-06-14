import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { store } from "./app/store"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "./components/ui/Tooltip"
import { Toaster } from "./components/ui/toaster"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
    {/* <React.StrictMode> */}
    <TooltipProvider>
      <ThemeProvider attribute="class">
        <Provider store={store}>
          <App />
          <Toaster />
          <ToastContainer />
        </Provider>
      </ThemeProvider>
    </TooltipProvider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>,
)
