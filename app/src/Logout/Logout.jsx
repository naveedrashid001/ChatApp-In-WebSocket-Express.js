import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Logout() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('isAuthenticated');
    navigate('/'); 
  };

  return (
    <>
      <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Logout;
