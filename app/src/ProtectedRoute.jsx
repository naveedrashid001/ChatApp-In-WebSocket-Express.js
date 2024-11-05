// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  // Check for token in cookies
  const token = Cookies.get('token'); // Assume token is stored in cookies

  // If authenticated and token exists, render children; otherwise, navigate to login
  return isAuthenticated && token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
