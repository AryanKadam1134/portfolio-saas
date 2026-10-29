export default function CustomCheckbox({ ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      className="size-4 accent-blue-500 cursor-pointer"
    />
  );
}
