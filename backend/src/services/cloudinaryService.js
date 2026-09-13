const cloudinary = require('../config/cloudinary');

/**
 * Uploads a single image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The image file buffer from Multer
 * @returns {Promise<Object>} - The secure URL and public ID
 */
const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dev-studio-products', // Cloudinary folder name
        format: 'webp', // Automatically convert images to webp for better performance
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // End the stream with the buffer
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary using its public ID
 * @param {String} publicId - The Cloudinary public ID
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image with ID ${publicId}:`, error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};