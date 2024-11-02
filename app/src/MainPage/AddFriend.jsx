import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

function AddFriend({ onFriendAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const currentUserPhoneNumber = Cookies.get('phoneNumber'); // Retrieve phone number from cookies

  const handleAddFriendClick = () => {
    setShowModal(true);
  };

  const handleSearchFriend = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number.");
      return;
    }
  
    try {
      const body = { phoneNumber, currentUserPhoneNumber };
      const response = await fetch('http://localhost:3000/userroutes/friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Call the function to update the friends list
        onFriendAdded(); // Call the function to refresh the friends list
        toast.success("Friend added successfully!");
      } else {
        toast.error(data.message || "There is no account with this number.");
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error("Error adding friend.");
    }
    setShowModal(false);
    setPhoneNumber('');
  };  

  return (
    <>
      <ToastContainer />
      <i className="bi bi-person-plus me-2" onClick={handleAddFriendClick}></i>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content" style={{ width: "100%" }}>
              <div className="modal-header">
                <h6 className="modal-title">Add Friend</h6>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button onClick={handleSearchFriend} className="btn btn-outline-success form-control mt-2">Save</button>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddFriend;
