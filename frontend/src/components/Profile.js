import React, { useState } from 'react';
import './Profile.css';

export default function Profile({ user, userRole }) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    graduationYear: user.graduationYear || '',
    department: userRole === 'student' ? 'Computer Science' : 'Computer Science',
    location: 'San Francisco, CA',
    company: userRole === 'student' ? 'Current Student' : 'Tech Corp',
    position: userRole === 'student' ? 'Undergraduate' : 'Software Engineer',
    bio: userRole === 'student' ? 'Computer Science student passionate about technology.' : 'Experienced software engineer.',
    skills: userRole === 'student' ? ['Python', 'JavaScript', 'React'] : ['JavaScript', 'React', 'Node.js', 'Python'],
    linkedin: '',
    github: '',
    website: ''
  });
  
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditing(false);
  };

  const updateField = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  const getRoleTitle = () => {
    if (userRole === 'student') return 'Student Profile';
    if (userRole === 'alumni') return 'Alumni Profile';
    return 'Admin Profile';
  };

  return (
    <div className="profile-container slide-up">
      <div className="profile-header">
        <h2>{getRoleTitle()}</h2>
        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          {editing ? (
            <input
              type="text"
              value={tempProfile.name}
              onChange={e => updateField('name', e.target.value)}
              className="profile-input name-input"
            />
          ) : (
            <h2>{profile.name}</h2>
          )}
          {editing ? (
            <input
              type="text"
              value={tempProfile.position}
              onChange={e => updateField('position', e.target.value)}
              placeholder="Title/Position"
              className="profile-input"
            />
          ) : (
            <p className="profile-title">{profile.position} {profile.company !== 'Current Student' ? `at ${profile.company}` : ''}</p>
          )}
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Email</label>
                <span>{profile.email}</span>
              </div>
              
              {userRole !== 'admin' && (
                <div className="detail-item">
                  <label>{userRole === 'student' ? 'Expected Graduation' : 'Graduation Year'}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={tempProfile.graduationYear}
                      onChange={e => updateField('graduationYear', e.target.value)}
                      className="profile-input"
                    />
                  ) : (
                    <span>{profile.graduationYear ? `Class of ${profile.graduationYear}` : 'Not specified'}</span>
                  )}
                </div>
              )}
              
              <div className="detail-item">
                <label>Department</label>
                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.department}
                    onChange={e => updateField('department', e.target.value)}
                    className="profile-input"
                  />
                ) : (
                  <span>{profile.department}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.location}
                    onChange={e => updateField('location', e.target.value)}
                    className="profile-input"
                  />
                ) : (
                  <span>{profile.location}</span>
                )}
              </div>
            </div>
          </div>

          {userRole !== 'student' && (
            <div className="detail-section">
              <h3>Professional</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Company</label>
                  {editing ? (
                    <input
                      type="text"
                      value={tempProfile.company}
                      onChange={e => updateField('company', e.target.value)}
                      className="profile-input"
                    />
                  ) : (
                    <span>{profile.company}</span>
                  )}
                </div>
                <div className="detail-item full-width">
                  <label>Bio</label>
                  {editing ? (
                    <textarea
                      value={tempProfile.bio}
                      onChange={e => updateField('bio', e.target.value)}
                      className="profile-input"
                      rows={3}
                    />
                  ) : (
                    <p>{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Skills & Interests</h3>
            <div className="skills-container">
              {editing ? (
                <input
                  type="text"
                  value={tempProfile.skills.join(', ')}
                  onChange={e => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Comma separated skills"
                  className="profile-input"
                />
              ) : (
                <div className="skills-list">
                  {profile.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
