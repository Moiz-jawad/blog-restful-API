const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const generateToken = (user) => {
  if (!jwtSecret) throw new Error("JWT secret is missing");

  // Use environment variable for token expiration or default to 3 days
  const expiresIn = process.env.JWT_EXPIRES_IN || "3d";

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn }
  );
};

module.exports = generateToken;
