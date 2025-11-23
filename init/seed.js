const mongoose = require("mongoose");
const { conUrl } = require("../config/keys");
const { User, Category, Post } = require("../models");
const hashPassword = require("../utils/hashPassword");

const run = async () => {
  try {
    await mongoose.connect(conUrl);
    console.log("Connected to MongoDB for seeding");

    // 1. Ensure an admin and a regular user exist
    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      const adminPassword = await hashPassword("Admin@12345");
      admin = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: 1,
        isVerified: true,
      });
      console.log("Created admin user: admin@example.com / Admin@12345");
    }

    let user = await User.findOne({ email: "john.doe@example.com" });
    if (!user) {
      const userPassword = await hashPassword("User@12345");
      user = await User.create({
        name: "John Doe",
        email: "john.doe@example.com",
        password: userPassword,
        role: 3,
        isVerified: true,
      });
      console.log("Created regular user: john.doe@example.com / User@12345");
    }

    // 2. Seed some categories
    const categoriesPayload = [
      {
        title: "Technology",
        desc: "News and articles about software, gadgets and the web.",
      },
      {
        title: "Programming",
        desc: "Deep dives into JavaScript, Node.js and backend development.",
      },
      {
        title: "Travel",
        desc: "Stories and tips from around the world.",
      },
    ];

    const categories = [];
    for (const payload of categoriesPayload) {
      let category = await Category.findOne({ title: payload.title });
      if (!category) {
        category = await Category.create({
          ...payload,
          createdBy: admin._id,
          updateBy: admin._id,
        });
        console.log(`Created category: ${payload.title}`);
      }
      categories.push(category);
    }

    // 3. Seed some posts (without files to keep it simple)
    if (categories.length > 0) {
      const techCategory = categories.find((c) => c.title === "Technology") || categories[0];
      const programmingCategory =
        categories.find((c) => c.title === "Programming") || categories[0];

      const postsPayload = [
        {
          title: "Getting started with Node.js REST APIs",
          desc: "A step-by-step guide on building and securing RESTful APIs with Express and MongoDB.",
          category: programmingCategory._id,
          updateBy: admin._id,
        },
        {
          title: "Deploying a Node.js API to production",
          desc: "Best practices for environment variables, logging and monitoring before you go live.",
          category: techCategory._id,
          updateBy: admin._id,
        },
        {
          title: "Working remotely while traveling",
          desc: "How to balance work, side projects and exploring new cities as a developer.",
          category: categories.find((c) => c.title === "Travel")?._id || techCategory._id,
          updateBy: user._id,
        },
      ];

      for (const payload of postsPayload) {
        const exists = await Post.findOne({ title: payload.title });
        if (!exists) {
          await Post.create(payload);
          console.log(`Created post: ${payload.title}`);
        }
      }
    }

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
