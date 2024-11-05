import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function UnSelectedChat() {
   
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative">
      {/* Centered Content */}
      <div className="text-center">
        <img
          src="/images/grey-icon.png"
          alt="Grey Icon"
          style={{ maxWidth: '65px' }}
        />
        <h6 className='mt-3'>WhatApp 2.0 For Window</h6>
        <p style={{color:"grey"}}> Send and receive messages without keeping your phone online. <br />
        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
      </div>
      
      {/* Bottom Aligned Text */}
      <div className="position-absolute text-center bottom-0 mb-3" style={{color:"grey"}}>
        <p><i className="bi bi-lock"></i> End-To-End encrypted</p>
      </div>
    </div>
  );
}

export default UnSelectedChat;
