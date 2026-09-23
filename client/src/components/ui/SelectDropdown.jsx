import { useId, useState } from "react";

import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { ChevronDown } from "lucide-react";

import { inputClass } from "../../utils/getInputClass";

export default function SelectDropdown({
  id,
  options,
  selectedLabel,
  placeholder,
  isSelected,
  onSelect,
  multiple = false,
  error,
  disabled = false,
  required = false,
  className = "",
  onBlur,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const generatedId = useId();
  const listboxId = id ? `${id}-listbox` : `${generatedId}-listbox`;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!disabled) setIsOpen(open);
    },
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, elements, rects }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(80, Math.min(240, availableHeight))}px`,
          });
        },
      }),
    ],
  });

  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleSelect = (optionValue) => {
    onSelect(optionValue);

    if (!multiple) {
      setIsOpen(false);
      refs.domReference.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={(node) => refs.setReference(node)}
        {...getReferenceProps({
          id,
          type: "button",
          disabled,
          onBlur,
          "aria-controls": listboxId,
          "aria-invalid": error ? true : undefined,
          "aria-required": required || undefined,
        })}
        className={`${inputClass(error)} ${className} flex items-center justify-between gap-3 text-left`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            selectedLabel
              ? "text-light-input-text dark:text-dark-input-text"
              : "text-light-input-placeholder/60 dark:text-dark-input-placeholder/60"
          }`}
        >
          {selectedLabel || placeholder || "Select an option"}
        </span>

        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`shrink-0 text-light-text-tertiary transition-transform dark:text-dark-text-tertiary ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <FloatingPortal>
          <div
            ref={(node) => refs.setFloating(node)}
            style={floatingStyles}
            {...getFloatingProps({
              id: listboxId,
              "aria-multiselectable": multiple || undefined,
            })}
            className="z-[10000] flex flex-col gap-1 overflow-y-auto rounded-md border border-light-border-secondary bg-light-bg-primary p-1 shadow-md dark:border-dark-border-secondary dark:bg-dark-bg-tertiary"
          >
            {options.length ? (
              options.map((option) => {
                const selected = isSelected(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      selected
                        ? "font-medium bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                        : "text-light-text-secondary hover:bg-light-bg-hover dark:text-dark-text-secondary dark:hover:bg-dark-bg-hover"
                    }`}
                  >
                    {option.label} {selected && "✔"}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                No options available
              </p>
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
