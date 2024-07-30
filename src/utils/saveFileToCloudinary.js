import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    console.log('Uploading to Cloudinary:', file.path);
    const response = await cloudinary.v2.uploader.upload(file.path);
    console.log('Cloudinary upload response:', response);
    await fs.unlink(file.path);
    console.log('File deleted from local storage:', file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('File path:', file.path);
    throw new Error('Failed to upload photo to Cloudinary');
  }
};
