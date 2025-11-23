const crypto = require("crypto");

/**
 * Generates a cryptographically secure random code
 * @param {number} codeLength - Length of the code to generate (default: 4)
 * @returns {string} - Random numeric code
 */
const generateCode = (codeLength = 4) => {
  if (codeLength < 1 || codeLength > 10) {
    throw new Error("Code length must be between 1 and 10");
  }

  // Generate cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(codeLength);
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    // Convert byte to digit (0-9)
    code += (randomBytes[i] % 10).toString();
  }

  return code;
};

module.exports = generateCode;
