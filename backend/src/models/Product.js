const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  publicId: {
    type: String,
    required: [true, 'Cloudinary Public ID is required']
  }
}, { _id: false }); // We don't need separate ObjectIDs for each image in the array

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true // Indexed for faster searching if needed later
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, 'A product must have at least one image']
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Custom validator to ensure at least one image exists
function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Product', productSchema);