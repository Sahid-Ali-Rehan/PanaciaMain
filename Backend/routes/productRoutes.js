const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add product route
router.post('/add-product', async (req, res) => {
  const {
    name, description, price, discount, category, subcategory, stock, images, sizeChart, isAvailable, colors, sizes, productCode , isBestSeller
  } = req.body;

  console.log('Request Data:', req.body); // Log the request for debugging

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      category,
      subcategory,
      stock,
      images,
      sizeChart,
      isAvailable,
      isBestSeller,
      availableColors: colors || [],
      availableSizes: sizes || [],
      productCode, // Directly use the productCode from the request
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (err) {
    console.error('Error adding product:', err.message); // Log the error message for better clarity
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

module.exports = router;
