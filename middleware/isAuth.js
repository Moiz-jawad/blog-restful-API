const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];

    const token = authorization.length > 1 ? authorization[1] : null;

    if (!token) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "token is required",
      });
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = {
        _id: payload._id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          code: 401,
          status: false,
          message: "Token has expired",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          code: 401,
          status: false,
          message: "Invalid token",
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
