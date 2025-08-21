import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Success.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  return (
    <div className="success-container">
      <h2>Registration Successful 🎉</h2>
      <p>Welcome, <strong>{email}</strong>! Your account has been created.</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default Success;