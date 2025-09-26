import React, { useState } from 'react';
import './Donation.css';

export default function Donation() {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDonate = () => {
    if (!amount || !donorName || !donorEmail) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    // Here you would send donation data to backend or payment gateway
  };

  return (
    <div className="donation-container">
      <h2>Support the Alumni Network</h2>
      {!submitted ? (
        <div className="donation-form">
          <input
            type="number"
            placeholder="Donation Amount (USD)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={donorName}
            onChange={e => setDonorName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={donorEmail}
            onChange={e => setDonorEmail(e.target.value)}
          />
          <textarea
            placeholder="Leave a message (optional)"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleDonate}>
            Donate
          </button>
        </div>
      ) : (
        <div className="thank-you">
          <h3>Thank you for your generous donation!</h3>
          <p>We appreciate your support.</p>
        </div>
      )}
    </div>
  );
}
