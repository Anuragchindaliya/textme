import React, { useState } from "react"
import { BrowserRouter } from "react-router-dom"

import Router from "./Router"
import TourManager from "./pages/DynamicForm/TourManager"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { selectIsTourActive, setIsTourActive } from "./features/dynamicForm/dynamicFormSlice";

const App = () => {
  const dispatch = useAppDispatch()
  const isTourActive = useAppSelector(selectIsTourActive)

  return (
    <BrowserRouter>
      <TourManager
        isTourActive={isTourActive}
        setIsTourActive={(value:boolean)=>dispatch(setIsTourActive({isTourActive:value}))}
      />
      <Router />
    </BrowserRouter>
  )
}

export default App
