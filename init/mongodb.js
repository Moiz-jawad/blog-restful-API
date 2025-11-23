const mongoose = require("mongoose");
const { conUrl } = require("../config/keys");

const contMongoose = async () => {
  try {
    await mongoose.connect(conUrl);
    console.log("Database connection successful!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = contMongoose;
