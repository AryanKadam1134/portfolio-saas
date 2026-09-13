import { useState } from "react";

import { useCombobox, useMultipleSelection } from "downshift";
import { ChevronDown, X } from "lucide-react";

import { inputClass } from "../../utils/getInputClass";

export default function CustomMultiSelect({
  options = [],
  value = [],
  onChange,
  error,
  placeholder,
  ...props
}) {
  // ✅ map value -> objects
  const selectedItems = options.filter((opt) => value.includes(opt.value));

  const [inputValue, setInputValue] = useState("");

  // ✅ MULTI SELECTION
  const { getSelectedItemProps, removeSelectedItem } = useMultipleSelection({
    selectedItems,

    onStateChange: ({ selectedItems: newItems }) => {
      if (!newItems) return;
      onChange(newItems.map((item) => item.value));
    },
  });

  // ✅ FILTERED OPTIONS (SEARCH)
  const filteredItems = options.filter((item) =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // ✅ COMBOBOX
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    getToggleButtonProps,
  } = useCombobox({
    items: filteredItems,

    inputValue, // ✅ controlled

    itemToString: (item) => (item ? item.label : ""),

    // 🔥 IMPORTANT FIX
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          const clickedItem = changes.selectedItem;

          if (clickedItem) {
            if (value.includes(clickedItem.value)) {
              // 🔥 Already selected → remove it
              onChange(value.filter((v) => v !== clickedItem.value));
            } else {
              // ✅ Not selected → add it
              onChange([...value, clickedItem.value]);
            }
            setInputValue("");
          }

          return {
            ...changes,
            isOpen: true,
            inputValue: "",
            highlightedIndex: state.highlightedIndex,
            selectedItem: null, // 🔥 Reset so same item can be re-selected next time
          };
        }

        default:
          return changes;
      }
    },

    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
    },

    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return;

      if (value.includes(selectedItem.value)) {
        // 🔥 Already selected → remove it
        onChange(value.filter((v) => v !== selectedItem.value));
      } else {
        // ✅ Not selected → add it
        onChange([...value, selectedItem.value]);
      }

      setInputValue("");
    },
  });

  return (
    <div className="relative w-full">
      {/* Input + Chips */}
      <div
        className={`${inputClass(
          error,
        )} flex flex-wrap items-center gap-2 pr-10`}
      >
        {/* Chips */}
        {selectedItems.map((item, index) => (
          <span
            key={item.value}
            {...getSelectedItemProps({ selectedItem: item, index })}
            className="flex items-center gap-1 text-light-text-primary dark:text-light-bg-primary bg-light-bg-secondary dark:bg-dark-bg-tertiary px-2 py-1 rounded text-xs"
          >
            {item.label}

            <X
              size={12}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedItem(item);
              }}
            />
          </span>
        ))}

        {/* Input */}
        <input
          {...getInputProps({
            placeholder: selectedItems.length ? "" : placeholder,
            className:
              "flex-1 outline-none bg-transparent text-sm min-w-[80px] text-light-text-primary dark:text-dark-text-primary",
          })}
          {...props}
        />
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        {...getToggleButtonProps()}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
      >
        <ChevronDown size={18} />
      </button>

      {/* Dropdown */}
      <ul
        {...getMenuProps()}
        className={`absolute z-50 flex flex-col gap-1 mt-1 p-1 w-full bg-light-bg-primary dark:bg-dark-bg-tertiary border border-light-border-secondary dark:border-dark-border-secondary rounded-md shadow-md max-h-60 overflow-y-auto ${
          !isOpen && "hidden"
        }`}
      >
        {isOpen &&
          (filteredItems?.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = value.includes(item.value);

              return (
                <li
                  key={item.value}
                  {...getItemProps({ item, index })}
                  className={`px-3 py-2 flex items-center justify-between gap-1 w-full cursor-pointer text-sm rounded transition-colors
                  ${
                    highlightedIndex === index
                      ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                      : ""
                  }
                  ${
                    isSelected
                      ? "font-medium bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary"
                      : "text-light-text-secondary dark:text-dark-text-secondary"
                  }
                `}
                >
                  {item.label} {isSelected && "✔"}
                </li>
              );
            })
          ) : (
            <li
              className={`px-3 py-2 text-sm text-light-text-tertiary dark:text-dark-text-tertiary`}
            >
              No Data
            </li>
          ))}
      </ul>
    </div>
  );
}
