import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";
import {
  Award,
  Briefcase,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Layers,
  LogOut,
  Settings,
  Share2,
  Trophy,
  User,
  Zap,
} from "lucide-react";

import AppLogo from "./AppLogo";

import { useAuth } from "../../context/auth/useAuth";

const menus = [
  { name: "User Details", path: "/details", icon: User },
  { name: "Social Platforms", path: "/social", icon: Share2 },
  { name: "Skills", path: "/skills", icon: Zap },
  { name: "Skill Categories", path: "/skill-categories", icon: Layers },
  { name: "Projects", path: "/projects", icon: FolderOpen },
  { name: "Experience", path: "/experiences", icon: Briefcase },
  { name: "Education", path: "/educations", icon: GraduationCap },
  { name: "Certificates", path: "/certificates", icon: Award },
  { name: "Achievements", path: "/achievements", icon: Trophy },
];

const menuStyle =
  "group relative flex min-w-0 items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all duration-200";

function NavItem({ menu, onClick }) {
  const Icon = menu.icon;

  return (
    <NavLink
      to={menu.path}
      onClick={onClick}
      className={({ isActive }) =>
        `${menuStyle} ${
          isActive
            ? "bg-light-bg-tertiary font-medium text-light-text-primary dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
            : "text-light-text-secondary hover:bg-light-bg-hover hover:text-light-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg-hover dark:hover:text-dark-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          <span className="truncate">{menu.name}</span>
        </>
      )}
    </NavLink>
  );
}

export default function SideBar({ isOpen, onClose }) {
  const { logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-69 flex-col border-r border-light-border-primary
          bg-light-bg-primary dark:border-dark-border-primary dark:bg-dark-bg-primary
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="flex h-17.5 shrink-0 items-center border-b border-light-border-primary px-5 dark:border-dark-border-primary">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary">
              <AppLogo className="size-7 object-contain" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-light-text-primary dark:text-dark-text-primary">
                Profilo
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-light-text-primary dark:text-dark-text-primary">
                Portfolio studio
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-3 px-3 py-5 overflow-auto">
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-light-text-tertiary dark:text-dark-text-tertiary">
              Manage your portfolio
            </p>
            <nav className="flex flex-col gap-1">
              {menus.map((menu) => (
                <NavItem key={menu.name} menu={menu} onClick={onClose} />
              ))}
            </nav>
          </div>

          <div className="pt-3 flex flex-col gap-1 border-t border-light-border-primary dark:border-dark-border-primary">
            <NavItem
              menu={{ name: "Settings", path: "/settings", icon: Settings }}
              onClick={onClose}
            />

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className={`${menuStyle} w-full
                text-red-600 hover:text-red-700 hover:bg-red-50
                dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 dark:hover:bg-opacity-30
                cursor-pointer`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
