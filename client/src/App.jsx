import React, { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, theme as antdTheme } from "antd";

import Authentication from "./pages/authentication/Authentication";
import ResetPassword from "./pages/authentication/ResetPassword";
import ForogtPassword from "./pages/authentication/ForogtPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/private/Dashboard";

import SocialPlatforms from "./pages/private/social-platforms/SocialPlatforms";
import AddEditSocialPlatform from "./pages/private/social-platforms/AddEditSocialPlatform";

import Skills from "./pages/private/skills/Skills";
import AddEditSkills from "./pages/private/skills/AddEditSkills";

import SkillCategories from "./pages/private/skill-categories/SkillCategories";
import AddEditSkillCategory from "./pages/private/skill-categories/AddEditSkillCategory";

import Projects from "./pages/private/projects/Projects";
import AddEditProject from "./pages/private/projects/AddEditProject";

import Experiences from "./pages/private/experiences/Experiences";
import AddEditExperiences from "./pages/private/experiences/AddEditExperiences";

import Educations from "./pages/private/educations/Educations";
import AddEditEducation from "./pages/private/educations/AddEditEducation";

import Certificates from "./pages/private/certificates/Certificates";
import AddEditCertificate from "./pages/private/certificates/AddEditCertificate";

import Achievements from "./pages/private/achievements/Achievements";
import AddEditAchievement from "./pages/private/achievements/AddEditAchievement";

import Settings from "./pages/private/Settings";
import ChangePassword from "./pages/private/ChangePassword";
import UserSessions from "./pages/private/UserSessions.jsx";

import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { ModalProvider } from "./context/modal/ModalProvider.jsx";
import { NotificationsProvider } from "./context/notification/NotificationsProvider.jsx";

import { useAuth } from "./context/auth/useAuth";
import { useTheme } from "./context/theme/useTheme.js";

function SessionLoader() {
  return (
    <div className="h-screen flex items-center justify-center font-semibold text-lg text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-tertiary">
      Restoring Session...
    </div>
  );
}

function PublicRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <SessionLoader />;
  }

  // ❌ If logged in → redirect to details
  return user ? <Navigate to="/details" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <SessionLoader />;
  }

  return user ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/auth" replace />
  );
}

function CommonLayout() {
  return <Outlet />;
}

function App() {
  const { theme } = useTheme();

  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  const isDark = theme === "dark";

  useEffect(() => {
    const favicon = document.getElementById("favicon");
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateFavicon = (e) => {
      if (e.matches) {
        favicon.href = "/favicon_white.png";
      } else {
        favicon.href = "/favicon_black.png";
      }
    };

    // Run once on load
    updateFavicon(darkModeQuery);

    // Listen for system theme changes
    darkModeQuery.addEventListener("change", updateFavicon);

    return () => darkModeQuery.removeEventListener("change", updateFavicon);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Poppins, sans-serif",
        },
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <NotificationsProvider>
        <ModalProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <Router>
                <Routes>
                  <Route path="/" element={<Navigate to="/details" />} />

                  {/* 🔓 Public Route (only if NOT logged in) */}
                  <Route element={<PublicRoute />}>
                    <Route path="/auth" element={<Authentication />} />
                    <Route
                      path="/forgot-password"
                      element={<ForogtPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>

                  {/* 🔐 Protected Route */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/details" element={<Dashboard />} />

                    <Route path="/social" element={<CommonLayout />}>
                      <Route index element={<SocialPlatforms />} />
                      <Route path="add" element={<AddEditSocialPlatform />} />
                      <Route
                        path=":platformId/edit"
                        element={<AddEditSocialPlatform />}
                      />
                    </Route>

                    <Route path="/skills" element={<CommonLayout />}>
                      <Route index element={<Skills />} />
                      <Route path="add" element={<AddEditSkills />} />
                      <Route path=":skillId/edit" element={<AddEditSkills />} />
                    </Route>

                    <Route path="/skill-categories" element={<CommonLayout />}>
                      <Route index element={<SkillCategories />} />
                      <Route path="add" element={<AddEditSkillCategory />} />
                      <Route
                        path=":categoryId/edit"
                        element={<AddEditSkillCategory />}
                      />
                    </Route>

                    <Route path="/projects" element={<CommonLayout />}>
                      <Route index element={<Projects />} />
                      <Route path="add" element={<AddEditProject />} />
                      <Route
                        path=":projectId/edit"
                        element={<AddEditProject />}
                      />
                    </Route>

                    <Route path="/experiences" element={<CommonLayout />}>
                      <Route index element={<Experiences />} />
                      <Route path="add" element={<AddEditExperiences />} />
                      <Route
                        path=":experienceId/edit"
                        element={<AddEditExperiences />}
                      />
                    </Route>

                    <Route path="/educations" element={<CommonLayout />}>
                      <Route index element={<Educations />} />
                      <Route path="add" element={<AddEditEducation />} />
                      <Route
                        path=":educationId/edit"
                        element={<AddEditEducation />}
                      />
                    </Route>

                    <Route path="/certificates" element={<CommonLayout />}>
                      <Route index element={<Certificates />} />
                      <Route path="add" element={<AddEditCertificate />} />
                      <Route
                        path=":certificateId/edit"
                        element={<AddEditCertificate />}
                      />
                    </Route>

                    <Route path="/achievements" element={<CommonLayout />}>
                      <Route index element={<Achievements />} />
                      <Route path="add" element={<AddEditAchievement />} />
                      <Route
                        path=":achievementId/edit"
                        element={<AddEditAchievement />}
                      />
                    </Route>

                    <Route path="/settings" element={<CommonLayout />}>
                      <Route index element={<Settings />} />
                      <Route
                        path="change-password"
                        element={<ChangePassword />}
                      />
                      <Route path="user-sessions" element={<UserSessions />} />
                    </Route>
                  </Route>
                </Routes>
              </Router>
            </GoogleOAuthProvider>
          </AuthProvider>
        </ModalProvider>
      </NotificationsProvider>
    </ConfigProvider>
  );
}

export default App;
