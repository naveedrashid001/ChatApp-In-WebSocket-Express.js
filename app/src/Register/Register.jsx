import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/userroutes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
        setPhoneNumber('');
        setName('');
        setPassword('');

        Cookies.set('phoneNumber', phoneNumber, { expires: 7 });

        navigate('/AddProfile');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">Register</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100 mb-2"
            style={{ backgroundColor: '#1EBE57', color: 'white' }}
          >
            Register
          </button>
        </form>
        {message && <p className="text-center text-danger">{message}</p>}
        <button
          onClick={() => navigate('/AddProfile')}
          className="btn w-100"
          style={{ backgroundColor: '#1EBE57', color: 'white' }}
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}

export default Register;
