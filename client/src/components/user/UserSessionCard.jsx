import {
  Check,
  Clock3,
  Laptop,
  LoaderCircle,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";

import { formatDateInAlphaNumeric } from "../../utils/formatDate";

import { authEndpoints } from "../../services/auth.service";

import useApi from "../../hooks/useApi";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

const deviceIcons = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const getDeviceIcon = (deviceType) => {
  const Icon = deviceIcons[deviceType] || Laptop;
  return <Icon size={20} />;
};

export default function UserSessionCard({ session, onDelete }) {
  const { notify } = useNotify();
  const { deviceId, setUser } = useAuth();

  const { loading, callApi } = useApi();

  const { _id, userAgent } = session || {};
  const { browser, device, os } = userAgent || {};

  const isCurrentSession = session.deviceId === deviceId;
  const isRemoving = loading.deleting;

  const removeSession = () => {
    callApi("deleting", () => authEndpoints.removeSession({ sessionId: _id }), {
      onSuccess: (res) => {
        const isCurrentSession = res.data?.isCurrentSession;

        if (isCurrentSession) {
          setUser(null);
          return;
        }

        onDelete();
        notify.success({
          title: res?.message || "Session removed!",
        });
      },
      onError: (error) => {
        notify.error({ title: error?.message || "Failed to remove session!" });
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-md border border-light-border-primary bg-light-bg-primary p-5 shadow-sm dark:border-dark-border-primary dark:bg-dark-bg-tertiary">
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
            <Clock3 size={14} /> {formatDateInAlphaNumeric(session.createdAt)}
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
        onClick={removeSession}
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
}
