import React, { useState } from 'react';
import './EmailCampaign.css';

const groups = [
  { id: 'all', name: 'All Users', count: 245 },
  { id: 'students', name: 'All Students', count: 156 },
  { id: 'alumni', name: 'All Alumni', count: 85 },
  { id: '2020', name: 'Class of 2020', count: 25 },
  { id: '2021', name: 'Class of 2021', count: 30 }
];

export default function EmailCampaign() {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }
    
    setSending(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSending(false);
    setSent(true);
    
    // Reset form
    setSubject('');
    setMessage('');
    
    // Hide success message after 3 seconds
    setTimeout(() => setSent(false), 3000);
  };

  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  return (
    <div className="email-campaign slide-up">
      <h2>Email Campaign</h2>
      
      <div className="campaign-form">
        <div className="form-section">
          <h3>Select Recipients</h3>
          <div className="recipient-groups">
            {groups.map(group => (
              <label key={group.id} className="group-option">
                <input
                  type="radio"
                  name="group"
                  value={group.id}
                  checked={selectedGroup === group.id}
                  onChange={e => setSelectedGroup(e.target.value)}
                />
                <div className="group-info">
                  <span className="group-name">{group.name}</span>
                  <span className="group-count">{group.count} members</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Email Details</h3>
          <input
            type="text"
            placeholder="Email Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="email-input"
          />
          <textarea
            placeholder="Email Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={8}
            className="email-input"
          />
        </div>

        <div className="form-section">
          <div className="campaign-summary">
            <h3>Campaign Summary</h3>
            <p>Sending to: <strong>{selectedGroupData?.name}</strong></p>
            <p>Recipients: <strong>{selectedGroupData?.count} members</strong></p>
          </div>
          
          <button
            onClick={sendEmail}
            disabled={sending || !subject.trim() || !message.trim()}
            className={`btn btn-primary send-btn ${sending ? 'sending' : ''}`}
          >
            {sending ? 'Sending...' : `Send to ${selectedGroupData?.count} Members`}
          </button>
        </div>
      </div>

      {sent && (
        <div className="success-notification scale-in">
          ✅ Email campaign sent successfully to {selectedGroupData?.name}!
        </div>
      )}
    </div>
  );
}
