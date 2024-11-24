// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product');
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
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send the token and role in the response
  res.json({
    token,
    role: user.role,  // Make sure to send the role from the database
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

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
  
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






// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});