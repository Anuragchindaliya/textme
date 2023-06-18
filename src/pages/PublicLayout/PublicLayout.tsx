import Header from "@/components/Header"
import React from "react"
import { Outlet } from "react-router-dom"
import "./PublicLayout.css"
const PublicLayout = () => {
  return (
    <div className="publicLayout">
      <Header />
      <Outlet />
    </div>
  )
}

export default PublicLayout
