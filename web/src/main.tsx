import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SmoothScroll } from "./components/ui/SmoothScroll";
import "lenis/dist/lenis.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SmoothScroll />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
