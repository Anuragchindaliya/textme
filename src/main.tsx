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
ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="244577747421-d53sbnmu7b7nd3ps87h8glv3t2qspnd8.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
      <TooltipProvider>
        <ThemeProvider attribute="class">
          <Provider store={store}>
            <App />
            <Toaster />
          </Provider>
        </ThemeProvider>
      </TooltipProvider>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>,
)
