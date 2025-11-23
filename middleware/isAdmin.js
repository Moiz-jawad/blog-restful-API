const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Unauthorized: No user found",
      });
    }

    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
      return next();
    } else {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Permission denied",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
