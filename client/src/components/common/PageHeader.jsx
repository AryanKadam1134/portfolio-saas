import React from "react";

export default function PageHeader({
  heading,
  subHeading,
  className,
  children,
}) {
  return (
    <div
      className={`${className} flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-light-border-primary pb-6 dark:border-dark-border-primary`}
    >
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-light-text-primary dark:text-dark-text-primary">
          Portfolio workspace
        </p>
        {heading && (
          <h1 className="text-2xl font-semibold tracking-tight text-light-text-primary dark:text-dark-text-primary sm:text-[28px]">
            {heading}
          </h1>
        )}

        {subHeading && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-light-text-secondary dark:text-dark-text-secondary">
            {subHeading}
          </p>
        )}
      </div>

      {children && (
        <div className="self-start sm:self-auto">{children}</div>
      )}
    </div>
  );
}
