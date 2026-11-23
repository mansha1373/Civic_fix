import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "leaflet/dist/leaflet.css"
import "./styles/civicfix.css"
import "./styles/motion.css"
import "./styles/footer.css"
import "./styles/auth.css"
import "./styles/readability.css"
import "./styles/map.css"
import "./styles/dashboard.css"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
