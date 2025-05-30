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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-4">
          <Link 
            to="/cart"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;