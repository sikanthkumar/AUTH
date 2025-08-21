import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Login = () => {
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

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });

        if (response.status === 200) {
          // Optional: Store token for future use
          localStorage.setItem('token', response.data.token);

          // Redirect to Welcome page
          navigate('/welcome', { state: { email } });
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        setErrors({ server: message });
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login to Dashboard</h2>
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
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors.server && <p className="error">{errors.server}</p>}

        <button type="submit">Login</button>
      </form>

      <button
        type="button"
        onClick={handleRegisterRedirect}
        className="register-redirect-button"
      >
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login;