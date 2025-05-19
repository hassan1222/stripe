import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import ProductList from '../components/products/ProductList';
import AddProductForm from '../components/products/AddProductForm';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userData = await authService.getProfile();
        setProfileData(userData);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const isAdmin = currentUser && currentUser.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="loader mx-auto border-blue-500 border-t-transparent border-4 rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600 space-y-4">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>{error}</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser.username}</h1>
        <div className="space-x-3">
          {isAdmin && !showAddProductForm && (
            <button
              onClick={() => setShowAddProductForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Product
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="grid gap-1">
            <h3 className="text-xl font-semibold text-gray-800">{currentUser.username}</h3>
            <p className="text-gray-600">{currentUser.email}</p>
            <span className="text-sm text-gray-500 capitalize">
              Role: {currentUser.role}
            </span>
            <span className="text-sm text-gray-500">
              Member since: {new Date(profileData?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {isAdmin && showAddProductForm ? (
        <AddProductForm onClose={() => setShowAddProductForm(false)} />
      ) : (
        <ProductList />
      )}
    </div>
  );
};

export default ProfilePage;
