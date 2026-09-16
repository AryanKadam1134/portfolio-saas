import React, { useState } from "react";

import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col w-full overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 p-6 sm:p-8 h-full bg-light-bg-secondary dark:bg-dark-bg-secondary overflow-y-auto">
          <div className="max-w-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
