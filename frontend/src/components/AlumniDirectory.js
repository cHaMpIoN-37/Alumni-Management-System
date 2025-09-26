import React, { useState } from 'react';
import './AlumniDirectory.css';

const initialAlumni = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    year: 2020, 
    email: 'sarah@example.com',
    department: 'Computer Science',
    location: 'San Francisco, CA',
    company: 'Google',
    role: 'alumni'
  },
  { 
    id: 2, 
    name: 'Mike Chen', 
    year: 2021, 
    email: 'mike@college.edu',
    department: 'Engineering',
    location: 'New York, NY',
    company: 'Student',
    role: 'student'
  }
];

export default function AlumniDirectory({ user, userRole }) {
  const [members, setMembers] = useState(initialAlumni);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canMessage = (targetUser) => {
    if (userRole === 'student') return targetUser.role === 'alumni';
    if (userRole === 'alumni') return true;
    if (userRole === 'admin') return true;
    return false;
  };

  return (
    <div className="directory-container slide-up">
      <div className="directory-header">
        <h2>{userRole === 'student' ? 'Find Alumni' : 'Member Directory'}</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="members-grid">
        {filteredMembers.map((person, index) => (
          <div key={person.id} className="member-card" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="member-avatar">
              {person.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="member-info">
              <h3>{person.name}</h3>
              <p className="member-title">{person.company}</p>
              <p className="member-details">{person.department}</p>
              <p className="member-location">{person.location}</p>
              {person.year && <p className="member-year">Class of {person.year}</p>}
            </div>
            <div className="member-actions">
              {canMessage(person) && (
                <button className="btn btn-primary">Message</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
