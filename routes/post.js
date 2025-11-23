const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const {
  addPostValidator,
  updatePostValidator,
  isValidator,
} = require("../validator/post");

const { validate } = require("../validator/validate");
const { postController } = require("../controllers");

router.post("/", isAuth, addPostValidator, validate, postController.addPost);

router.put(
  "/:id",
  isAuth,
  updatePostValidator,
  isValidator,
  postController.updatePost
);

router.delete("/:id", isAuth, isValidator, validate, postController.deletePost);

router.get("/", isAuth, postController.getPostList);

router.get("/:id", isAuth, isValidator, validate, postController.getPost);

module.exports = router;
