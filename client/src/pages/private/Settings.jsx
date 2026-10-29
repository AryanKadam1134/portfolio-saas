import { useNavigate } from "react-router-dom";
import { FingerprintPattern, LockKeyholeOpen, Trash2 } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DeleteUserModal from "../../components/settings/DeleteUserModal";

import { useModal } from "../../context/modal/useModal";

export default function Settings() {
  const { openModal } = useModal();

  const navigate = useNavigate();

  const openDeleteConfirmation = () => {
    openModal(
      "Delete Account",
      <Trash2 size={24} />,
      <DeleteUserModal />,
      "bg-red-500",
    );
  };

  return (
    <div className="flex flex-col gap-6 text-sm">
      <PageHeader
        heading="Settings"
        subHeading="Manage your password, active sessions, and account"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            name: "Change Password",
            icon: LockKeyholeOpen,
            onClick: () => navigate("change-password"),
          },
          {
            name: "Active Sessions",
            icon: FingerprintPattern,
            onClick: () => navigate("user-sessions"),
          },
          {
            name: "Delete Account",
            icon: Trash2,
            onClick: openDeleteConfirmation,
          },
        ].map(({ name, icon, onClick }, idx) => {
          const Icon = icon;

          return (
            <button
              key={name || idx}
              onClick={onClick}
              type="button"
              className="group min-h-36 rounded-2xl border border-light-border-primary bg-light-bg-primary p-5 text-left text-light-text-primary shadow-[0_12px_40px_-28px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-light-border-secondary hover:shadow-lg dark:border-dark-border-primary dark:bg-dark-bg-primary dark:text-dark-text-primary dark:hover:border-dark-border-secondary"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-light-bg-secondary text-light-text-primary transition-colors group-hover:bg-light-bg-tertiary dark:bg-dark-bg-secondary dark:text-dark-text-primary dark:group-hover:bg-dark-bg-tertiary">
                <Icon size={20} />
              </div>
              <p className="font-semibold">{name}</p>
              <p className="mt-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Manage your {name.toLowerCase()} settings
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
