import React, { useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col w-full overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 px-6 py-5 sm:px-8 sm:py-7 h-full bg-light-bg-secondary dark:bg-dark-bg-secondary overflow-y-auto">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
