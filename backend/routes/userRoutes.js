// routes/userRoutes.js

const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (any authenticated user)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only routes
router
  .route('/')
  .get(protect, admin, getUsers);

router
  .route('/stats')
  .get(protect, admin, getUserStats);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);

module.exports = router;
