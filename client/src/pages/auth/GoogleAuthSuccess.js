import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const handleGoogleAuthSuccess = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      
      if (token) {
        // Store the token in localStorage and context
        localStorage.setItem('token', token);
        setAuthToken(token);
        
        // Redirect to profile page
        navigate('/profile', { replace: true });
      } else {
        // If no token was found, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleGoogleAuthSuccess();
  }, [navigate, setAuthToken]);

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Processing Google Login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess; 