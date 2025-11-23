require("dotenv").config();

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
  port: PORT,
  conUrl: CON_URL,
  jwtSecret: JWT_SECRET,
  user: EMAIL_USER,
  password: EMAIL_PASS,
  awsAccessKey: AWS_ACCESS_KEY,
  awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
  awsBucketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
};
