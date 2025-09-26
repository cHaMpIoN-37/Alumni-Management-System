// routes/jobRoutes.js

const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  applyJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: get all jobs
router.get('/', getJobs);

// Public: get single job by ID
router.get('/:id', getJobById);

// Private (alumni, admin): create new job posting
router.post('/', protect, createJob);

// Private (student): apply to a job
router.post('/:id/apply', protect, applyJob);

// Private (alumni who posted, admin): update job
router.put('/:id', protect, updateJob);

// Private (alumni who posted, admin): delete job
router.delete('/:id', protect, deleteJob);

module.exports = router;
