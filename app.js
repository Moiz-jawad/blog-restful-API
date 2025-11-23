const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
dotenv.config();
const contMongoose = require("./init/mongodb.js");
const { authRoute, categoryRoute, fileRoute, postRoute } = require("./routes");
const { errorHandler } = require("./middleware");
const notFound = require("./controllers/notfound.js");

const app = express();

contMongoose();

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 100 })
);

// Security and performance middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",") || false
      : true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(compression());

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

app.use("/api", apiLimiter);
app.use("/api/v1/auth", authLimiter);

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
app.use(errorHandler);

module.exports = app;
