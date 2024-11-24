const mongoose = require("mongoose");



const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, required: true },
      stock: { type: Number, required: true },

  images: { type: [String], required: true },
      selectedSize: { type: String, required: true }, // Store selected size
      selectedColor: { type: String, required: true }, // Store selected color
    }],
    totalPrice: { type: Number, required: true },
    shippingDetails: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      street: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      age: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] },
    expectedDeliveryDate: { type: Date, required: true },
    
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  