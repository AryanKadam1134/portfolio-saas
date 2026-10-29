export default function FieldError({ error }) {
  return (
    error && (
      <p className="text-xs text-[#ef4444] dark:text-[#f87171]">{error}</p>
    )
  );
}
