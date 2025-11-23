const { File, Category, Post } = require("../models");

const addPost = async (req, res, next) => {
  try {
    const { title, desc, category, file } = req.body;
    const { _id } = req.user;

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "File not found",
        });
      }
    }

    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }
    }

    const newPost = new Post({
      title,
      desc,
      category,
      file,
      updateBy: _id,
    });

    await newPost.save();

    res.status(201).json({
      codes: 201,
      status: true,
      message: "post added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, desc, category, file } = req.body;
    const { id } = req.params;
    const { _id } = req.user;

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "File not found",
        });
      }
    }

    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Post not found",
      });
    }

    post.title = title ? title : post.title;
    post.desc = typeof desc === "string" ? desc : post.desc;
    post.file = file || post.file;
    post.category = category ? category : post.category;
    post.updateBy = _id;

    await post.save();

    res.status(200).json({
      codes: 200,
      status: true,
      message: "post update successfully",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      status: true,
      message: "post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPostList = async (req, res, next) => {
  try {
    const { page, size, q, category } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const sizeNumber = parseInt(size, 10) || 10;

    let query = {};

    if (q) {
      const search = new RegExp(q, "i");
      query = { $or: [{ title: search }, { desc: search }] };
    }

    if (category) {
      query = { ...query, category };
    }

    console.log(query);

    const total = await Post.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const posts = await Post.find(query)
      .populate("file")
      .populate("category")
      .populate("updateBy", "-password -verificationCode -forgotPasswordCode")
      .sort({ updatedAt: 1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    res.status(200).json({
      code: 200,
      status: true,
      message: "get post list successfully",
      data: { posts, total, pages },
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("file")
      .populate("category")
      .populate("updateBy", "-password -verificationCode -forgotPasswordCode");
    if (!post) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "get post successfully",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addPost, updatePost, deletePost, getPostList, getPost };
