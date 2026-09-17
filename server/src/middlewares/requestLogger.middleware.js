export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const userId = req.user?._id ?? "anonymous";

    const isError = res.statusCode >= 400;

    const color = isError ? "\x1b[31m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(
      `${color}[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl} → ${res.statusCode} ` +
        `| ${duration}ms | User: ${userId}${reset}`,
    );
  });

  next();
};
