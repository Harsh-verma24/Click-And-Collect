const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 

// Support multiple env var naming conventions (fallbacks)
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD || process.env.CLOUDINARY_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY || process.env.Cloudinary_Key;
const API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET_KEY;

if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    console.warn('Cloudinary credentials are missing. Image uploads will fail. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env');
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

module.exports = cloudinary;
