import { useEffect, useId, useRef, useState } from "react";

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
} from "@floating-ui/react";
import { ChevronDown, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const generatedId = useId();
  const listboxId = id ? `${id}-listbox` : `${generatedId}-listbox`;

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredOptions = normalizedSearchQuery
    ? options.filter((option) =>
        String(option.label).toLowerCase().includes(normalizedSearchQuery),
      )
    : options;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (disabled) return;

      setIsOpen(open);

      if (!open) setSearchQuery("");
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
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onSelect(optionValue);
    setSearchQuery("");

    if (!multiple) {
      setIsOpen(false);
      refs.domReference.current?.focus();
    } else {
      searchInputRef.current?.focus();
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
          role: "combobox",
          "aria-controls": listboxId,
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
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
            {...getFloatingProps()}
            className="z-[10000] flex flex-col overflow-hidden rounded-md border border-light-border-secondary bg-light-bg-primary shadow-md dark:border-dark-border-secondary dark:bg-dark-bg-tertiary"
          >
            <div className="relative shrink-0 border-b border-light-border-secondary p-2 dark:border-dark-border-secondary">
              <Search
                aria-hidden="true"
                size={16}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search options"
                placeholder="Search options..."
                className="w-full rounded-md border border-light-input-border bg-light-input-bg py-2 pr-3 pl-9 text-sm text-light-input-text outline-none placeholder:text-light-input-placeholder/60 focus:border-transparent focus:ring focus:ring-light-input-ring dark:border-dark-input-border dark:bg-dark-input-bg dark:text-dark-input-text dark:placeholder:text-dark-input-placeholder/60 dark:focus:ring-dark-input-ring"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              className="min-h-0 flex-1 overflow-y-auto p-1"
            >
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
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
                  {options.length
                    ? "No options found"
                    : "No options available"}
                </p>
              )}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
