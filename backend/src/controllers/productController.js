const Product = require('../models/Product');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { getIo } = require('../sockets/socket');

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product image is required' });
    }

    const uploadPromises = req.files.map((file) => uploadImage(file.buffer));
    const uploadedImages = await Promise.all(uploadPromises);

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      images: uploadedImages,
    });

    // --- SOCKET.IO EVENT: Emit the newly created product ---
    try {
      getIo().emit('product-created', product);
    } catch (socketErr) {
      console.error('Socket error on create:', socketErr);
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating product' });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching products' });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, existingImages } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let imagesToKeep = product.images; 
    if (existingImages !== undefined) {
      imagesToKeep = JSON.parse(existingImages);
    }

    const imagesToDelete = product.images.filter(
      (oldImg) => !imagesToKeep.some((keepImg) => keepImg.publicId === oldImg.publicId)
    );

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map((img) => deleteImage(img.publicId));
      await Promise.all(deletePromises);
    }

    let newUploadedImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file.buffer));
      newUploadedImages = await Promise.all(uploadPromises);
    }

    const finalImages = [...imagesToKeep, ...newUploadedImages];

    if (finalImages.length === 0) {
      return res.status(400).json({ success: false, message: 'A product must have at least one image' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.images = finalImages;

    const updatedProduct = await product.save();

    // --- SOCKET.IO EVENT: Emit the updated product ---
    try {
      getIo().emit('product-updated', updatedProduct);
    } catch (socketErr) {
      console.error('Socket error on update:', socketErr);
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((img) => deleteImage(img.publicId));
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    // --- SOCKET.IO EVENT: Emit the deleted product ID ---
    try {
      getIo().emit('product-deleted', req.params.id);
    } catch (socketErr) {
      console.error('Socket error on delete:', socketErr);
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting product' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};