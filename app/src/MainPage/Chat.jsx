import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ currentUserPhoneNumber, recipientPhoneNumber, recipientAvatar, recipientName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Fetch messages on initial render and whenever recipientPhoneNumber changes
    useEffect(() => {
        if (recipientPhoneNumber) {
            fetchMessages();
        }
    }, [recipientPhoneNumber]);

    const fetchMessages = async () => {
        console.log("Fetching messages for recipient:", recipientPhoneNumber);
        try {
            const response = await axios.get(`http://localhost:3000/messages/${recipientPhoneNumber}`, {
                withCredentials: true
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log("Sending message:", message);

        try {
            const newMessage = {
                from: currentUserPhoneNumber,
                to: recipientPhoneNumber,
                content: message,
                timestamp: new Date().toISOString()
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            const response = await axios.post("http://localhost:3000/messages/send", {
                text: message,
                recipientPhoneNumber
            }, { withCredentials: true });

            console.log("Server Response:", response.data);

            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        const chatContainer = document.getElementById("chat-container");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <div className="chat-header d-flex align-items-center p-2" style={{ height: "60px", backgroundColor: 'green' }}>
  <img 
    src={recipientAvatar} 
    alt={recipientName} 
    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} 
  />
  <p className="mb-0" style={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
    {recipientName}
  </p>
</div>

            <div id="chat-container" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.from === currentUserPhoneNumber ? 'my-message' : 'their-message'} style={{ margin: '5px 0' }}>
                        <p>{msg.content}</p>
                        <span style={{ fontSize: '0.8em', color: '#999' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
