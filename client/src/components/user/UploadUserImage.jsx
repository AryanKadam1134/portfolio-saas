import React, { useEffect, useRef, useState } from "react";

import { Loader, SquarePen, Trash2 } from "lucide-react";

import { userEndpoints } from "../../services/user.service";

import { useAuth } from "../../context/auth/useAuth";
import { useNotify } from "../../context/notification/useNotify";

import defaultProfileImage from "../../assets/profile.png";

export default function UploadUserImage() {
  const { notify } = useNotify();
  const { setUser } = useAuth();

  const [isClicked, setIsClicked] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const imageInputRef = useRef(null);

  const fetchUserImage = async () => {
    try {
      const res = await userEndpoints.getUserImage();
      const image = res.data;

      setImageUrl(image?.url);
      setUser((prev) => ({ ...prev, image }));
    } catch (error) {
      console.error("Error fetching User Image: ", error);
    }
  };

  const updateProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewImageUrl = URL.createObjectURL(file);
    setImageUrl(previewImageUrl);

    setImageLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await userEndpoints.updateUserImage(formData);

      fetchUserImage();
      notify.msgSuccess("Profile Image Updated!");
    } catch (error) {
      setImageUrl(null);
      console.error("Error updating image:", error);
      notify.msgError(error?.message || "Failed to update profile image");
    } finally {
      setImageLoading(false);
    }
  };

  const deleteProfileImage = async () => {
    setImageLoading(true);

    try {
      await userEndpoints.deleteUserImage();

      setImageUrl(null);
      fetchUserImage();
      notify.msgSuccess("Profile Image Deleted!");
    } catch (error) {
      console.error("Error deleting image:", error);
      notify.msgError(error?.message || "Failed to delete profile image");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserImage();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsClicked(false);

    if (isClicked) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isClicked]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsClicked((prev) => !prev);
      }}
      className="relative group"
    >
      {/* Image */}
      <img
        src={imageUrl || defaultProfileImage}
        alt="User Profile"
        className="size-45 rounded-full object-contain border border-light-border-primary dark:border-dark-border-primary"
      />

      {/* Overlay */}
      {imageLoading ? (
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-100 backdrop-blur-xs transition flex items-center justify-center">
          <div className="text-white text-sm bg-black/40 p-2 rounded-full">
            <Loader
              size={20}
              className="text-light-text-secondary dark:text-dark-text-secondary animate-spin"
            />
          </div>
        </div>
      ) : (
        <div
          className={`absolute inset-0 rounded-full bg-black/40 ${
            isClicked
              ? "opacity-100 backdrop-blur-xs pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
          md:opacity-0 md:pointer-events-none
          md:group-hover:opacity-100 md:group-hover:backdrop-blur-xs md:group-hover:pointer-events-auto transition-opacity`}
        >
          <div className="h-full flex items-center justify-center">
            <button
              type="button"
              className="p-2 text-sm bg-black/40 flex items-center gap-3 rounded-full"
            >
              <div
                onClick={deleteProfileImage}
                className="p-2 text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 bg-black/50 rounded-full cursor-pointer transition-colors"
              >
                <Trash2 size={20} />
              </div>

              <div
                onClick={() => imageInputRef.current.click()}
                className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 bg-black/50 rounded-full cursor-pointer transition-colors"
              >
                <SquarePen size={20} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        className="hidden"
        onChange={updateProfileImage}
      />
    </div>
  );
}
