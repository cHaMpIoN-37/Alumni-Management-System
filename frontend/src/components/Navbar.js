import React from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const getRoleDisplay = (role) => {
    if (role === 'student') return 'Student';
    if (role === 'alumni') return 'Alumni';
    if (role === 'admin') return 'Admin';
    return role;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>A L M A</h2>
      </div>
      <div className="navbar-actions">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-badge">{getRoleDisplay(user.role)}</span>
          {user.graduationYear && (
            <span className="graduation-year">Class of {user.graduationYear}</span>
          )}
        </div>
        <button onClick={onLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
