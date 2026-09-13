import { inputClass } from "../../utils/getInputClass";

export default function CustomDatePicker({
  icon,
  error,
  className = "",
  ...props
}) {
  const Icon = icon;

  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        />
      )}

      <input
        {...props}
        type="date"
        onClick={(e) => e.currentTarget.showPicker()}
        className={`${Icon && "pl-10"} ${inputClass(error)} ${className} [&::-webkit-calendar-picker-indicator]:hidden appearance-none`}
      />
    </div>
  );
}
