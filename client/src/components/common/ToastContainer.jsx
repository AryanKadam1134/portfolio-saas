import { useCallback, useRef, useState } from "react";
import {
  X,
  Info,
  CircleAlert,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";

const toastIcons = {
  success: CheckCircle2,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

const toastStyles = {
  success: {
    icon: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  error: {
    icon: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  warning: {
    icon: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  info: {
    icon: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
};

const toastPositionClasses = {
  topLeft: "notification-toast--left",
  topCenter: "notification-toast--top",
  topRight: "notification-toast--right",
  bottomLeft: "notification-toast--left",
  bottomCenter: "notification-toast--bottom",
  bottomRight: "notification-toast--right",
};

// Swipe tuning
const SWIPE_CLOSE_DISTANCE = 100; // px dragged before it counts as a dismiss
const SWIPE_CLOSE_VELOCITY = 0.5; // px/ms - fast flicks close early

function Toast({ toast, onRemove, onPause, onResume }) {
  const {
    type,
    title,
    description,
    icon,
    position = "topRight",
    isClosing = false,
  } = toast || {};

  const Icon = icon || toastIcons[type] || Info;
  const styles = toastStyles[type] || toastStyles.info;
  const positionClass =
    toastPositionClasses[position] || toastPositionClasses.topRight;

  const toastRef = useRef(null);
  const dragState = useRef({ startX: 0, startTime: 0, dragging: false });

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipedOut, setIsSwipedOut] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false); // swipe classes active?
  const [swipeDir, setSwipeDir] = useState(1);
  const [exitDistance, setExitDistance] = useState(400);

  const handlePointerDown = useCallback(
    (e) => {
      if (e.target.closest("button")) return; // don't hijack the close button
      if (isClosing || isSwipedOut) return;

      dragState.current = {
        startX: e.clientX,
        startTime: Date.now(),
        dragging: true,
      };
      setIsDragging(true);
      setIsOverriding(true);

      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    [isClosing, isSwipedOut],
  );

  const handlePointerMove = useCallback((e) => {
    if (!dragState.current.dragging) return;

    setDragX(e.clientX - dragState.current.startX);
  }, []);

  const finishDrag = useCallback(() => {
    if (!dragState.current.dragging) return;

    const elapsed = Date.now() - dragState.current.startTime || 1;
    const velocity = Math.abs(dragX) / elapsed;

    dragState.current.dragging = false;
    setIsDragging(false);

    const shouldClose =
      Math.abs(dragX) > SWIPE_CLOSE_DISTANCE ||
      (Math.abs(dragX) > 40 && velocity > SWIPE_CLOSE_VELOCITY);

    if (shouldClose) {
      setExitDistance((toastRef.current?.offsetWidth || 400) + 100);
      setSwipeDir(dragX > 0 ? 1 : -1);
      setIsSwipedOut(true);
      onRemove?.();
      return;
    }

    if (dragX === 0) {
      // Never actually moved (a tap) - nothing to transition back from.
      setIsOverriding(false);
    } else {
      // Spring back; notification-toast--swipe-released's transition
      // animates this, and handleTransitionEnd clears the override once
      // it lands back at 0 so the CSS keyframes take over again cleanly.
      setDragX(0);
    }
  }, [dragX, onRemove]);

  const handlePointerUp = useCallback(() => finishDrag(), [finishDrag]);
  const handlePointerCancel = useCallback(() => finishDrag(), [finishDrag]);

  const handleTransitionEnd = useCallback((e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") {
      return;
    }

    if (!dragState.current.dragging) {
      setIsOverriding(false);
    }
  }, []);

  const translateX = isSwipedOut ? swipeDir * exitDistance : dragX;
  const dragOpacity = isSwipedOut
    ? 0
    : 1 - Math.min(Math.abs(dragX) / 250, 0.6);

  const swipeClasses = isOverriding
    ? `notification-toast--swipe ${
        isDragging
          ? "notification-toast--swipe-dragging"
          : "notification-toast--swipe-released"
      }`
    : "";

  return (
    <div
      ref={toastRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      style={
        isOverriding
          ? {
              "--notification-toast-drag-x": `${translateX}px`,
              "--notification-toast-drag-opacity": dragOpacity,
            }
          : undefined
      }
      className={`notification-toast ${positionClass} ${isClosing ? "notification-toast--closing" : ""} ${swipeClasses}
      p-4 w-[calc(100vw-2rem)] sm:w-96 flex ${description ? "items-start" : "items-center"} gap-3
      text-light-text-primary dark:text-dark-text-primary
      bg-light-bg-primary dark:bg-dark-bg-tertiary
      border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-lg
      pointer-events-auto ${isDragging && "select-none"}`}
    >
      {/* Icon */}
      <div
        className={`shrink-0 p-2 rounded-full ${styles.iconBg} ${styles.icon}`}
      >
        <Icon size={19} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}

        {description && (
          <p className="mt-0.5 text-xs leading-5 text-light-text-secondary dark:text-dark-text-secondary">
            {description}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 p-1
        text-light-text-tertiary dark:text-dark-text-tertiary
        hover:text-light-text-primary dark:hover:text-dark-text-primary
        hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover
        rounded-md transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const positionClasses = {
  topLeft: "top-4 left-4 items-start",
  topCenter: "top-4 left-1/2 -translate-x-1/2 items-center",
  topRight: "top-4 right-4 items-end",
  bottomLeft: "bottom-4 left-4 items-start",
  bottomCenter: "bottom-4 left-1/2 -translate-x-1/2 items-center",
  bottomRight: "bottom-4 right-4 items-end",
};

export default function ToastContainer({
  position,
  toasts,
  onRemove,
  onPause,
  onResume,
}) {
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
          onPause={() => onPause(toast.id)}
          onResume={() => onResume(toast.id)}
        />
      ))}
    </div>
  );
}
