const { Category, User } = require("../models");

const addCategory = async (req, res, next) => {
  try {
    const { title, desc } = req.body;
    const { _id } = req.user;

    if (!title) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Title is required",
      });
    }

    const isCategoryExist = await Category.findOne({ title });

    if (isCategoryExist) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Category already exists",
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "User not found",
      });
    }

    const newCategory = new Category({
      title,
      desc,
      createdBy: _id,
      updateBy: _id,
    });

    await newCategory.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { title, desc } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    const isCategoryExist = await Category.findOne({ title, _id: { $ne: id } });

    if (
      isCategoryExist &&
      isCategoryExist.title === title &&
      String(isCategoryExist._id) !== String(category._id)
    ) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Title already exists",
      });
    }

    category.title = title ? title : category.title;
    category.desc = desc;

    category.updateBy = _id;
    await category.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({
      code: 200,
      status: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const getCategories = async (req, res, next) => {
  try {
    const { q, size, page } = req.query;

    const sizeNumber = parseInt(size) || 10;
    const pageNumber = parseInt(page) || 1;

    let query = {};
    if (q && typeof q === "string" && q.trim()) {
      const search = new RegExp(q, "i");
      query = { $or: [{ title: search }, { desc: search }] };
    }

    const total = await Category.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const categories = await Category.find(query)
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber)
      .sort({ updatedAt: -1 });

    if (categories.length === 0) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "No matching categories found",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "get category list successfully",
      categories,
      total,
      pages,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "No matching category found",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "get category list successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
};
