require("dotenv").config();

const requiredEnvVars = [
  "PORT",
  "CON_URL",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "AWS_ACCESS_KEY",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_BUCKET_NAME",
  "AWS_REGION",
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    `Error: Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.error(
    "Error: JWT_SECRET must be at least 32 characters long for security"
  );
  process.exit(1);
}

let {
  PORT,
  CON_URL,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
} = process.env;

module.exports = {
  port: PORT || 3000,
  conUrl: CON_URL,
  jwtSecret: JWT_SECRET,
  user: EMAIL_USER,
  password: EMAIL_PASS,
  awsAccessKey: AWS_ACCESS_KEY,
  awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
  awsBucketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
};
