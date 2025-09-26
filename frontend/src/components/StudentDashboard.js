import React, { useState } from 'react';
import Navbar from './Navbar';
import AlumniDirectory from './AlumniDirectory';
import Jobs from './Jobs';
import News from './News';
import Chat from './Chat';
import Profile from './Profile';
import './Dashboard.css';

export default function StudentDashboard({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('directory');

  const tabs = [
    { id: 'directory', label: 'Find Alumni', icon: '👥' },
    { id: 'jobs', label: 'Job Board', icon: '💼' },
    { id: 'chat', label: 'Messages', icon: '💬' },
    { id: 'news', label: 'News Feed', icon: '📰' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="dashboard">
        <div className="sidebar">
          <div className="sidebar-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-tab ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="dashboard-content">
          {currentTab === 'directory' && <AlumniDirectory user={user} userRole="student" />}
          {currentTab === 'jobs' && <Jobs user={user} userRole="student" />}
          {currentTab === 'chat' && <Chat user={user} userRole="student" />}
          {currentTab === 'news' && <News user={user} userRole="student" />}
          {currentTab === 'profile' && <Profile user={user} userRole="student" />}
        </div>
      </div>
    </>
  );
}
