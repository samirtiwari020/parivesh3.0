// src/controllers/userController.js

const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const allowedStaffRoles = ["STATE_REVIEWER", "CENTRAL_REVIEWER"];

const createActivityLog = async ({ userId, action, description, referenceId }) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      module: "USER",
      referenceId,
      referenceModel: "User",
      description,
    });
  } catch {
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, organization } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, organization },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};

exports.createStaffUser = async (req, res) => {
  try {
    const { name, email, password, role, state, phone, organization } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "name, email, password and role are required",
      });
    }

    if (!allowedStaffRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Only STATE_REVIEWER or CENTRAL_REVIEWER can be created here",
      });
    }

    if (role === "STATE_REVIEWER" && !state) {
      return res.status(400).json({
        success: false,
        message: "State is required for STATE_REVIEWER",
      });
    }

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
      state: role === "STATE_REVIEWER" ? state : null,
      phone,
      organization,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    await createActivityLog({
      userId: req.user._id,
      action: "STAFF_USER_CREATED",
      description: `Staff user created: ${user.email}`,
      referenceId: user._id,
    });

    res.status(201).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create staff user",
      error: error.message,
    });
  }
};

// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await createActivityLog({
      userId: req.user._id,
      action: "USER_UPDATED",
      description: `User updated: ${user.email}`,
      referenceId: user._id,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User update failed",
      error: error.message,
    });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await createActivityLog({
      userId: req.user._id,
      action: "USER_DELETED",
      description: `User deleted: ${user.email}`,
      referenceId: user._id,
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User deletion failed",
      error: error.message,
    });
  }
};