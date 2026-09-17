import React from "react";

import { Loader, Trash2 } from "lucide-react";

import ActionButton from "../ui/ActionButton";

export default function CoverImage({ image = {}, imageDeleting, deleteImage }) {
  const { url } = image;

  return (
    <div className="relative group h-35 rounded-md overflow-hidden border border-light-border-secondary dark:border-dark-border-secondary">
      {/* Loader */}
      {imageDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={24} className="animate-spin text-white" />
        </div>
      )}

      {url ? (
        <>
          <img src={url} alt="" className="w-full h-full object-contain" />

          {/* Delete Button (Hover Only) */}
          <ActionButton
            type="button"
            variant="red"
            icon={Trash2}
            onClick={deleteImage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-light-text-tertiary dark:text-dark-text-tertiary">
          Upload image to see here
        </div>
      )}
    </div>
  );
}
