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

export default function Toast({ toast, onRemove }) {
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

  return (
    <div
      className={`notification-toast ${positionClass} ${isClosing ? "notification-toast--closing" : ""}
      p-4 w-[calc(100vw-2rem)] sm:w-96 flex ${description ? "items-start" : "items-center"} gap-3
      text-light-text-primary dark:text-dark-text-primary
      bg-light-bg-primary dark:bg-dark-bg-tertiary
      border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-lg
      pointer-events-auto`}
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
