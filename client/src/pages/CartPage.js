import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity || 0), 0).toFixed(2);
  };

  // Calculate shipping (example: free for orders over $50, otherwise $5.99)
  const calculateShipping = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return subtotal > 50 ? 0 : 5.99;
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = calculateShipping();
    return (subtotal + shipping).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await loadStripe('pk_test_51ROPv12arKXlXqJ8hHB2DiKoAGAXsPTbwaUT4s2edCtrCOIMtJ6RrA3eLHSiQlIeuMrXSMSeNR4L9YEgc6oVNZiW009rUEk60d');
    
      const response = await fetch('http://159.223.118.251:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
    
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    
      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag size={64} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items ({cartItems.length})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-full sm:w-20 h-20 mb-4 sm:mb-0 bg-gray-100 rounded overflow-hidden">
                    {item.imageUrl && (
                      <img 
                        src={`http://159.223.118.251:5000/uploads/${item.imageUrl.split('\\').pop().split('/').pop()}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${UPLOADS_URL}/placeholder-image.jpg`;
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="sm:ml-6 flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.price?.toFixed(2) || '0.00'} each
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 text-gray-800 font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <p className="text-lg font-medium text-gray-800">
                        ${calculateItemTotal(item)}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1"
                      >
                        <Trash2 size={14} className="mr-1" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-2">←</span>
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">${calculateSubtotal()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              
              {parseFloat(calculateSubtotal()) < 50 && (
                <div className="text-sm text-gray-500 italic">
                  Add ${(50 - parseFloat(calculateSubtotal())).toFixed(2)} more to qualify for free shipping
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-gray-900">${calculateTotal()}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader size={18} className="animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;