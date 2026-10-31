class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = {},
    success,
    stack = "",
  ) {
    super(message); // ✅ first
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = statusCode < 400;
  }
}

export default ApiError;
