// controllers/jobController.js

const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (alumni, admin)
const createJob = async (req, res) => {
  try {
    const { title, company, description, requirements } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Title, company and description are required' });
    }

    const newJob = await Job.create({
      title,
      company,
      description,
      requirements,
      postedBy: req.user.id,
      postedDate: new Date(),
      applications: []
    });

    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all job postings
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email role')
      .sort({ postedDate: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email role')
      .populate('applications.student', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (student)
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Prevent non-students
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }

    // Prevent duplicate applications
    if (job.applications.some(app => app.student.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applications.push({
      student: req.user.id,
      appliedDate: new Date()
    });
    await job.save();

    res.json({ message: 'Application submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (alumni who posted it, admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only poster or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, company, description, requirements } = req.body;
    job.title = title || job.title;
    job.company = company || job.company;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (alumni who posted it, admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.remove();
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  applyJob,
  updateJob,
  deleteJob
};
