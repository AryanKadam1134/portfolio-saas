import SelectDropdown from "./SelectDropdown";

export default function CustomMultiSelect({
  options = [],
  error,
  value = [],
  onChange,
  placeholder,
  className = "",
  id,
  name,
  disabled = false,
  required = false,
  onBlur,
  ...props
}) {
  const selectedValues = Array.isArray(value) ? value : [];
  const selectedValueKeys = new Set(selectedValues.map(String));
  const selectedLabel = options
    .filter((option) => selectedValueKeys.has(String(option.value)))
    .map((option) => option.label)
    .join(", ");

  const toggleOption = (optionValue) => {
    const optionKey = String(optionValue);
    const nextValue = selectedValueKeys.has(optionKey)
      ? selectedValues.filter((item) => String(item) !== optionKey)
      : [...selectedValues, optionValue];

    onChange?.(nextValue);
  };

  return (
    <div className="relative w-full">
      <SelectDropdown
        id={id}
        options={options}
        selectedLabel={selectedLabel}
        placeholder={placeholder}
        isSelected={(optionValue) =>
          selectedValueKeys.has(String(optionValue))
        }
        onSelect={toggleOption}
        multiple
        error={error}
        disabled={disabled}
        required={required}
        className={className}
        onBlur={onBlur}
      />

      <select
        {...props}
        name={name}
        multiple
        value={selectedValues}
        disabled={disabled}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
