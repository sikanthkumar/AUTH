import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Welcome.css';

const Welcome = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="welcome-container">
      <h2>Welcome 🎉</h2>
      <p>Successfully logged in as <strong>{email}</strong></p>
      <p>This is your AI-powered career dashboard.</p>
    </div>
  );
};

export default Welcome;