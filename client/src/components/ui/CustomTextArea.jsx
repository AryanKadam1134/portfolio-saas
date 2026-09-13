import { inputClass } from "../../utils/getInputClass";

// Note: Use only for Text Based Inputs
export default function CustomTextArea({ error, className = "", ...props }) {
  return (
    <textarea {...props} className={`${inputClass(error)} ${className}`} />
  );
}
