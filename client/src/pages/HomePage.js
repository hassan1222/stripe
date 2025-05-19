// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Auth App</h1>
        <p className="subtitle">A secure authentication system built with React and Node.js</p>
        
        {!currentUser ? (
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="welcome-back">
            <h2>Welcome back, {currentUser.username}!</h2>
            <Link to="/profile" className="btn btn-primary">
              Go to Profile
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>Secure Authentication</h3>
            <p>JWT-based authentication with secure password hashing</p>
          </div>
          
          <div className="feature-card">
            <h3>User Profiles</h3>
            <p>Manage your personal information and account details</p>
          </div>
          
          <div className="feature-card">
            <h3>Protected Routes</h3>
            <p>Content that's only accessible to authenticated users</p>
          </div>
          
          <div className="feature-card">
            <h3>Role-Based Access</h3>
            <p>Different permissions for regular users and administrators</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;