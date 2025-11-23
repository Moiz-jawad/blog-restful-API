const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  awsRegion,
  awsAccessKey,
  awsSecretAccessKey,
  awsBucketName,
} = require("../config/keys");

const generateCode = require("./generateCode");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
});

const uploadFileToS3 = async ({ file, ext }) => {
  const key = `${generateCode(12)}_${Date.now()}${ext}`;

  const params = {
    Bucket: awsBucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    return key;
  } catch (error) {
    throw error;
  }
};

const signedUrl = async (Key) => {
  const params = {
    Bucket: awsBucketName,
    Key,
  };

  const command = new GetObjectCommand(params);

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  } catch (error) {
    throw error;
  }
};

const deleteFileFromS3 = async (Key) => {
  const params = {
    Bucket: awsBucketName,
    Key,
  };
  const command = new DeleteObjectCommand(params);

  try {
    await client.send(command);
    return;
  } catch (error) {
    throw error;
  }
};
module.exports = { uploadFileToS3, signedUrl, deleteFileFromS3 };
