// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
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



// Fetch User Profile Route
app.get('/api/user-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstName'); // Only select firstName
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send the user data as response
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
