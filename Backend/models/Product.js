const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  sizeChart: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  availableColors: { type: [String], default: [] },
  availableSizes: { type: [String], default: [] },
  productCode: { type: String, unique: true, required: true },
  isBestSeller: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Add this
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
