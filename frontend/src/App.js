import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AlumniDashboard from './components/AlumniDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="fade-in">
      {user.role === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'alumni' && <AlumniDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}
