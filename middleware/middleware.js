const errorHanlder = (error, req, res, next) => {
  const statusCode =
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : null) ||
    error.statusCode ||
    500;

  res.status(statusCode).json({
    code: statusCode,
    status: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHanlder;
