import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!/^\d{11}$/.test(phoneNumber)) {
      toast.error('Phone number must be exactly 11 digits.'); // Use toast for error
      return;
    }
    if (name.length < 5) {
      toast.error('Name must be at least 5 characters.'); // Use toast for error
      return;
    }
    if (password.length < 6 || password.length > 12) {
      toast.error('Password must be between 6 and 12 characters.'); // Use toast for error
      return;
    }

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
        toast.success('Registration successful!'); // Use toast for success
        setPhoneNumber('');
        setName('');
        setPassword('');
        Cookies.set('phoneNumber', phoneNumber, { expires: 7 });
        navigate('/AddProfile');
      } else {
        toast.error(data.message || 'Registration failed.'); // Use toast for error
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('An error occurred. Please try again later.'); // Use toast for error
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
        <button
          onClick={() => navigate('/AddProfile')}
          className="btn w-100"
          style={{ backgroundColor: '#1EBE57', color: 'white' }}
        >
          Already have an account? Log in
        </button>
      </div>
      <ToastContainer /> {/* Add ToastContainer to your component */}
    </div>
  );
}

export default Register;
