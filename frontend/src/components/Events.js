// src/components/Events.js
import React, { useState } from 'react';
import './Events.css';

const initialEvents = [
  {
    id: 1,
    title: 'Annual Homecoming 2025',
    date: '2025-10-15',
    time: '18:00',
    location: 'Main Campus Auditorium',
    description: 'Join us for our annual homecoming celebration with networking, dinner, and entertainment.',
    rsvps: [],
    maxAttendees: 200
  }
];

export default function Events({ user, userRole }) {
  const [events, setEvents] = useState(initialEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: '', maxAttendees: ''
  });

  const canCreateEvents = userRole === 'admin';
  const canDeleteEvents = userRole === 'admin';

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      alert('Please fill in all required fields');
      return;
    }
    const event = {
      ...newEvent,
      id: Date.now(),
      maxAttendees: parseInt(newEvent.maxAttendees) || 100,
      rsvps: []
    };
    setEvents([event, ...events]);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', maxAttendees: '' });
    setShowEventForm(false);
  };

  const handleRSVP = (eventId) => {
    setEvents(events.map(ev => {
      if (ev.id !== eventId) return ev;
      const hasRSVPed = ev.rsvps.includes(user.email);
      let updated = [...ev.rsvps];
      if (!hasRSVPed && ev.rsvps.length < ev.maxAttendees) {
        updated.push(user.email);
      } else if (hasRSVPed) {
        updated = updated.filter(e => e !== user.email);
      }
      return { ...ev, rsvps: updated };
    }));
  };

  const deleteEvent = (eventId) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(ev => ev.id !== eventId));
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        {canCreateEvents && (
          <button
            className="btn btn-primary"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            Create Event
          </button>
        )}
      </div>

      {showEventForm && (
        <div className="event-form">
          <h3>Create New Event</h3>
          <div className="form-grid">
            <input
              placeholder="Event Title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
            />
            <input
              placeholder="Location"
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Attendees"
              value={newEvent.maxAttendees}
              onChange={e => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleCreateEvent} className="btn btn-primary">
              Create Event
            </button>
            <button onClick={() => setShowEventForm(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="events-list">
        {events.map((ev, idx) => (
          <div key={ev.id} className="event-card">
            <div className="event-date">
              <span className="event-month">
                {new Date(ev.date).toLocaleDateString('en', { month: 'short' })}
              </span>
              <span className="event-day">
                {new Date(ev.date).getDate()}
              </span>
            </div>
            <div className="event-content">
              <h3>{ev.title}</h3>
              <div className="event-details">
                <p>🕒 {ev.time}</p>
                <p>📍 {ev.location}</p>
                <p>👥 {ev.rsvps.length}/{ev.maxAttendees}</p>
              </div>
              <p className="event-description">{ev.description}</p>
              <div className="event-actions">
                <button
                  onClick={() => handleRSVP(ev.id)}
                  className={`btn ${ev.rsvps.includes(user.email) ? 'btn-success' : 'btn-primary'}`}
                  disabled={!ev.rsvps.includes(user.email) && ev.rsvps.length >= ev.maxAttendees}
                >
                  {ev.rsvps.includes(user.email) ? 'Attending ✓' : 'RSVP'}
                </button>

                {canDeleteEvents && (
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="btn btn-danger"
                  >
                    Delete Event
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
