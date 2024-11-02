import React, { useState, useEffect } from 'react';
import Friends from './Friends';
import Icon from './Icon';
import AddFriend from './AddFriend';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function NavBar({ onFriendSelect }) {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const currentUserPhoneNumber = Cookies.get('phoneNumber');

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://localhost:3000/userroutes/friends/${currentUserPhoneNumber}`);
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        if (currentUserPhoneNumber) {
            fetchFriends();
            const intervalId = setInterval(fetchFriends, 30000);
            return () => clearInterval(intervalId);
        }
    }, [currentUserPhoneNumber]);

    const handleFriendAdded = () => {
        fetchFriends();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateFriendName = async (friendId, newName) => {
        try {
            const response = await fetch(`http://localhost:3000/userroutes/friend/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: currentUserPhoneNumber,
                    friendOldName: friends.find(friend => friend._id === friendId).name,
                    friendNewName: newName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update friend name');

            const updatedFriends = await response.json();
            setFriends(updatedFriends);
        } catch (error) {
            console.error('Error updating friend name:', error);
            toast.error('Error updating friend name: ' + error.message);
        }
    };

    const handleDeleteFriend = async (friendId) => {
        try {
            const response = await fetch(`http://localhost:3000/userroutes/friend/${friendId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: currentUserPhoneNumber }),
            });

            if (!response.ok) throw new Error('Failed to delete friend');

            const updatedFriends = friends.filter(friend => friend._id !== friendId);
            setFriends(updatedFriends);
            toast.success("Friend deleted successfully!");
        } catch (error) {
            console.error('Error deleting friend:', error);
            toast.error('Error deleting friend: ' + error.message);
        }
    };

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
                    {filteredFriends.length > 0 ? (
                        <Friends
                            friends={filteredFriends}
                            onFriendSelect={onFriendSelect}
                            onUpdateFriendName={updateFriendName}
                            onDeleteFriend={handleDeleteFriend}
                        />
                    ) : (
                        <p className="text-center text-muted">Result not found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NavBar;
