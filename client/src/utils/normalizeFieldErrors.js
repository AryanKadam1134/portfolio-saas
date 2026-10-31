const normalizeFieldErrors = (error = {}) => {
  return Object.entries(error?.errors || {}).reduce(
    (fieldErrors, [field, messages]) => {
      const message = Array.isArray(messages)
        ? messages.filter(Boolean).join(", ")
        : messages;

      if (message) fieldErrors.push([field, message]);

      return fieldErrors;
    },
    [],
  );
};

const getFieldErrorMessage = (error) => {
  if (!error) return undefined;
  if (typeof error !== "object") return undefined;
  if (typeof error?.message === "string") return error.message;

  const messages = Object.values(error).flatMap((value) => {
    const message = getFieldErrorMessage(value);
    return message ? [message] : [];
  });

  return [...new Set(messages)].join(", ") || undefined;
};

export { normalizeFieldErrors, getFieldErrorMessage };
