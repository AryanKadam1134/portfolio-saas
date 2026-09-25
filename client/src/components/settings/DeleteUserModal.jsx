import React from "react";

import { AlertTriangle } from "lucide-react";

import CustomButton from "../ui/CustomButton";

import { useModal } from "../../context/modal/useModal";

export default function DeleteUserModal({ onConfirm, isDeleting }) {
  const { closeModal } = useModal();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Warning Icon & Title */}
      <div className="flex items-start gap-3">
        <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
            Delete Account Permanently
          </h3>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            This action cannot be undone
          </p>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
        <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
          <strong>Warning:</strong> Deleting your account will permanently
          remove all your portfolio data, including projects, experiences,
          education, certificates, achievements, and skills. This action is
          irreversible and cannot be recovered.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
        <p>Once deleted:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Your portfolio will no longer be accessible</li>
          <li>All uploaded files and images will be removed</li>
          <li>Your public profile will be unavailable</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <CustomButton
          name="Cancel"
          variant="default"
          onClick={closeModal}
          className="text-sm"
          loading={isDeleting}
        />

        <CustomButton
          name={isDeleting ? "Deleting..." : "Delete Account"}
          variant="red"
          onClick={onConfirm}
          className="text-sm"
          loading={isDeleting}
        />
      </div>
    </div>
  );
}
