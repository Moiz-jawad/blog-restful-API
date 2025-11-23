const http = require("http");
const mongoose = require("mongoose");
const app = require("./app.js");
const { port } = require("./config/keys.js");

const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("HTTP server closed.");

    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
