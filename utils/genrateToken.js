const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const generateToken = (user) => {
  if (!jwtSecret) throw new Error("JWT secret is missing");

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "3d" }
  );
};

module.exports = generateToken;
