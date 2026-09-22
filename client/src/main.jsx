import { createRoot } from "react-dom/client";
import "./index.css";
import "./notification.css";
import App from "./App.jsx";

import { ThemeProvider } from "./context/theme/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
