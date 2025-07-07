import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ActiveFormProvider } from "./contexts/ActiveFormContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ActiveFormProvider>
      <App />
    </ActiveFormProvider>
  </StrictMode>
);
