const variants = {
  green: "text-white bg-green-500 hover:bg-green-600",
  red: "text-white bg-red-500 hover:bg-red-600",
};

export default function ActionButton({
  variant,
  icon,
  className = "",
  ...props
}) {
  const Icon = icon;

  return (
    <button
      {...props}
      className={`p-1.5 ${variants[variant]} ${className}
      rounded-sm shadow-sm hover:shadow-md transition-all
      enabled:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <Icon size={18} />
    </button>
  );
}
