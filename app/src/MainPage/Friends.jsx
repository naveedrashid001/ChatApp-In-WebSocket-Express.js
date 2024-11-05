import React, { useState } from 'react';

function Friends({ friends, onFriendSelect, onUpdateFriendName, onDeleteFriend }) {
    const [editingFriendId, setEditingFriendId] = useState(null);
    const [newName, setNewName] = useState('');
    const [showIcons, setShowIcons] = useState(null);

    const handleFriendClick = (friend) => {
        onFriendSelect(friend);
        document.cookie = `friendNumber=${friend.phoneNumber}; path=/;`;
    };

    const handleEditClick = (friend) => {
        setEditingFriendId(friend._id);
        setNewName(friend.name);
        setShowIcons(null);
    };

    const handleSaveClick = () => {
        if (newName.trim() && editingFriendId) {
            onUpdateFriendName(editingFriendId, newName);
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
        <ul className="list-group" style={{ cursor: 'pointer' }}>
            {friends.map(friend => (
                <li key={friend._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center" onClick={() => handleFriendClick(friend)}>
                        <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className="rounded-circle me-2" 
                            style={{ width: '30px', height: '30px' }} 
                        />
                        {editingFriendId === friend._id ? (
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="form-control me-2"
                                style={{ maxWidth: '150px' }}
                            />
                        ) : (
                            <span className="me-2">{friend.name}</span>
                        )}
                    </div>
                    <div>
                        {editingFriendId === friend._id ? (
                            <button
                                className="btn btn-outline-success btn-sm"
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                        ) : (
                            <>
                                {showIcons === friend._id ? (
                                    <>
                                        <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEditClick(friend)}>
                                            <i className="bi bi-pencil"></i>
                                        </span>
                                        <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(friend._id)}>
                                            <i className="bi bi-trash-fill"></i>
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ cursor: 'pointer' }} onClick={() => toggleIcons(friend._id)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default Friends;
