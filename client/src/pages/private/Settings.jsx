import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { LockKeyholeOpen, Trash2 } from "lucide-react";

import DeleteUserModal from "../../components/settings/DeleteUserModal";

import { userEndpoints } from "../../services/userService";

import { useAuth } from "../../context/auth/useAuth";
import { useModal } from "../../context/modal/useModal";
import { useNotify } from "../../context/notification/useNotify";

export default function Settings() {
  const { setUser } = useAuth();
  const { notify } = useNotify();
  const { openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const deleteUser = async () => {
    setDeleting(true);
    try {
      await userEndpoints.deleteUser();
      setUser(null);
      closeModal();
    } catch (error) {
      notify.msgError(error?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirmation = () => {
    openModal(
      "Delete Account",
      <Trash2 size={24} />,
      <DeleteUserModal onConfirm={deleteUser} isDeleting={deleting} />,
      "bg-red-500",
    );
  };

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            name: "Change Password",
            icon: LockKeyholeOpen,
            onClick: () => navigate("change_password"),
          },
          {
            name: "Delete Account",
            icon: Trash2,
            onClick: openDeleteConfirmation,
          },
        ].map(({ name, icon, onClick }, idx) => {
          const Icon = icon;

          return (
            <div
              key={name || idx}
              onClick={onClick}
              className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary rounded-md cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} /> {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
