export const asynchandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      const validationErrors = Object.fromEntries(
        Object.entries(error.errors || {}).flatMap(([field, value]) => {
          const messages = Array.isArray(value)
            ? value
            : [typeof value === "string" ? value : value?.message];
          const validMessages = messages.filter(
            (message) => typeof message === "string" && message,
          );

          return validMessages.length ? [[field, validMessages]] : [];
        }),
      );

      const duplicateErrors =
        error.code === 11000
          ? Object.fromEntries(
              Object.entries(error.keyValue || {})
                .filter(([field]) => field !== "owner")
                .map(([field]) => [field, [`${field} is already in use.`]]),
            )
          : {};

      const errors = { ...duplicateErrors, ...validationErrors };

      const statusCode = error.statusCode || 500;

      res.status(statusCode).json({
        statusCode,
        message: error.message || "",
        errors,
      });
    });
  };
};
