const generateCode = (codeLength = 4) => {
  const number = String(Math.random()).split(".")[1];
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const digit = number[i] || Math.floor(Math.random() * 10);
    code += digit;
  }

  return code;
};

module.exports = generateCode;
