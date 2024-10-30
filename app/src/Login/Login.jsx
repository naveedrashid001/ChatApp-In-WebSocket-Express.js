import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/userroutes/login', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, password }),
          });
          

      const data = await response.json();

      if (response.ok) {
        onLogin(); // Update authentication status
        navigate('/mainpage'); // Redirect to home page
      } else {
        setErrorMessage(data.message || 'Invalid phone number or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Welcome to WhatsApp</h1>
      <p>Please enter your phone number to continue</p>
      <form id="login-form" onSubmit={handleLogin}>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default Login;
