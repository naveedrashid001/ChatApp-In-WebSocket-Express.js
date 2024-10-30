import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a random avatar SVG
    const avatarSvg = createAvatar(style, { seed: phoneNumber || Math.random().toString() });

    try {
      const response = await fetch('http://localhost:3000/userroutes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, name, password, avatar: avatarSvg }), // Send avatar SVG as string
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
        setPhoneNumber('');
        setName('');
        setPassword('');

        // Redirect to the login page
        navigate('/login');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/login')}>Already have an account? Log in</button>
    </div>
  );
}

export default Register;
