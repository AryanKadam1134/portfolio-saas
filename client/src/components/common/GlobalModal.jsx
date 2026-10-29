import React, { useEffect } from "react";

import { X } from "lucide-react";

import { useModal } from "../../context/modal/useModal";

export default function GlobalModal() {
  const { modalContent, closeModal } = useModal();

  const { isOpen, title, icon, renderContent, className } = modalContent || {};

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return;

  return (
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-black/50">
      <div className="relative max-w-[90%] max-h-[95%] bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className={`sticky top-0 flex justify-between items-center px-4 py-3 text-[16px] text-white font-semibold ${className}`}
        >
          <div className="flex items-center gap-2">
            {icon} {title}
          </div>

          <div
            onClick={closeModal}
            className="p-1 hover:backdrop-brightness-85 rounded-md cursor-pointer"
          >
            <X size={20} strokeWidth={3} className="cursor-pointer" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="place-items-center overflow-y-auto px-5 py-4 hide-scrollbar w-auto bg-light-bg-primary dark:bg-dark-bg-primary">
          {renderContent}
        </div>
      </div>
    </div>
  );
}
