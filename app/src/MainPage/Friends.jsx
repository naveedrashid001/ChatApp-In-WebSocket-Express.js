import React, { useState } from 'react';

function Friends({ friends, onFriendSelect, onUpdateFriendName, onDeleteFriend }) {
  const [editingFriendId, setEditingFriendId] = useState(null);
  const [newName, setNewName] = useState('');
  const [showIcons, setShowIcons] = useState(null);

  const handleFriendClick = (friend) => {
    onFriendSelect(friend); // Send the selected friend to MainPage
  };

  const handleEditClick = (friend) => {
    setEditingFriendId(friend._id);
    setNewName(friend.name);
    setShowIcons(null);
  };

  const handleSaveClick = () => {
    const friend = friends.find(friend => friend._id === editingFriendId);
    if (friend && newName && newName !== friend.name) {
      onUpdateFriendName(friend._id, newName);
    }
    setEditingFriendId(null);
    setNewName('');
  };

  const handleDeleteClick = (friendId) => {
    onDeleteFriend(friendId);
  };

  const toggleIcons = (friendId) => {
    setShowIcons(showIcons === friendId ? null : friendId);
  };

  return (
    <ul className="list-group">
      {friends.map(friend => (
        <li
          key={friend._id}
          className="list-group-item d-flex justify-content-between align-items-center"
          onClick={() => handleFriendClick(friend)} // Select the friend on click
        >
          <div className="d-flex align-items-center">
            {editingFriendId === friend._id ? null : (
              <img
                src={friend.avatar}
                alt={friend.name}
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
              />
            )}
            {editingFriendId === friend._id ? (
              <div className="d-flex">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '80%' }}
                  className="form-control me-2"
                />
                <button
                  className="btn btn-outline-success"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="me-2">{friend.name}</span>
            )}
          </div>

          {editingFriendId !== friend._id ? (
            <div>
              {showIcons === friend._id ? (
                <>
                  <span
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => handleEditClick(friend)}
                  >
                    <i className="bi bi-pencil"></i>
                  </span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(friend._id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </span>
                </>
              ) : (
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleIcons(friend._id)}
                >
                  <i className="bi bi-pencil-square"></i>
                </span>
              )}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default Friends;
