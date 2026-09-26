import { createRoot } from "react-dom/client";
import "./index.css";
import "./notification.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, theme as antdTheme } from "antd";

import App from "./App.jsx";

import { useTheme } from "./context/theme/useTheme.js";

import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { ModalProvider } from "./context/modal/ModalProvider.jsx";
import { ThemeProvider } from "./context/theme/ThemeProvider.jsx";
import { NotificationProvider } from "./context/notification/NotificationProvider.jsx";

export default function AppConfiguration() {
  const { theme } = useTheme();

  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Poppins, sans-serif",
        },
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <NotificationProvider>
        <ModalProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <App />
            </GoogleOAuthProvider>
          </AuthProvider>
        </ModalProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AppConfiguration />
  </ThemeProvider>,
);
