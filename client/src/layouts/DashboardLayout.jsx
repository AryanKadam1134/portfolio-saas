import React, { useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-col w-full overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 h-full overflow-y-auto px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-[1480px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
