import React, { useState } from "react";

import { ChevronLeft, ChevronRight, Image, Loader, Trash2 } from "lucide-react";

import ActionButton from "../ui/ActionButton";

function ScrollButton({ icon, scroll, className = "" }) {
  const Icon = icon;

  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("image-gallery-scroll")
          ?.scrollBy({ left: scroll, behavior: "smooth" })
      }
      className={`${className} hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 p-2
        bg-light-bg-secondary dark:bg-dark-bg-tertiary
        hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover
        border border-light-border-primary dark:border-dark-border-primary
        text-light-text-primary dark:text-dark-text-primary
        rounded-full cursor-pointer transition-all shadow-md hover:shadow-lg`}
    >
      <Icon size={20} />
    </button>
  );
}

export default function ImageGallery({
  images,
  coverImageIndex,
  imageDeletingId,
  handleCoverChange,
  deleteImage,
  className = "",
}) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className={`h-full flex items-end ${className}`}>
      {!images?.length || images?.length <= 0 ? (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 
        text-light-text-secondary dark:text-dark-text-secondary"
        >
          <Image
            size={24}
            className="text-light-text-tertiary dark:text-dark-text-tertiary"
          />
          <div className="text-center">
            <p className="text-sm font-medium">No images yet</p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5">
              Upload images to see them here
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Scroll Buttons */}
          <ScrollButton className="left-2" icon={ChevronLeft} scroll={-300} />

          <ScrollButton className="right-2" icon={ChevronRight} scroll={300} />

          {/* Image Container */}
          <div
            id="image-gallery-scroll"
            className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-1 py-2"
          >
            {images?.map((image, idx) => {
              const { public_id, url } = image;
              const isCoverImage = idx === coverImageIndex;

              const isActive = activeImage === public_id;

              return (
                <div
                  key={public_id || idx}
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === public_id ? null : public_id,
                    )
                  }
                  className={`relative group h-35 w-auto shrink-0 rounded-md overflow-hidden transition-all ${
                    isCoverImage
                      ? "ring-1 ring-green-500 border-0 shadow-md"
                      : "border border-light-border-primary dark:border-dark-border-primary hover:shadow-md"
                  } bg-light-bg-secondary dark:bg-dark-bg-secondary`}
                >
                  {/* Image */}
                  <img
                    src={url}
                    alt="gallery image"
                    className="w-full h-full object-cover"
                  />

                  {/* Loader */}
                  {imageDeletingId === public_id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <Loader size={28} className="animate-spin text-white" />
                    </div>
                  )}

                  {/* Cover Badge */}
                  {isCoverImage && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Image size={14} />
                      Cover
                    </div>
                  )}

                  {/* Set as Cover Button (Hover Only) */}
                  {!isCoverImage && (
                    <ActionButton
                      type="button"
                      title="Set as cover image"
                      variant="green"
                      icon={Image}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoverChange(idx);
                      }}
                      className={`absolute top-2 left-2 
                        transition-opacity
                        ${
                          isActive
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                        }
                        md:opacity-0 md:pointer-events-none
                        md:group-hover:opacity-100 md:group-hover:pointer-events-auto`}
                    />
                  )}

                  {/* Delete Button (Hover Only) */}
                  <ActionButton
                    type="button"
                    title="Delete image"
                    variant="red"
                    icon={Trash2}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(public_id);
                    }}
                    className={`absolute top-2 right-2 
                      transition-opacity
                      ${
                        isActive
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }
                      md:opacity-0 md:pointer-events-none
                      md:group-hover:opacity-100 md:group-hover:pointer-events-auto`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
