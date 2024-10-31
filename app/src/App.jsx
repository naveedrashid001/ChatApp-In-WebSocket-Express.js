import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import MainPage from './MainPage/MainPage';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './MainPage/Profile/Profile';
import AddProfile from './Register/AddProfle';


function App() {
  const [showImage, setShowImage] = useState(true); // State to control image visibility
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication status

  useEffect(() => {
    // Check localStorage for authentication status on component mount
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true'); // Convert string to boolean

    // Check if the user has already seen the image
    const hasSeenImage = localStorage.getItem('hasSeenImage');
    if (!hasSeenImage) {
      // Set timer to hide image after 2 seconds if the user hasn't seen it
      const timer = setTimeout(() => {
        setShowImage(false); // Hide the image after 2 seconds
        localStorage.setItem('hasSeenImage', 'true'); // Set flag to indicate image has been seen
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    } else {
      setShowImage(false); // Skip image if it has already been seen
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist authentication status in localStorage
  };

  return (
    <Router>
      {showImage ? (
        <div style={{ textAlign: 'center' }}>
          <img
            src="/images/mainpage.jpg"
            alt="WhatsApp"
            style={{ width: '100%', height: '96vh', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <Routes>
          {/* Default route to redirect to /login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/AddProfile" element={<AddProfile/>} />


          {/* Protecting the MainPage route */}
          <Route
            path="/mainpage"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage />
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes as needed */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
