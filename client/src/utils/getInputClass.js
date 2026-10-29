export const inputClass = (error) => {
  return `w-full px-4 py-2.5
  text-light-input-text dark:text-dark-input-text
  placeholder:text-light-input-placeholder/60 dark:placeholder:text-dark-input-placeholder/60
  bg-light-input-bg dark:bg-dark-input-bg
  focus:bg-light-input-bgFocus dark:focus:bg-dark-input-bgFocus
  disabled:bg-light-input-bgDisabled dark:disabled:bg-dark-input-bgDisabled
  border rounded-xl outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
    error
      ? "border-2 border-light-input-error dark:border-dark-input-error shadow-sm"
      : "border border-light-input-border dark:border-dark-input-border focus:border-transparent focus:ring focus:ring-light-input-ring dark:focus:ring-dark-input-ring"
  }`;
};
