import React, { useRef, useState } from "react";

import { Loader, FileText } from "lucide-react";

export default function DragDropUpload({
  onChange,
  loading = false,
  text = "Drop files here",
  className = "",
  ...props // ✅ accept multiple, accept, etc.
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    onChange?.(files); // ✅ always pass FileList
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current.click()}
        className={`max-h-35 w-full px-4 py-6 flex flex-col items-center justify-center gap-3
        text-center border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary
        ${isDragging && "bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border-secondary dark:border-dark-border-secondary"}
        ${!loading && "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"}
        ${className} rounded-md cursor-pointer transition-all duration-200`}
      >
        {loading ? (
          <Loader
            size={24}
            className="text-light-text-primary dark:text-dark-text-primary animate-spin"
          />
        ) : (
          <>
            <FileText
              size={24}
              className="text-light-text-tertiary dark:text-dark-text-tertiary"
            />

            <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium">
              <p>{text}</p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                OR
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Click to browse
              </p>
            </div>
          </>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        {...props} // ✅ multiple, accept, etc.
      />
    </>
  );
}
