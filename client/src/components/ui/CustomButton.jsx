import { Loader2 } from "lucide-react";

const variants = {
  default: "text-white bg-blue-500 hover:bg-blue-600",
  red: "text-white bg-red-500 hover:bg-red-600",
  green: "text-white bg-green-500 hover:bg-green-600",
};

export default function CustomButton({
  icon,
  className,
  name,
  variant = "default",
  loading,
  disabled,
  ...props
}) {
  const Icon = loading ? Loader2 : icon;

  return (
    <button
      {...props}
      className={`shrink-0 px-5 py-2 flex items-center justify-center gap-2 ${variants[variant]} ${className} font-medium rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
      disabled={loading || disabled}
    >
      {Icon && (
        <Icon size={18} className={`shrink-0 ${loading && "animate-spin"}`} />
      )}

      {name}
    </button>
  );
}
