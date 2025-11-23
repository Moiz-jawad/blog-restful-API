const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const mappedError = {};
  errors.array().forEach((error) => {
    mappedError[error.path] = error.msg;
  });

  return res.status(400).json(mappedError);
};

module.exports = { validate };
