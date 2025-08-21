import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validate = () => {
    const newErrors = {};

    if (!email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      newErrors.email = 'Only Gmail addresses are allowed';
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Password must be 8+ chars, include a number and uppercase letter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
          navigate('/success', { state: { email: data.email } });
        } else {
          setErrors({ server: data.error || 'Registration failed' });
        }
      } catch (err) {
        setErrors({ server: 'Server error. Please try again.' });
      }
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setErrors({});
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@gmail.com"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors.server && <p className="error">{errors.server}</p>}

        <button type="submit">Register</button>
        <button type="button" onClick={handleReset}>Retry</button>
      </form>
    </div>
  );
};

export default Register;