import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css'
const Chat = ({ currentUserPhoneNumber, recipientPhoneNumber, recipientAvatar, recipientName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Fetch messages on mount and when recipientPhoneNumber changes
    useEffect(() => {
        if (recipientPhoneNumber) {
            fetchMessages();
        }
    }, [recipientPhoneNumber]);

    const fetchMessages = async () => {
        console.log("Fetching messages for recipient:", recipientPhoneNumber);
        try {
            const response = await axios.get(`http://localhost:3000/userroutes/${recipientPhoneNumber}`, {
                withCredentials: true
            });
            
            // Only add messages with both content and timestamp
            const fetchedMessages = response.data.messages.map(msg => ({
                content: msg.message,
                from: recipientPhoneNumber, // or currentUserPhoneNumber depending on your logic
                timestamp: msg.timestamp
            })).filter(msg => msg.content && msg.timestamp); // Filter out any empty messages
            
            setMessages(fetchedMessages); // Replace rather than merge messages
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };
    
    

    const handleSendMessage = async (event) => {
        event.preventDefault();
        console.log("Sending message:", message);
        console.log("Sender phone number:", currentUserPhoneNumber);
        console.log("Recipient phone number:", recipientPhoneNumber);
        try {
            const response = await axios.post('http://localhost:3000/userroutes/send', {
                text: message,
                recipientPhoneNumber: recipientPhoneNumber,
                senderPhoneNumber: currentUserPhoneNumber
            });
            console.log("Response from server:", response.data);
            
            // Add the new message to the messages state
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
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom when messages change
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

            <div id="chat-container" style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px', display: 'flex', flexDirection: 'column' }}>
    {messages.map((msg, index) => (
        <div key={index} className={msg.from === currentUserPhoneNumber ? 'my-message' : 'their-message'}>
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
                <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
