// src/components/Login.js

import React, { useState } from 'react';
import './Login.css';
import loginPhoto from '../assets/loginPhoto.jpg';

export default function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setName('');
    setEmail('');
    setGraduationYear('');
  };

  const isAlumniEmail = email.includes('@') &&
    !email.endsWith('@college.edu') &&
    !email.endsWith('@admin.com');

  const handleAuth = async (mode) => {
    if (
      !name ||
      !email ||
      (mode === 'register' && isAlumniEmail && !graduationYear) ||
      (mode === 'login' && isAlumniEmail && !graduationYear)
    ) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        mode === 'register'
          ? '/api/users/register'
          : '/api/users/login';

      const body = {
        name,
        email,
        ...(isAlumniEmail && { graduationYear }),
      };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin(data);
      } else {
        alert(data.message || 'Error during authentication');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>ALMA</h1>
        <p>Alumni Linking and Management Application</p>

        {showRegister ? (
          <>
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {isAlumniEmail && (
              <input
                className="login-input"
                type="number"
                placeholder="Graduation Year (e.g., 2020)"
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
              />
            )}
            <button
              className="login-button"
              onClick={() => handleAuth('register')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
            <button
              className="login-button secondary"
              onClick={() => {
                setShowRegister(false);
                resetFields();
              }}
              disabled={loading}
            >
              Back to Sign In
            </button>
          </>
        ) : (
          <>
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {isAlumniEmail && (
              <input
                className="login-input"
                type="number"
                placeholder="Graduation Year (e.g., 2020)"
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
              />
            )}
            <button
              className="login-button"
              onClick={() => handleAuth('login')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            <button
              className="login-button"
              onClick={() => {
                setShowRegister(true);
                resetFields();
              }}
              disabled={loading}
            >
              Sign Up
            </button>
          </>
        )}

        <div className="login-info">
          <p>Students: Use @college.edu email</p>
          <p>Admins: Use @admin.com email</p>
          <p>Alumni: Any other email + graduation year</p>
        </div>
      </div>
    </div>
  );
}
