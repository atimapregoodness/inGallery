const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'inGallery',
    format: async (req, file) => { 'png', 'jpg', 'jpeg'; },  // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0],
  }
});

module.exports = {
  cloudinary,
  storage
};