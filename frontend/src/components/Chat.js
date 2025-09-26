import React, { useState } from 'react';
import './Chat.css';

export default function Chat({ user, userRole }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({
    "sarah@example.com": {
      name: "Sarah Johnson",
      role: "alumni",
      messages: ["Hi! How can I help you with your career?"]
    },
    "mike@college.edu": {
      name: "Mike Chen",
      role: "student", 
      messages: ["Hello! I'm interested in software engineering roles."]
    }
  });

  const getContacts = () => {
    if (userRole === 'student') {
      // Students can only message alumni
      return Object.entries(chats).filter(([email, contact]) => contact.role === 'alumni');
    } else {
      // Alumni and admin can message everyone
      return Object.entries(chats);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedContact) return;
    
    setChats(prev => ({
      ...prev,
      [selectedContact]: {
        ...prev[selectedContact],
        messages: [...prev[selectedContact].messages, `${user.name}: ${message}`]
      }
    }));
    setMessage('');
  };

  const contacts = getContacts();

  return (
    <div className="chat-container slide-up">
      <h2>Messages</h2>
      
      <div className="chat-interface">
        <div className="contacts-list">
          <h3>Contacts</h3>
          {contacts.map(([email, contact]) => (
            <button
              key={email}
              className={`contact-item ${selectedContact === email ? 'active' : ''}`}
              onClick={() => setSelectedContact(email)}
            >
              <div className="contact-avatar">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-role">{contact.role}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="chat-window">
          {selectedContact ? (
            <>
              <div className="chat-header">
                <h4>{chats[selectedContact].name}</h4>
                <span className="role-badge">{chats[selectedContact].role}</span>
              </div>
              
              <div className="messages-container">
                {chats[selectedContact].messages.map((msg, index) => (
                  <div key={index} className="message">
                    {msg}
                  </div>
                ))}
              </div>
              
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="btn btn-primary">Send</button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
