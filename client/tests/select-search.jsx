import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import "../src/index.css";
import CustomMultiSelect from "../src/components/ui/CustomMultiSelect";

const options = [
  { label: "React", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "node" },
];

export function SelectSearchFixture() {
  const [value, setValue] = useState([]);

  return (
    <div className="w-96 p-6">
      <CustomMultiSelect
        id="technologies"
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Select technologies"
      />
      <output data-testid="selected-values">{value.join(",")}</output>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<SelectSearchFixture />);

const report = (result) => {
  document.body.dataset.testResult = JSON.stringify(result);
  document.title = Object.values(result).every(Boolean) ? "PASS" : "FAIL";
};

setTimeout(() => {
  document.querySelector('[role="combobox"]').click();

  setTimeout(() => {
    const searchInput = document.querySelector(
      'input[aria-label="Search options"]',
    );

    if (!searchInput) {
      report({ searchPresent: false });
      return;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set;
    valueSetter.call(searchInput, "tYpE");
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(() => {
      const filteredOptions = Array.from(
        document.querySelectorAll('[role="option"]'),
      );
      const filtersCaseInsensitively =
        filteredOptions.length === 1 &&
        filteredOptions[0].textContent.includes("TypeScript");

      filteredOptions[0]?.click();

      setTimeout(() => {
        const visibleOptions = Array.from(
          document.querySelectorAll('[role="option"]'),
        );
        const result = {
          searchPresent: true,
          searchAutofocused: document.activeElement === searchInput,
          filtersCaseInsensitively,
          selectionUpdated:
            document.querySelector('[data-testid="selected-values"]')
              .textContent === "typescript",
          queryCleared: searchInput.value === "",
          menuRemainsOpen: visibleOptions.length === options.length,
        };

        report(result);
      }, 100);
    }, 100);
  }, 100);
}, 100);
