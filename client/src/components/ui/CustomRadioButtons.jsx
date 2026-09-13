export default function CustomRadioButtons({
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex items-center gap-4 mt-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-1">
          <input
            id={option.value}
            type="radio"
            value={option.value}
            className="accent-blue-500 dark:accent-blue-400 cursor-pointer"
            {...props}
          />

          <label
            htmlFor={option.value}
            className="text-light-text-primary dark:text-dark-text-primary cursor-pointer"
          >
            {option.label}
            <span className="mt-1">{error}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
