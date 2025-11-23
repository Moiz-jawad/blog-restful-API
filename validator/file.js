const validateExtension = (ext) => {
  const normalized = ext.replace(".", "").toLowerCase();
  const allowed = ["jpg", "jpeg", "png"];
  return allowed.includes(normalized);
};

module.exports = { validateExtension };
