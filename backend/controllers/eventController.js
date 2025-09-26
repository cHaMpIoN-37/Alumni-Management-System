// controllers/eventController.js

const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, maxAttendees } = req.body;
    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Title, date, and location are required' });
    }

    const event = await Event.create({
      title,
      date: new Date(date),
      time,
      location,
      description,
      maxAttendees: parseInt(maxAttendees, 10) || 100,
      createdBy: req.user.id,
      rsvps: []
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    RSVP to an event (toggle)
// @route   POST /api/events/:id/rsvp
// @access  Private (student, alumni, admin)
const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user.id;
    const index = event.rsvps.indexOf(userId);

    // If already RSVPed, remove; else add if capacity not reached
    if (index > -1) {
      event.rsvps.splice(index, 1);
    } else {
      if (event.rsvps.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
      event.rsvps.push(userId);
    }

    await event.save();
    res.json({ rsvps: event.rsvps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, date, time, location, description, maxAttendees } = req.body;
    event.title = title || event.title;
    event.date = date ? new Date(date) : event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.description = description || event.description;
    event.maxAttendees = maxAttendees ? parseInt(maxAttendees, 10) : event.maxAttendees;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  rsvpEvent,
  updateEvent,
  deleteEvent
};
