import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // To access authentication state from Redux

const ProtectedRoute = ({ children }) => {
  // Assuming the user authentication status is stored in the Redux store
  var authstatus=useSelector((state)=>state.auth.status) // Modify this according to your Redux state
 console.log(authstatus)
  if (!authstatus) {
    // Redirect the user to the login page if not authenticated
    return <Navigate to="/login" />;
  }
  else
  return children;

  // If authenticated, render the child components

};

export default ProtectedRoute;