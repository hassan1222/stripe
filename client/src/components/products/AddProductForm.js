import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImage(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!price.trim()) {
      setError('Price is required');
      return false;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      setError('Please enter a valid price');
      return false;
    }
    
    if (!image) {
      setError('Product image is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('image', image);
      
      // Submit to API
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear form on success
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setPreviewUrl('');
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        if (success) setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form-container">
      <div className="form-header">
        <h2>Add New Product</h2>
        <button 
          type="button" 
          className="close-button"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      
      {success && (
        <div className="success-message">
          Product added successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-title">Title</label>
          <input
            type="text"
            id="product-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Enter product title"
            disabled={loading}
          />
          <small>{title.length}/100 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Enter product description"
            disabled={loading}
          ></textarea>
          <small>{description.length}/500 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="product-price">Price ($)</label>
          <input
            type="number"
            id="product-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            placeholder="Enter product price"
            disabled={loading}
          />
          <small>Enter price in USD (e.g., 29.99)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="product-image">Product Image</label>
          <input
            type="file"
            id="product-image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          <small>Max file size: 5MB. Supported formats: JPG, PNG, GIF</small>
          
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;