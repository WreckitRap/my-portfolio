import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // No extension needed for TSX
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
