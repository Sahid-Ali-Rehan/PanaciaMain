// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');

const checkoutRoutes = require('./routes/checkoutRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.log("MongoDB connection error:", err);
    res.status(500).json({ message: "Failed to connect to database" });
  });
  mongoose.set('debug', true); // This will log all MongoDB queries in the console


// Example Route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Sign-Up Route
app.post("/signup", async (req, res) => {
  const { firstName, lastName, phone, email, password, confirmPassword } = req.body;

  if (!firstName || !phone || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ firstName, lastName, phone, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Sign-In Route
// Assuming your signin route looks like this in your backend
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if password matches
  if (!(await user.matchPassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10000h' });

  // Send the token and role in the response
  res.json({
    token,
    role: user.role,  // Make sure to send the role from the database
    userID: user.id
  });
});



// Protect Routes - Middleware for Authorization
// Protect Routes - Middleware for Authorization
const protect = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  console.log("Received Token:", token);  // Log token to check if it's being received correctly

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


// Admin Role Route (Only accessible to admin)
// Admin Role Route (Only accessible to admin)
app.get("/admin", protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome Admin!" });
});




// Update User Profile
// Fetch User Profile Route
app.get('/api/user-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstName lastName email phone'); // Select all fields you need
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send the user data as response
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Update User Profile Route
app.post('/api/update-profile', protect, async (req, res) => {
  const { firstName, lastName, email, phone, password, oldPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password is correct when updating the password
    if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Update user profile
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // If the password is updated, hash the new password and update it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Use routes
app.use('/api/products', productRoutes);


app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Assuming Product is a Mongoose model
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...req.body, // Spread the request body to update fields
      },
      { new: true, runValidators: true } // Return the updated document and validate the data
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id); // Assuming you're using Mongoose for MongoDB
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// app.js or wherever your routes are defined
app.get('/api/reviews', async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  try {
    // Fetch reviews for the specific product
    const reviews = await Review.find({ product: productId }).populate('product', 'name'); // Populate product name if needed
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});



// Route to update user roles
app.put('/api/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    // Find the user to be updated
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to change the master admin role
    if (user.role === 'admin' && user._id.toString() === process.env.MASTER_ADMIN_ID) {
      return res.status(403).json({ message: 'Cannot change the role of the master admin.' });
    }

    // Update user role if valid
    if (role === 'admin' || role === 'user') {
      user.role = role;
      await user.save();
      return res.json({ role: user.role });
    }

    return res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    console.error('Error changing user role:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users for the admin
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from the database
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(users); // Return users as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user to be deleted
    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user to be deleted is the master admin (Lotif@gmail.com)
    if (userToDelete.email === 'Lotif@gmail.com' && userToDelete.role === 'admin') {
      return res.status(403).json({ message: 'You cannot delete the master admin' });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    // Send success response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/create', async (req, res) => {
  const { userId, items, totalPrice, shippingAddress, paymentMethod } = req.body;

  try {
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    const order = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});



// Fetch user's cart
app.get('/cart',  async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });
    res.json(userCart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});



app.post('/api/checkout/create', async (req, res) => {
  console.log('Request Body:', req.body); // Log request body

  try {
    const { items, totalPrice, shippingDetails, paymentMethod, status, expectedDeliveryDate } = req.body;

    // Check if all items have size and color selected
    const missingSelection = items.some(item => !item.selectedSize || !item.selectedColor);
    if (missingSelection) {
      return res.status(400).json({ message: 'Please select both size and color for all items.' });
    }

    // Deduct stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId); // Find product by ID
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      // Check if sufficient stock is available
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save(); // Save updated product
    }

    // Create new order
    const order = new Order({
      items,
      totalPrice,
      shippingDetails,
      paymentMethod,
      status: paymentMethod === 'COD' ? 'Pending' : 'Confirmed',
      expectedDeliveryDate,
    });

    const savedOrder = await order.save();
    console.log('Saved Order:', savedOrder); // Log saved order
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error); // Log error
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get all orders
app.get('/api/orders', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate('items.productId');  // Populate to get product details

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    res.status(200).json(orders);  // Return orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to delete an order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to update an order's status
// Endpoint to update order status
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params; // Get the order ID from the URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    

    res.status(200).json(updatedOrder); // Respond with the updated order
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }

  
});



// Backend endpoint for statistics
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Get total number of orders
    const totalOrders = await Order.countDocuments();

    // Get total number of products
    const totalProducts = await Product.countDocuments();

    // Get total number of users
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
});


// Endpoint to get user-specific orders
// Apply the protect middleware to the `/api/my-orders` route
app.get('/api/my-orders', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    console.log("User object:", req.user);
  
    // Fetch orders belonging to the authenticated user
    const userOrders = await Order.find({ user: userId });

    if (userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch orders by user ID
app.get('/api/orders/user/:userId', protect, async (req, res) => {
  const { userId } = req.params;

  // Ensure userId matches the logged-in user
  if (req.user._id !== userId) {
    return res.status(401).json({ message: 'Unauthorized to access this user\'s orders' });
  }

  try {
    const userOrders = await Order.find({ user: userId }).populate('items.productId');
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Add a review
// Example in Express.js





// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});