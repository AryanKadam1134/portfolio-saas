import { useState } from "react";

import { useCombobox } from "downshift";
import { ChevronDown } from "lucide-react";

import { inputClass } from "../../utils/getInputClass";

export default function CustomSelect({
  options = [],
  error,
  value,
  onChange,
  ...props
}) {
  const [inputValue, setInputValue] = useState("");
  const selectedItem = options.find((opt) => opt.value === value) || null;

  const filteredItems = options.filter((item) =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    getToggleButtonProps,
  } = useCombobox({
    items: filteredItems,
    selectedItem: null, // 🔥 always null — we control display ourselves
    inputValue,
    itemToString: () => "", // 🔥 never let Downshift write the label into input

    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter: {
          const clicked = changes.selectedItem;
          if (clicked) {
            // toggle
            onChange(value === clicked.value ? null : clicked.value);
          }
          setInputValue("");
          return {
            ...changes,
            selectedItem: null,
            inputValue: "",
            isOpen: false,
          };
        }

        case useCombobox.stateChangeTypes.InputBlur: {
          setInputValue("");
          return { ...changes, inputValue: "" };
        }

        default:
          return changes;
      }
    },

    onInputValueChange: ({ inputValue: newVal }) => {
      if (newVal === selectedItem?.label) return;

      // 🔥 If user starts typing while an item is selected, clear selection and input
      if (selectedItem && newVal) {
        onChange(null);
        setInputValue(""); // 🔥 reset instead of carrying over typed char
        return;
      }

      setInputValue(newVal || "");
    },
  });

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          {...getInputProps({
            onKeyDown: (e) => {
              if (e.key === "Backspace") {
                if (!inputValue && selectedItem) {
                  // 🔥 Start editing from the label
                  setInputValue(selectedItem.label.slice(0, -1));
                  onChange(null);
                }
              }
            },
          })}
          {...props}
          value={selectedItem && !inputValue ? selectedItem.label : inputValue}
          className={`${inputClass(error)} pr-10`}
        />

        <button
          type="button"
          {...getToggleButtonProps()}
          className="absolute right-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <ul
        {...getMenuProps()}
        className={`absolute z-50 flex flex-col gap-1 mt-1 p-1 w-full bg-light-bg-primary dark:bg-dark-bg-tertiary border border-light-border-secondary dark:border-dark-border-secondary rounded-md shadow-md max-h-60 overflow-y-auto ${
          !isOpen ? "hidden" : ""
        }`}
      >
        {isOpen &&
          filteredItems.map((item, index) => {
            const isSelected = value === item.value;
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
          })}

        {isOpen && filteredItems.length === 0 && (
          <li className="px-3 py-2 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
            No results found
          </li>
        )}
      </ul>
    </div>
  );
}
