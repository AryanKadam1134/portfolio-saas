import React from "react";

import { Menu } from "lucide-react";

import ThemeToggleButton from "./ThemeToggleButton";

import { useAuth } from "../../context/auth/useAuth";

import defaultProfileImage from "../../assets/profile.png";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  const now = new Date();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[now.getDay()];
  const dateNum = now.getDate();

  return (
    <div
      className="shrink-0 h-16 w-full px-5 sm:px-8 flex items-center justify-between
        bg-light-bg-primary dark:bg-dark-bg-primary
        border-b border-light-border-primary dark:border-dark-border-primary
        text-light-text-primary dark:text-dark-text-primary
        shadow-sm z-10"
    >
      {/* LEFT (Mobile Menu) */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md
        hover:bg-light-bg-secondary dark:hover:bg-dark-bg-hover
        transition"
      >
        <Menu size={22} />
      </button>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Text */}
          <div className="hidden sm:flex flex-col items-end text-xs leading-tight">
            <p className="font-semibold">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {dayName}, {dateNum}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative rounded-full overflow-hidden border-2 border-light-border-primary dark:border-dark-border-primary">
            <img
              src={user?.image?.url || defaultProfileImage}
              alt="User"
              className="size-10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
