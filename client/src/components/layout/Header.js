import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems, cartCount, removeFromCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';


  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity || 0), 0).toFixed(2);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Auth App</Link>
        </div>
        
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-4 items-center">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-blue-600 font-medium" 
                    : "text-gray-700 hover:text-blue-600 transition-colors"
                }
              >
                Home
              </NavLink>
            </li>
            
            {currentUser ? (
              <>
                <li>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-blue-600 font-medium" 
                        : "text-gray-700 hover:text-blue-600 transition-colors"
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-blue-600 font-medium" 
                        : "text-gray-700 hover:text-blue-600 transition-colors"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/signup" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-blue-600 font-medium" 
                        : "text-gray-700 hover:text-blue-600 transition-colors"
                    }
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
            
            {/* Cart Icon */}
            <li className="relative">
              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Your Cart</h3>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Your cart is empty
                      </div>
                    ) : (
                      <>
                        {cartItems.map(item => (
                          <div key={item._id} className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
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
                            <div className="flex-grow">
                              <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                                </p>
                                <button 
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex justify-between mb-4">
                            <span className="font-medium text-gray-800">Total:</span>
                            <span className="font-bold text-gray-900">${calculateTotal()}</span>
                          </div>
                          <Link 
                            to="/checkout" 
                            className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
                            onClick={() => setShowCart(false)}
                          >
                            Checkout
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;