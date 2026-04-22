import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeLocalFile = async (localFilePath) => {
  if (localFilePath && fs.existsSync(localFilePath)) {
    await fs.promises.unlink(localFilePath);
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    await removeLocalFile(localFilePath);
    return response;
  } catch (error) {
    await removeLocalFile(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
