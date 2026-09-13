export default function CustomCheckbox({ ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      className="accent-blue-500 dark:accent-blue-400 cursor-pointer"
    />
  );
}
