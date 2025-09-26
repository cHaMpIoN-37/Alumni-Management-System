import React, { useState } from 'react';
import Navbar from './Navbar';
import UserManagement from './UserManagement';
import AlumniDirectory from './AlumniDirectory';
import Jobs from './Jobs';
import News from './News';
import Events from './Events';
import EmailCampaign from './EmailCampaign';
import './Dashboard.css';

export default function AdminDashboard({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Manage Users', icon: '⚙️' },
    { id: 'directory', label: 'All Members', icon: '👥' },
    { id: 'jobs', label: 'Job Postings', icon: '💼' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'news', label: 'News Feed', icon: '📰' },
    { id: 'email', label: 'Email Campaign', icon: '📧' }
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
          {currentTab === 'users' && <UserManagement user={user} />}
          {currentTab === 'directory' && <AlumniDirectory user={user} userRole="admin" />}
          {currentTab === 'jobs' && <Jobs user={user} userRole="admin" />}
          {currentTab === 'events' && <Events user={user} userRole="admin" />}
          {currentTab === 'news' && <News user={user} userRole="admin" />}
          {currentTab === 'email' && <EmailCampaign user={user} />}
        </div>
      </div>
    </>
  );
}
