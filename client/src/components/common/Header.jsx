import React from "react";

import { Menu, Sparkles } from "lucide-react";

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
    <div className="z-10 flex h-[70px] w-full shrink-0 items-center justify-between border-b border-light-border-primary bg-light-bg-primary/90 px-4 text-light-text-primary shadow-[0_4px_24px_-20px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-dark-border-primary dark:bg-dark-bg-primary/90 dark:text-dark-text-primary sm:px-7 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl p-2.5 text-light-text-secondary transition hover:bg-light-bg-secondary dark:text-dark-text-secondary dark:hover:bg-dark-bg-secondary md:hidden"
        >
          <Menu size={21} />
        </button>
        <div className="hidden items-center gap-2 rounded-full bg-light-bg-secondary px-3 py-1.5 text-xs font-medium text-light-text-primary dark:bg-dark-bg-secondary dark:text-dark-text-primary sm:flex">
          <Sparkles size={14} />
          <span>Build a portfolio you’re proud of</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="mt-1 text-[11px] text-light-text-tertiary dark:text-dark-text-tertiary">
            {dayName}, {dateNum}
          </p>
        </div>

        <ThemeToggleButton />

        <div className="relative overflow-hidden rounded-full border-2 border-white shadow-md shadow-black/10 ring-1 ring-light-border-primary dark:border-dark-bg-tertiary dark:ring-dark-border-primary">
          <img
            src={user?.image?.url || defaultProfileImage}
            alt="User profile"
            className="size-10 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
