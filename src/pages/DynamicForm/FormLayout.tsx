import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const FormLayout = () => {
  useEffect(() => {
    const bootstrapLink = document.createElement("link")
    bootstrapLink.rel = "stylesheet"
    bootstrapLink.href =
      "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"

    const formioLink = document.createElement("link")
    formioLink.rel = "stylesheet"
    formioLink.href =
      "https://cdn.jsdelivr.net/npm/@formio/js/dist/formio.full.min.css"

    document.head.appendChild(bootstrapLink)
    document.head.appendChild(formioLink)

    return () => {
      document.head.removeChild(bootstrapLink)
      document.head.removeChild(formioLink)
    }
  }, [])
  return (
    <Outlet />
  )
}

export default FormLayout