// Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ currentUserPhoneNumber, recipientPhoneNumber, recipientAvatar, recipientName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Fetch the current user's phone number from cookies
    const getPhoneNumberFromCookies = () => {
        const cookies = document.cookie.split('; ');
        const phoneCookie = cookies.find(row => row.startsWith('phoneNumber='));
        return phoneCookie ? phoneCookie.split('=')[1] : null;
    };
    
    const currentPhoneNumber = getPhoneNumberFromCookies();

    // Fetch messages on mount and when recipientPhoneNumber changes
    useEffect(() => {
        if (recipientPhoneNumber) {
            fetchMessages();
        }
    }, [recipientPhoneNumber]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/userroutes/${recipientPhoneNumber}`, {
                withCredentials: true
            });
            
            const fetchedMessages = response.data.messages.map(msg => ({
                content: msg.message,
                from: msg.from, // Sender's phone number
                timestamp: msg.timestamp
            })).filter(msg => msg.content && msg.timestamp);
            
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3000/userroutes/send', {
                text: message,
                recipientPhoneNumber: recipientPhoneNumber,
                senderPhoneNumber: currentUserPhoneNumber
            });
            
            setMessages(prevMessages => [
                ...prevMessages,
                { content: message, from: currentUserPhoneNumber, timestamp: new Date() }
            ]);
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

            <div id="chat-container" style={{ height: '80vh', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.from === currentPhoneNumber ? 'my-message' : 'their-message'}>
                        <p className="message-content">{msg.content}</p>
                        <span className="message-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
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
                <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '4px', backgroundColor: '#1EBE57', color: '#fff', border: 'none' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
