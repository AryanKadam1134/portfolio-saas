import { inputClass } from "../../utils/getInputClass";

// Note: Use only for Text Based Inputs
export default function CustomInput({ icon, error, className = "", ...props }) {
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
        className={`${Icon && "pl-10"} ${inputClass(error)} ${className}`}
      />
    </div>
  );
}
