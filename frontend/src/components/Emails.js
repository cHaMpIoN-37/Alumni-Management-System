import React, { useState } from 'react';
import './Emails.css';

const groups = ['2020 Graduates', '2021 Graduates', 'All Alumni'];

export default function Emails() {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const sendEmail = () => {
    if (!message.trim()) {
      alert('Please write a message before sending');
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="emails-container">
      <h2>Email Campaign</h2>
      <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
        {groups.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendEmail}>Send to {selectedGroup}</button>
      {sent && <div className="toast">Emails sent!</div>}
    </div>
  );
}
