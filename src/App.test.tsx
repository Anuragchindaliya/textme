import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import { TooltipProvider } from "./components/ui/Tooltip"

test("renders Task Management heading", () => {
  render(
    <TooltipProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </TooltipProvider>,
  )

  expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument()
})
