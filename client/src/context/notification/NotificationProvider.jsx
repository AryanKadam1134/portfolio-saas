import React, { useCallback, useMemo, useRef, useState } from "react";

import ToastContainer from "../../components/common/ToastContainer";

import { NotificationContext } from "./useNotify";

const TOAST_EXIT_DURATION = 220;

const positions = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Active setTimeout handles - shared by the auto-dismiss timer and the
  // post-close removal timer (they never run at the same time for one id).
  const timers = useRef(new Map());
  const closingToasts = useRef(new Set());

  // Auto-dismiss bookkeeping, used to pause/resume on hover.
  const remaining = useRef(new Map()); // id -> ms left on the auto-dismiss timer
  const startedAt = useRef(new Map()); // id -> when the current countdown segment began
  const pausedToasts = useRef(new Set());

  const clearTimer = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id) => {
      setToasts((current) => current.filter((toast) => toast.id !== id));

      closingToasts.current.delete(id);
      pausedToasts.current.delete(id);
      remaining.current.delete(id);
      startedAt.current.delete(id);

      clearTimer(id);
    },
    [clearTimer],
  );

  const closeToast = useCallback(
    (id) => {
      if (closingToasts.current.has(id)) return;

      closingToasts.current.add(id);
      pausedToasts.current.delete(id);
      remaining.current.delete(id);
      startedAt.current.delete(id);

      clearTimer(id);

      setToasts((current) =>
        current.map((toast) =>
          toast.id === id ? { ...toast, isClosing: true } : toast,
        ),
      );

      const removalTimer = setTimeout(() => {
        removeToast(id);
      }, TOAST_EXIT_DURATION);

      timers.current.set(id, removalTimer);
    },
    [clearTimer, removeToast],
  );

  const pauseToast = useCallback(
    (id) => {
      if (closingToasts.current.has(id) || pausedToasts.current.has(id)) {
        return;
      }

      // No active auto-dismiss timer to pause (persistent toast, or it
      // hasn't started yet).
      if (!timers.current.has(id)) return;

      const elapsed = Date.now() - (startedAt.current.get(id) ?? Date.now());
      const timeLeft = Math.max((remaining.current.get(id) ?? 0) - elapsed, 0);

      clearTimer(id);
      remaining.current.set(id, timeLeft);
      pausedToasts.current.add(id);
    },
    [clearTimer],
  );

  const resumeToast = useCallback(
    (id) => {
      if (!pausedToasts.current.has(id)) return;

      pausedToasts.current.delete(id);

      const timeLeft = remaining.current.get(id) ?? 0;

      if (timeLeft <= 0) {
        closeToast(id);
        return;
      }

      startedAt.current.set(id, Date.now());

      const timer = setTimeout(() => {
        closeToast(id);
      }, timeLeft);

      timers.current.set(id, timer);
    },
    [closeToast],
  );

  const showToast = useCallback(
    ({
      type = "info",
      title,
      description,
      duration = 3000,
      position = "topRight",
      icon = null,
    }) => {
      const id = Math.floor(Math.random() * 1000) + 1;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          description,
          duration,
          position,
          icon,
        },
      ]);

      // duration = 0 means persistent toast
      if (duration > 0) {
        remaining.current.set(id, duration);
        startedAt.current.set(id, Date.now());

        const timer = setTimeout(() => {
          closeToast(id);
        }, duration);

        timers.current.set(id, timer);
      }

      return id;
    },
    [closeToast],
  );

  const notify = useMemo(
    () => ({
      show: showToast,

      success: (options) =>
        showToast({
          type: "success",
          ...options,
        }),

      error: (options) =>
        showToast({
          type: "error",
          ...options,
        }),

      warning: (options) =>
        showToast({
          type: "warning",
          ...options,
        }),

      info: (options) =>
        showToast({
          type: "info",
          ...options,
        }),
    }),
    [showToast],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {positions.map((position) => (
        <ToastContainer
          key={position}
          position={position}
          toasts={toasts.filter((toast) => toast.position === position)}
          onRemove={closeToast}
          onPause={pauseToast}
          onResume={resumeToast}
        />
      ))}
    </NotificationContext.Provider>
  );
}
