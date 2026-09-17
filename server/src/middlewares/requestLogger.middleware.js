export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const userId = req.user?._id ?? "anonymous";

    const green = "\x1b[32m";
    const red = "\x1b[31m";
    const yellow = "\x1b[33m";
    const reset = "\x1b[0m";

    const statusColor =
      res.statusCode >= 500 ? red : res.statusCode >= 400 ? yellow : green;

    console.log(
      `[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl} → ` +
        `${statusColor}${res.statusCode}${reset} ` +
        `| ${duration}ms | User: ${userId}`,
    );
  });

  next();
};
