const express = require("express");
const { categoryController } = require("../controllers");

const { addCategoryValidator, isValidate } = require("../validator/category");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const validateRequest = require("../validator/validationResult");

const router = express.Router();

router.post(
  "/",
  isAuth,
  isAdmin,
  addCategoryValidator,
  validateRequest,
  categoryController.addCategory
);

router.put(
  "/:id",
  isAuth,
  isAdmin,
  isValidate,
  validateRequest,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  isAuth,
  isAdmin,
  isValidate,
  validateRequest,
  categoryController.deleteCategory
);

router.get(
  "/",
  isAuth,
  isValidate,
  validateRequest,
  categoryController.getCategories
);

router.get(
  "/:id",
  isAuth,
  isValidate,
  validateRequest,
  categoryController.getCategory
);

module.exports = router;
