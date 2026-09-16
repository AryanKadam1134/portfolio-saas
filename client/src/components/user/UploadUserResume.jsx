import React, { useEffect, useRef, useState } from "react";

import { FileText, Loader, Trash2 } from "lucide-react";

import { userEndpoints } from "../../services/user.service";

import { useNotify } from "../../context/notification/useNotify";

import pdfLogo from "../../assets/pdf.svg";

export default function UploadUserResume() {
  const { notify } = useNotify();

  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const fetchUserResume = async () => {
    try {
      const res = await userEndpoints.getUserResume();
      const data = res.data;

      setResume(data);
    } catch (error) {
      console.error("Error fetching User Image: ", error);
    }
  };

  const updateResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeLoading(true);

    try {
      const formData = new FormData();
      formData.append("resumeOrCv", file);

      await userEndpoints.updateUserResume(formData);

      fetchUserResume();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error updating resume:", error);
      notify.msgError(error?.message || "Failed to update resume");
    } finally {
      setResumeLoading(false);
    }
  };

  const deleteResume = async () => {
    setResumeLoading(true);

    try {
      await userEndpoints.deleteUserResume();

      setResume({});
      fetchUserResume();
      notify.msgSuccess("Resume Updated!");
    } catch (error) {
      console.error("Error deleting resume:", error);
      notify.msgError(error?.message || "Failed to delete resume");
    } finally {
      setResumeLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "application/pdf") return;

    // Simulate the same flow as file input
    const fakeEvent = { target: { files: [file] } };
    updateResume(fakeEvent);
  };

  const resumeUrl = resume?.url;
  const fileName = resume?.name || "resume.pdf";

  useEffect(() => {
    fetchUserResume();
  }, []);

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !resumeLoading && fileInputRef.current.click()}
        className={`
          flex-1 min-h-32 flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-light-border-secondary dark:border-dark-border-secondary rounded-md cursor-pointer
          transition-all duration-200 px-4 py-5 text-center
          ${isDragging && "bg-blue-500/10 dark:bg-blue-950/20 border-blue-400 dark:border-blue-500"}
          ${!resumeLoading && "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-hover"}
        `}
      >
        {resumeLoading ? (
          <>
            <Loader
              size={24}
              className="text-blue-500 dark:text-blue-400 animate-spin"
            />
          </>
        ) : resumeUrl ? (
          <>
            <div className="flex flex-col items-center gap-1">
              <img src={pdfLogo} alt="pdf svg" className="size-8" />
              <p className="text-xs font-medium truncate text-light-text-primary dark:text-dark-text-primary w-full">
                {fileName}
              </p>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              Click to replace
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1">
              <FileText
                size={24}
                className="text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <div className="text-light-text-secondary dark:text-dark-text-secondary text-xs font-medium">
                Drop your PDF here
                <br />
                OR
                <br />
                Click to browse
              </div>
            </div>

            <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs">
              PDF only
            </p>
          </>
        )}
      </div>

      {/* Preview & Delete Button */}
      {resumeUrl && !resumeLoading && (
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteResume();
            }}
            className="flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
          >
            <Trash2 size={13} />
            Delete PDF
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(resumeUrl);
            }}
            className="flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-500 transition-colors py-1 cursor-pointer"
          >
            <FileText size={13} />
            Preview PDF
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id="resumeOrCv"
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={updateResume}
      />
    </>
  );
}
