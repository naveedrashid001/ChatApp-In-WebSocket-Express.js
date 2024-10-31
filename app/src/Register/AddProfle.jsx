import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

function AddProfile() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const defaultImage = 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg';
  
  // Retrieve phone number from cookies
  const phoneNumber = Cookies.get('phoneNumber');

  const saveImage = async () => {
    if (!phoneNumber) {
      toast.error("Phone number not found in cookies.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/userroutes/addImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, imageUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Image saved successfully!");
        clearSession();
      } else {
        toast.error(data.message || "Error saving the image.");
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error("An error occurred while saving the image.");
    }
  };

  const handleSkip = () => {
    clearSession();
  };

  const clearSession = () => {
    // Clear cookies and local storage
    Cookies.remove('phoneNumber');
    localStorage.clear(); 

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <ToastContainer />
      <h1>Add Profile Image</h1>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={imageUrl || defaultImage}
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
        <i
          className="bi bi-camera"
          onClick={() => setShowInputs(true)}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#fff',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            padding: '5px',
          }}
        ></i>
      </div>

      {showInputs && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="url"
            placeholder="Paste Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ marginBottom: '10px', width: '200px', padding: '5px' }}
          />
          <button onClick={saveImage}>Save Image</button>
        </div>
      )}

      <button onClick={handleSkip} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Skip
      </button>
    </div>
  );
}

export default AddProfile;
