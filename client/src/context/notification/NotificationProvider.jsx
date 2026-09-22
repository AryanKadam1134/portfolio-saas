import React, { useCallback, useMemo, useRef, useState } from "react";

import Toast from "../../components/common/Toast";

import { NotificationContext } from "./useNotify";

const TOAST_EXIT_DURATION = 220;

const positionClasses = {
  topLeft: "top-4 left-4 items-start",
  topCenter: "top-4 left-1/2 -translate-x-1/2 items-center",
  topRight: "top-4 right-4 items-end",
  bottomLeft: "bottom-4 left-4 items-start",
  bottomCenter: "bottom-4 left-1/2 -translate-x-1/2 items-center",
  bottomRight: "bottom-4 right-4 items-end",
};

const positions = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

// Toast Container
const ToastContainer = ({ position, toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div
      className={`
        fixed z-9999
        flex flex-col gap-3
        w-[calc(100%-2rem)] max-w-sm
        pointer-events-none
        ${positionClasses[position]}
      `}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const timers = useRef(new Map());
  const closingToasts = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    closingToasts.current.delete(id);

    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const closeToast = useCallback(
    (id) => {
      if (closingToasts.current.has(id)) return;

      closingToasts.current.add(id);

      const timer = timers.current.get(id);

      if (timer) clearTimeout(timer);

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
    [removeToast],
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
        />
      ))}
    </NotificationContext.Provider>
  );
}
