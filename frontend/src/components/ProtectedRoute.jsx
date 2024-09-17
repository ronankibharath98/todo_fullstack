import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook for auth status

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Use hook to get authentication status

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
