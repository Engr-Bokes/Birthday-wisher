const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, dob } = req.body;
    const newUser = new User({ username, email, dob });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};
