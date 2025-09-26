import React, { useState } from 'react';
import Navbar from './Navbar';
import AlumniDirectory from './AlumniDirectory';
import Jobs from './Jobs';
import News from './News';
import Chat from './Chat';
import Events from './Events';
import Profile from './Profile';
import './Dashboard.css';
// import './AlumniDashboard.css';


export default function AlumniDashboard({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('directory');

  const tabs = [
    { id: 'directory', label: 'Alumni Network', icon: '👥' },
    { id: 'jobs', label: 'Post Jobs', icon: '💼' },
    { id: 'chat', label: 'Messages', icon: '💬' },
    { id: 'events', label: 'Events', icon: '📅' },
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
          {currentTab === 'directory' && <AlumniDirectory user={user} userRole="alumni" />}
          {currentTab === 'jobs' && <Jobs user={user} userRole="alumni" />}
          {currentTab === 'chat' && <Chat user={user} userRole="alumni" />}
          {currentTab === 'events' && <Events user={user} userRole="alumni" />}
          {currentTab === 'news' && <News user={user} userRole="alumni" />}
          {currentTab === 'profile' && <Profile user={user} userRole="alumni" />}
        </div>
      </div>
    </>
  );
}
