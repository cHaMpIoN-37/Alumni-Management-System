import React, { useState } from 'react';
import './Alumni.css';

const initialAlumni = [
  { id: 1, name: 'Sarah', year: 2020, email: 'sarah@u.com' },
  { id: 2, name: 'Raj', year: 2021, email: 'raj@u.com' },
];

export default function Alumni() {
  const [alumni, setAlumni] = useState(initialAlumni);
  const [form, setForm] = useState({ name: '', year: '', email: '' });

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addAlumni = () => {
    if (!form.name || !form.year || !form.email) return;
    setAlumni([{ id: Date.now(), ...form }, ...alumni]);
    setForm({ name: '', year: '', email: '' });
  };

  const deleteAlumni = id => setAlumni(alumni.filter(a => a.id !== id));

  return (
    <div className="alumni-container">
      <h2>Alumni Directory</h2>
      <div className="form-row">
        <input name="name" placeholder="Name" value={form.name} onChange={handleInput} />
        <input name="year" placeholder="Grad Year" value={form.year} onChange={handleInput} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleInput} />
        <button onClick={addAlumni}>Add</button>
      </div>
      <ul className="alumni-list">
        {alumni.map(a => (
          <li key={a.id}>
            <span>{a.name} ({a.year})</span>
            <span>{a.email}</span>
            <button className="delete-btn" onClick={() => deleteAlumni(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
