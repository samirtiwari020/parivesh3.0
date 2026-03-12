const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const env = require("../config/env");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, state, phone, organization } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      state,
      phone,
      organization,
    });

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE,
    });

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};