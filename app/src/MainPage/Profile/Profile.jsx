import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [editAvatar, setEditAvatar] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editAbout, setEditAbout] = useState(false);

  useEffect(() => {
    const phoneNumber = Cookies.get('phoneNumber');
    if (!phoneNumber) {
      console.error("Phone number not found in cookies.");
      return;
    }

    fetch(`http://localhost:3000/userroutes/user?phoneNumber=${phoneNumber}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setAvatar(data.avatar);
          setName(data.name);
          setAbout(data.about);
        } else {
          console.error("User data not found.");
        }
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const saveChanges = async (field) => {
    const phoneNumber = Cookies.get('phoneNumber');
    if (!phoneNumber) {
      toast.error("Phone number not found in cookies.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/userroutes/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, avatar, name, about }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${field} updated successfully!`);
      } else {
        toast.error(data.message || `Error updating ${field}.`);
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
            src={avatar}
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
    padding: '10px', // Increased padding for a larger circle
    zIndex: 1,
    width: '40px', // Set a fixed width for the circle
    height: '40px', // Set a fixed height for the circle
    display: 'flex', // Use flexbox to center the icon
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
  }}
></i>

        </div>

        {editAvatar && (
          <div className="text-center mt-3">
            <input
              type="url"
              placeholder="Paste Image URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-90 mb-2"
            />
            <br />
            <button className="btn btn-primary me-2" onClick={() => { saveChanges('Avatar'); setEditAvatar(false); }}>Save Image</button>
            <button className="btn btn-secondary" onClick={() => setEditAvatar(false)}>Cancel</button>
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
            <button className="btn btn-outline-success me-2" onClick={() => { saveChanges('Name'); setEditName(false); }}>Save Name</button>
            <button className="btn btn-outline-secondary" onClick={() => setEditName(false)}>Cancel</button>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <h5 onClick={() => setEditName(true)} style={{ cursor: 'pointer' }}>{name || 'Click to add name'}</h5>
            <i className="bi bi-pencil ms-2" onClick={() => setEditName(true)} style={{ cursor: 'pointer', fontSize: '13px' }}></i>
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
            <button className="btn btn-outline-success me-2" onClick={() => { saveChanges('About'); setEditAbout(false); }}>Save About</button>
            <button className="btn btn-outline-secondary" onClick={() => setEditAbout(false)}>Cancel</button>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <p onClick={() => setEditAbout(true)} style={{ cursor: 'pointer' }}>{about || 'Click to add about'}</p>
            <i className="bi bi-pencil ms-2" onClick={() => setEditAbout(true)} style={{ cursor: 'pointer', fontSize: '13px' }}></i>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
