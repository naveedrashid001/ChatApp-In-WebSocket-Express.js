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
    Cookies.remove('phoneNumber');
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <div style={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
        <ToastContainer />
        <h1 className='mb-0'>Profile</h1>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <img
            src={imageUrl || defaultImage}
            alt="Profile"
            style={{ width: '200px', height: '200px', borderRadius: '50%', marginTop:"0px" }}
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
            /> <br />
            <button onClick={saveImage} style={{ backgroundColor: '#1EBE57', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
              Save Image
            </button>
            <button onClick={() => setShowInputs(false)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
              Cancel
            </button>
          </div>
        )} <br />

        <button 
          className='btn w-30' 
          onClick={handleSkip}  
          style={{ backgroundColor: '#1EBE57', color: 'white', marginTop: '5px', padding: '5px 10px', borderRadius: '5px' }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default AddProfile;
