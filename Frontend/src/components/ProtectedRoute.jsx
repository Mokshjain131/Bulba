import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PropTypes from 'prop-types';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};