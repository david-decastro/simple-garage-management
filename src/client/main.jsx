import "./index.css"; // Global styles
import "./plugins/i18n.js"; // Internationalization
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppStore } from "./stores/AppStore.jsx";

/* Roboto fonts for MUI modal windows */
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")).render(
  <AppStore>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppStore>
);
