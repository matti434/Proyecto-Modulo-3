import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import "./Componentes/Utils/I18next.js";
import { inicializarLocalStorage } from "./Componentes/Utils/inicializarLocalStorage.js";
import { initializeAdminUser } from "./db.js";
import "./estilos/variables.css";
import "./RoyaLToast.css";

inicializarLocalStorage();
initializeAdminUser();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--color-oscuro)",
          color: "var(--color-dorado)",
          border: "1px solid var(--color-dorado)",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.95rem",
          padding: "14px 18px",
        },
        success: {
          iconTheme: {
            primary: "var(--color-dorado)",
            secondary: "var(--color-oscuro)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-rojo)",
            secondary: "var(--color-oscuro)",
          },
        },
      }}
    />
    <App />
  </StrictMode>,
);
