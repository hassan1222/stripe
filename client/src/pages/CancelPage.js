
// src/pages/CancelPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CancelPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <XCircle size={64} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. Your cart items are still available if you'd like to try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/checkout" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Checkout
          </Link>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;