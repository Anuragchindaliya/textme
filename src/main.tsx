import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "./components/ui/Tooltip"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <ThemeProvider attribute="class">
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </TooltipProvider>
  </React.StrictMode>,
)
