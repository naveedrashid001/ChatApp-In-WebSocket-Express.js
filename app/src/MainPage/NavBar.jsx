import React, { useState, useEffect } from 'react';
import Friends from './Friends';
import Icon from './Icon';
import AddFriend from './AddFriend';
import Cookies from 'js-cookie';

function NavBar() {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUserPhoneNumber = Cookies.get('phoneNumber'); // Retrieve phone number from cookies

  // Load friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:3000/userroutes/friends/${currentUserPhoneNumber}`);
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    if (currentUserPhoneNumber) {
      fetchFriends();
    }
  }, [currentUserPhoneNumber]);

  // Handle adding a friend
  const handleFriendAdded = (newFriend) => {
    if (!friends.some(friend => friend.phoneNumber === newFriend.phoneNumber)) {
      setFriends(prevFriends => [...prevFriends, newFriend]);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter friends based on the search term
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      <div className="p-2" style={{ width: '10%', height: "100vh" }}>
        <Icon />
      </div>
      <div className="card p-2" style={{ width: '95%', height: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Chats</h5>
          <div>
            <AddFriend onFriendAdded={handleFriendAdded} />
            <i className="bi bi-pencil-square"></i>
          </div>
        </div>
        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search or start a new chat"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-3">
          <Friends friends={filteredFriends} />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
