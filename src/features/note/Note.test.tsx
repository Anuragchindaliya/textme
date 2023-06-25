import React from "react"
import { screen, render } from "@testing-library/react"
import { describe } from "vitest"
import Task from "./Note"
describe("Task", () => {
  it("should render heading", () => {
    render(<Task />)
    const heading = screen.getByRole("heading", { name: "Task Management" })
    expect(heading)?.toBeInTheDocument()
  })
})
