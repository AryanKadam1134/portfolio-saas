import React from "react";

import FieldError from "./FieldError";

export default function FormField({
  id,
  label,
  attachment,
  children,
  className = "",
  colSpan = "col-span-1",
  orientation = "vertical",
  type,
  bold,
  required,
  error,
}) {
  const isFile = type == "file";

  const isCheckbox = type == "checkbox";

  // const child = React.Children.only(children);

  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        error,
      })
    : children;

  return (
    <div
      className={`${className} ${colSpan}
      flex ${orientation == "vertical" ? `flex-col gap-1.5` : `items-center gap-3`}`}
    >
      <div className="flex items-center gap-3">
        {isCheckbox && child}

        <label
          htmlFor={id}
          className={`w-full flex ${isCheckbox || orientation == "horizontal" ? "flex-col gap-0.5" : "flex-row items-center whitespace-nowrap"} justify-between font-medium text-[13px] text-light-text-primary dark:text-dark-text-primary
          ${bold && `font-semibold`}`}
        >
          <p>
            {label}
            {required && (
              <span className="text-red-600 dark:text-red-500"> *</span>
            )}
            {orientation == "horizontal" && " :"}

            {isFile && <div className="mt-1">{child}</div>}
          </p>

          {attachment}
        </label>
      </div>

      <div className="grow flex flex-col gap-1.5">
        {!isCheckbox && !isFile && child}

        <FieldError error={error} />
      </div>
    </div>
  );
}
