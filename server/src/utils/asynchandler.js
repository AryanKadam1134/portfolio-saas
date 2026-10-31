import ApiRes from "./ApiRes.js";

export const asynchandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      res.status(error.statusCode || 500).json({
        statusCode: error.statusCode || 500,
        message: error.message || "",
        errors: error.errors || {},
      });
    });
  };
};
