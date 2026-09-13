export default function FieldError({ error }) {
  return (
    error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
  );
}
