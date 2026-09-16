import React from "react";

export default function PageHeader({
  heading,
  subHeading,
  className,
  children,
}) {
  return (
    <div
      className={`${className} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
    >
      <div>
        {heading && (
          <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {heading}
          </h1>
        )}

        {subHeading && (
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {subHeading}
          </p>
        )}
      </div>

      {children && (
        <div className="self-end sm:self-center h-full">{children}</div>
      )}
    </div>
  );
}
