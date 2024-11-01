import React from 'react';

function Chat({ friend }) {
  return (
    <>
      <div style={{ width: "100%", height: "60px" }}>
        <div className="d-flex align-items-center mt-2 p-2">
          <img
            src={friend.avatar} // Display the friend's image
            alt={friend.name}
            className="rounded-circle me-2"
            style={{ width: '50px', height: '50px' }}
          />
          <h6>{friend.name}</h6>
        </div>
      </div>

      {/* Div with the background image */}
      <div
       style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('https://www.shutterstock.com/image-vector/social-media-seamless-pattern-doodle-600nw-1992018458.jpg')`,
        backgroundSize: 'cover', // Ensures the image covers the entire div
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '80vh', // Set the desired height for the background area
        overflow: 'hidden',
      }}
      
      >
        {/* Content inside the background image div (if any) */}
      </div>
      <form  className='mt-2'>
      <input type="text"  placeholder='Type a message' style={{width:"95%"}}/>
      <i class="bi bi-send text-success ms-2" style={{fontSize:"23px"}}></i>
      </form>
    </>
  );
}

export default Chat;
