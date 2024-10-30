import React from 'react';

function Friends({ friends, searchTerm }) {
  return (
    <>
      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <div 
            key={index} 
            className="friend-item d-flex align-items-center mb-3"
            style={{ padding: '10px', borderRadius: '8px', background: '#f8f9fa' }}
          >
            {/* Avatar Image */}
            <img
              src={friend.avatar && friend.avatar.startsWith('http') ? friend.avatar : 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg'}
              alt={`${friend.name}'s avatar`}
              className="friend-avatar"
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px'
              }}
            />

            {/* Friend Info */}
            <div>
              <h6 className="mb-1" style={{ fontSize: '1.1em', fontWeight: '500' }}>{friend.name}</h6>
              <p className="mb-0 text-small" style={{ color: '#6c757d' }}>{friend.phoneNumber}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-5">
          {searchTerm ? "No results found" : "No friends added"}
        </p>
      )}
    </>
  );
}

export default Friends;
