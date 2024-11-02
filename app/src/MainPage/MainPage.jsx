import React, { useState } from 'react';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnSelectedChat from './UnSelectedChat';
import Chat from './Chat';
import Cookies from 'js-cookie';

function MainPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const currentUserPhoneNumber = Cookies.get('phoneNumber'); // Get current user phone number

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend); // Set the selected friend
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
          <NavBar onFriendSelect={handleFriendSelect} />
        </div>
        <div className="col-8">
          {selectedFriend ? (
            <Chat
              currentUserPhoneNumber={currentUserPhoneNumber}
              recipientPhoneNumber={selectedFriend.phoneNumber}
              recipientAvatar={selectedFriend.avatar}
              recipientName={selectedFriend.name}
            />
          ) : (
            <UnSelectedChat />
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
