import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Home from "./Home"
import Editor from "./Editor"
import DXFViewer from "./DXFViewer"

const App: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dxf-viewer" element={<DXFViewer />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
