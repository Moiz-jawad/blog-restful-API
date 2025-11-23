const express = require("express");
const bodyParse = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
dotenv.config();
const contMongoose = require("./init/mongodb.js");
const { authRoute, categoryRoute, fileRoute, postRoute } = require("./routes");
const { errorHanlder } = require("./middleware");
const notFound = require("./controllers/notfound.js");

const app = express();

contMongoose();

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(bodyParse.urlencoded({ limit: "10mb", extended: true }));

// Security and performance middlewares
app.use(helmet());
app.use(cors());
app.use(compression());

// Basic rate limiting for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/api", apiLimiter);

// Logging only in non-production environments
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Application routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/post", postRoute);

// 404 handler
app.use(/.*/, notFound);

// Centralized error handler (must be last)
app.use(errorHanlder);

module.exports = app;
