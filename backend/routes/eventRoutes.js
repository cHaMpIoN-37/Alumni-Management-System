// routes/eventRoutes.js

const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  rsvpEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: get all events
router.get('/', getEvents);

// Public: get single event
router.get('/:id', getEventById);

// Private/Admin: create new event
router.post('/', protect, admin, createEvent);

// Private (student, alumni, admin): RSVP toggle
router.post('/:id/rsvp', protect, rsvpEvent);

// Private/Admin: update event
router.put('/:id', protect, admin, updateEvent);

// Private/Admin: delete event
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
