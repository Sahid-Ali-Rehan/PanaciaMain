const express = require('express');
const Checkout = require('../models/Order'); // Path to your Checkout model
const router = express.Router();

// Create a new checkout order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingDetails, paymentMethod } = req.body;

    // Validate input
    if (!userId || !items || !totalPrice || !shippingDetails || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Calculate expected delivery date (e.g., 5 days from now)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

    const checkoutOrder = new Checkout({
      userId,
      items,
      totalPrice,
      shippingDetails,
      paymentMethod,
      expectedDeliveryDate,
    });

    const savedOrder = await checkoutOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Checkout.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Checkout.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
