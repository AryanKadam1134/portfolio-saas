import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

import "../src/index.css";
import { AuthContext } from "../src/context/auth/useAuth";
import { NotificationProvider } from "../src/context/notification/NotificationProvider";
import { ThemeProvider } from "../src/context/theme/ThemeProvider";
import DashboardLayout from "../src/layouts/DashboardLayout";
import AddEditExperiences from "../src/pages/private/experiences/AddEditExperiences";
import AddEditProject from "../src/pages/private/projects/AddEditProject";

const pageName = new URLSearchParams(window.location.search).get("page");
const Page = pageName === "experience" ? AddEditExperiences : AddEditProject;

export function DashboardPageOverflowFixture() {
  return (
    <ThemeProvider>
      <AuthContext.Provider
        value={{ user: { firstName: "Test", lastName: "User" }, logout() {} }}
      >
        <MemoryRouter>
          <NotificationProvider>
            <DashboardLayout>
              <Page />
            </DashboardLayout>
          </NotificationProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <DashboardPageOverflowFixture />,
);

setTimeout(() => {
  const dashboardScroller = document.querySelector(".overflow-y-auto");
  const viewportWidth = document.documentElement.clientWidth;
  const overflowingRight = Array.from(document.querySelectorAll("body *"))
    .map((element) => ({
      element,
      rect: element.getBoundingClientRect(),
    }))
    .filter(({ rect }) => rect.right > viewportWidth + 1)
    .slice(0, 5)
    .map(({ element, rect }) => ({
      tag: element.tagName,
      className: element.className?.baseVal || element.className || "",
      right: Math.round(rect.right),
    }));
  const result = {
    page: pageName || "project",
    dashboardScrolls:
      dashboardScroller.scrollHeight > dashboardScroller.clientHeight,
    documentScrolls:
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight,
    documentOverflowPixels:
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight,
    documentOverflowXPixels:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
    overflowingRight,
    hiddenSelects: Array.from(document.querySelectorAll("select.sr-only")).map(
      (select) => {
        const rect = select.getBoundingClientRect();

        return {
          id: select.id,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          offsetParent: select.offsetParent?.tagName || null,
          offsetParentClassName:
            select.offsetParent?.className?.baseVal ||
            select.offsetParent?.className ||
            "",
        };
      },
    ),
  };
  const passed = result.dashboardScrolls && !result.documentScrolls;

  document.body.dataset.testResult = JSON.stringify(result);
  document.title = passed ? "PASS" : "FAIL";
}, 500);
