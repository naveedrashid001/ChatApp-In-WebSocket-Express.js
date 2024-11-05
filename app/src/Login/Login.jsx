import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
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
        const { token } = data;

        Cookies.set('token', token, { expires: 7 });
        Cookies.set('phoneNumber', phoneNumber, { expires: 7 });

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => navigate('/mainpage'),
        });

        onLogin();
      } else {
        toast.error(data.message || 'Invalid phone number or password', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center text-success mb-4">Welcome</h1>
        <p className="text-center">Hey !    Here is WhatApp 2.0</p>
        <form id="login-form" onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-control"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn w-100 mb-3" style={{backgroundColor:"#1EBE57", color:"white"}}>Continue</button>
        </form>
        <button className=" btn w-100" style={{backgroundColor:"#1EBE57", color:"white"}} onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
