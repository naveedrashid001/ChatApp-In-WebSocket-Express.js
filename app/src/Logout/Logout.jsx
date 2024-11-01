import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all cookies by iterating over each key
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    // Clear local storage
    localStorage.clear();

    // Navigate to the home page
    navigate('/');
  };

  return (
    <button className='btn btn-outline-danger' onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
