import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from '../../Logout/Logout';

function Profile() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editAvatar, setEditAvatar] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editAbout, setEditAbout] = useState(false);

  useEffect(() => {
    const phoneNumberFromCookies = Cookies.get('phoneNumber');
    if (!phoneNumberFromCookies) {
      console.error("Phone number not found in cookies.");
      return;
    }

    setPhoneNumber(phoneNumberFromCookies);

    fetch(`http://localhost:3000/userroutes/user?phoneNumber=${phoneNumberFromCookies}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setAvatar(data.avatar || '');
          setName(data.name || '');
          setAbout(data.about || '');
        } else {
          console.error("User data not found.");
        }
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleAvatarUrlChange = (e) => {
    setAvatar(e.target.value);
  };

  const saveChanges = async (field) => {
    const phoneNumber = Cookies.get('phoneNumber');
    if (!phoneNumber) {
      toast.error("Phone number not found in cookies.");
      return;
    }
  
    try {
      // Directly update the profile with the URL
      const updateResponse = await fetch('http://localhost:3000/userroutes/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, name, about, avatar }),
      });

      if (updateResponse.ok) {
        toast.success(`${field} updated successfully!`);
        if (field === 'Avatar') setEditAvatar(false);
      } else {
        const errorData = await updateResponse.json();
        toast.error(errorData.message || `Error updating ${field}.`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`An error occurred while updating ${field}.`);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex align-items-center mb-3">
        <i
          className="bi bi-arrow-left"
          style={{ cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
          onClick={() => navigate(-1)}
        ></i>
        <h4>Profile</h4>
      </div>

      {/* Centered Image Section */}
      <div className="d-flex flex-column align-items-center">
        <div className="position-relative">
          <img
            src={avatar || '/default-avatar.png'}
            alt="User Avatar"
            className="rounded-circle"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
            }}
          />
          <i
            className="bi bi-camera position-absolute"
            onClick={() => setEditAvatar(true)}
            style={{
              bottom: '10px',
              right: '10px',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#fff',
              backgroundColor: '#00A682',
              borderRadius: '50%',
              padding: '10px',
              zIndex: 1,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          ></i>
        </div>

        {editAvatar && (
          <div className="text-center mt-3">
            <input
              type="url"
              placeholder="Paste Image URL"
              value={avatar}
              onChange={handleAvatarUrlChange}
              className="form-control mb-2 w-100"
            />
            <button
              className="btn btn-primary me-2"
              onClick={() => saveChanges('Avatar')}
            >
              Save Image
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditAvatar(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Name Section */}
      <div className="text-center mt-3">
        {editName ? (
          <div>
            <input
              type="text"
              placeholder="Update Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-2"
            />
            <button
              className="btn btn-outline-success me-2"
              onClick={() => { saveChanges('Name'); setEditName(false); }}
            >
              Save Name
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setEditName(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <h5 onClick={() => setEditName(true)} style={{ cursor: 'pointer' }}>
              {name || 'Click to add name'}
            </h5>
            <i
              className="bi bi-pencil ms-2"
              onClick={() => setEditName(true)}
              style={{ cursor: 'pointer', fontSize: '13px' }}
            ></i>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="text-center mt-3">
        {editAbout ? (
          <div>
            <textarea
              placeholder="Update About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="form-control mb-2"
            />
            <button
              className="btn btn-outline-success me-2"
              onClick={() => { saveChanges('About'); setEditAbout(false); }}
            >
              Save About
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setEditAbout(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <p onClick={() => setEditAbout(true)} style={{ cursor: 'pointer' }}>
              {about || 'Click to add about'}
            </p>
            <i
              className="bi bi-pencil ms-2"
              onClick={() => setEditAbout(true)}
              style={{ cursor: 'pointer', fontSize: '13px' }}
            ></i>
          </div>
        )}
      </div>

      {/* Display Phone Number */}
      <div className="text-center mt-3">
        <p style={{ color: 'grey' }}>Phone Number:</p>
        <h6>{phoneNumber || 'Phone number not available'}</h6>
        <div className="mt-5">
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default Profile;
