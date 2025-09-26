const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, graduationYear, role } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Auto-determine role based on email if not provided
    let userRole = role;
    if (!userRole) {
      if (email.endsWith('@admin.com')) {
        userRole = 'admin';
      } else if (email.endsWith('@college.edu')) {
        userRole = 'student';
      } else {
        userRole = 'alumni';
      }
    }

    // Validate graduation year for alumni
    if (userRole === 'alumni' && !graduationYear) {
      return res.status(400).json({ message: 'Graduation year is required for alumni' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      graduationYear: userRole === 'alumni' ? graduationYear : null,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        graduationYear: user.graduationYear,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, name, graduationYear } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Please provide email and name' });
    }

    // Auto-determine role based on email
    let role = 'alumni';
    if (email.endsWith('@admin.com')) {
      role = 'admin';
    } else if (email.endsWith('@college.edu')) {
      role = 'student';
    }

    // Validate graduation year for alumni
    if (role === 'alumni' && !graduationYear) {
      return res.status(400).json({ message: 'Graduation year is required for alumni' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create them (auto-registration on login)
    if (!user) {
      user = await User.create({
        name,
        email,
        graduationYear: role === 'alumni' ? graduationYear : null,
        role,
      });
    } else {
      // Update user info if they exist
      user.name = name;
      if (role === 'alumni') {
        user.graduationYear = graduationYear;
      }
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      graduationYear: user.graduationYear,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department || user.department;
      user.location = req.body.location || user.location;
      user.company = req.body.company || user.company;
      user.position = req.body.position || user.position;
      user.bio = req.body.bio || user.bio;
      user.linkedin = req.body.linkedin || user.linkedin;
      user.phone = req.body.phone || user.phone;
      
      // Only update graduation year for alumni
      if (user.role === 'alumni' && req.body.graduationYear) {
        user.graduationYear = req.body.graduationYear;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        graduationYear: updatedUser.graduationYear,
        role: updatedUser.role,
        department: updatedUser.department,
        location: updatedUser.location,
        company: updatedUser.company,
        position: updatedUser.position,
        bio: updatedUser.bio,
        linkedin: updatedUser.linkedin,
        phone: updatedUser.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Alumni Directory)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const { search, role, department, graduationYear } = req.query;
    
    // Build query object
    let query = {};
    
    // Search by name, company, or department
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by department
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    
    // Filter by graduation year
    if (graduationYear) {
      query.graduationYear = graduationYear;
    }

    const users = await User.find(query)
      .select('-__v')
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Get graduation year distribution for alumni
    const graduationYearStats = await User.aggregate([
      { $match: { role: 'alumni', graduationYear: { $exists: true } } },
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    // Get department distribution
    const departmentStats = await User.aggregate([
      { $match: { department: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalAlumni,
      totalAdmins,
      graduationYearStats,
      departmentStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  getUserStats,
};