import React, { useEffect, useState } from "react";

import {
  Check,
  Clock3,
  Laptop,
  LoaderCircle,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";

import { formatDate } from "../../utils/formatDate";

import { authEndpoints } from "../../services/authService";
import { userEndpoints } from "../../services/userService";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

const deviceIcons = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

export default function UserSessions() {
  const { setUser } = useAuth();
  const { notify } = useNotify();

  const [userSessions, setUserSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingSessionId, setRemovingSessionId] = useState(null);

  const deviceId = localStorage.getItem("deviceId");

  useEffect(() => {
    const fetchUserSessions = async () => {
      try {
        const res = await userEndpoints.getUserSessions();

        setUserSessions(res.data || []);
      } catch (error) {
        if (error?.statusCode !== 404) {
          notify.msgError(error?.message || "Failed to load active sessions");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSessions();
  }, [notify]);

  const removeSession = async (sessionId) => {
    setRemovingSessionId(sessionId);

    try {
      const res = await authEndpoints.removeSession({ sessionId });
      const isCurrentSession = res.data?.isCurrentSession;

      if (isCurrentSession) {
        setUser(null);
        return;
      }

      setUserSessions((sessions) =>
        sessions.filter((session) => session._id !== sessionId),
      );
      notify.msgSuccess("Session removed successfully");
    } catch (error) {
      notify.msgError(error?.message || "Failed to remove session");
    } finally {
      setRemovingSessionId(null);
    }
  };

  const getDeviceIcon = (deviceType) => {
    const Icon = deviceIcons[deviceType] || Laptop;
    return <Icon size={20} />;
  };

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-light-text-secondary dark:text-dark-text-secondary">
          Security
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Active sessions
            </h1>
            <p className="mt-1 text-light-text-secondary dark:text-dark-text-secondary">
              Review where your account is signed in and remove access you no
              longer recognize.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-light-border-primary bg-light-bg-primary px-3 py-2 text-xs text-light-text-secondary shadow-sm dark:border-dark-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-secondary sm:flex">
            <LogOut size={15} />
            {userSessions.length} active
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-md border border-light-border-primary bg-light-bg-primary py-16 text-light-text-secondary dark:border-dark-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-secondary">
          <LoaderCircle size={20} className="mr-2 animate-spin" />
          Loading sessions...
        </div>
      )}

      {!isLoading && !userSessions.length && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-light-border-primary bg-light-bg-primary px-6 py-16 text-center dark:border-dark-border-primary dark:bg-dark-bg-tertiary">
          <div className="rounded-full bg-light-bg-secondary p-3 text-light-text-secondary dark:bg-dark-bg-secondary dark:text-dark-text-secondary">
            <Laptop size={24} />
          </div>
          <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
            No active sessions found
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Your active sign-ins will appear here.
          </p>
        </div>
      )}

      {!isLoading && userSessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {userSessions.map((session) => {
            const isCurrentSession = session.deviceId === deviceId;
            const isRemoving = removingSessionId === session._id;
            const browser = session.userAgent?.browser;
            const device = session.userAgent?.device;
            const os = session.userAgent?.os;

            return (
              <div
                key={session._id}
                className="flex flex-col gap-5 rounded-md border border-light-border-primary bg-light-bg-primary p-5 shadow-sm dark:border-dark-border-primary dark:bg-dark-bg-tertiary"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-light-bg-secondary text-light-text-primary dark:bg-dark-bg-secondary dark:text-dark-text-primary">
                      {getDeviceIcon(device?.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {browser?.name || "Unknown browser"}
                      </p>
                      <p className="truncate text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {os?.name || "Unknown operating system"}
                        {device?.type ? ` · ${device.type}` : ""}
                      </p>
                    </div>
                  </div>

                  {isCurrentSession && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Check size={13} /> Current
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 border-y border-light-border-primary py-3 text-xs dark:border-dark-border-primary">
                  <div>
                    <p className="mb-1 text-light-text-secondary dark:text-dark-text-secondary">
                      Last active
                    </p>
                    <p className="flex items-center gap-1.5 font-medium text-light-text-primary dark:text-dark-text-primary">
                      <Clock3 size={14} /> {formatDate(session.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-light-text-secondary dark:text-dark-text-secondary">
                      Sign-in preference
                    </p>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {session.rememberMe ? "Remembered" : "Temporary"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeSession(session._id)}
                  disabled={isRemoving}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
                >
                  {isRemoving ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  {isRemoving ? "Removing..." : "Remove session"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
