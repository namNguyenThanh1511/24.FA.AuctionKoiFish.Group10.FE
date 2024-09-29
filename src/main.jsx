import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Import App component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
