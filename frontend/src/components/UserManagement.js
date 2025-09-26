import React, { useState } from 'react';
import './UserManagement.css';

const initialUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'alumni', graduationYear: '2020', status: 'active' },
  { id: 2, name: 'Mike Chen', email: 'mike@college.edu', role: 'student', graduationYear: '2026', status: 'active' },
  { id: 3, name: 'Admin User', email: 'admin@admin.com', role: 'admin', graduationYear: null, status: 'active' }
];

export default function UserManagement({ user }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const removeUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'var(--color-danger)';
      case 'alumni': return 'var(--color-primary)';
      case 'student': return 'var(--color-success)';
      default: return 'var(--color-secondary)';
    }
  };

  return (
    <div className="user-management slide-up">
      <div className="management-header">
        <h2>User Management</h2>
        <div className="management-stats">
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.role === 'student').length}</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.role === 'alumni').length}</span>
            <span className="stat-label">Alumni</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
      </div>

      <div className="management-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="filter-select">
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="alumni">Alumni</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="users-table">
        <div className="table-header">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Graduation</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filteredUsers.map(u => (
          <div key={u.id} className="table-row">
            <div className="user-cell">
              <div className="user-avatar">
                {u.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span>{u.name}</span>
            </div>
            <span className="email-cell">{u.email}</span>
            <span className="role-cell">
              <span className="role-badge" style={{ backgroundColor: getRoleColor(u.role) }}>
                {u.role}
              </span>
            </span>
            <span>{u.graduationYear || 'N/A'}</span>
            <span className={`status-cell ${u.status}`}>
              {u.status}
            </span>
            <div className="actions-cell">
              <button
                onClick={() => toggleUserStatus(u.id)}
                className={`btn btn-sm ${u.status === 'active' ? 'btn-warning' : 'btn-success'}`}
              >
                {u.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              {u.email !== user.email && (
                <button
                  onClick={() => removeUser(u.id)}
                  className="btn btn-sm btn-danger"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
