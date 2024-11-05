// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import Register from './Register/Register';
import Login from './Login/Login';
import MainPage from './MainPage/MainPage';
import ProtectedRoute from './ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './MainPage/Profile/Profile';
import AddProfile from './Register/AddProfle';
import NotFound from './MainPage/NotFound';
import CurrentlyWorking from './MainPage/CurrentlyWorking';

function App() {
  const [showImage, setShowImage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check token in cookies for authentication status on component mount
    const token = Cookies.get('token');
    setIsAuthenticated(!!token); // Set isAuthenticated to true if token exists

    // Check if the user has already seen the image
    const hasSeenImage = localStorage.getItem('hasSeenImage');
    if (!hasSeenImage) {
      const timer = setTimeout(() => {
        setShowImage(false);
        localStorage.setItem('hasSeenImage', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowImage(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
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
          <Route path="/" element={<Navigate to={isAuthenticated ? "/mainpage" : "/login"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AddProfile" element={<AddProfile />} />
          <Route path="/working" element={<CurrentlyWorking />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/mainpage"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
