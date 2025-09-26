// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'alumni', 'admin'],
      default: 'alumni'
    },
    graduationYear: {
      type: Number,
      required: function () {
        return this.role === 'alumni';
      }
    },
    department: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
