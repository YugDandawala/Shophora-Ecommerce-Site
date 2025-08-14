import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';

const Navigation = ({ onCartClick, onWishlistClick, onOrdersClick, onAuthClick, onHomeClick }) => {
  const { cart, wishlist, currentUser, logout } = useEcommerce();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="nav-container">
          {/* Logo - Left most side */}
          <div className="nav-left">
            <a href="#" className="logo" onClick={handleHomeClick}>
              Shophora
            </a>
          </div>

          {/* Navigation Actions - Right side */}
          <div className="nav-actions">
            {/* Wishlist */}
            <button 
              onClick={onWishlistClick}
              className="nav-button btn-secondary"
              style={{ position: 'relative' }}
            >
              <i className="fas fa-heart"></i>
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="nav-button btn-secondary"
              style={{ position: 'relative' }}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#8b5cf6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Orders - Only show if user is logged in */}
            {currentUser && (
              <button 
                onClick={onOrdersClick}
                className="nav-button btn-secondary"
              >
                <i className="fas fa-box"></i>
                Orders
              </button>
            )}

            {/* Auth Section */}
            {currentUser ? (
              <div className="user-section">
                <span className="welcome-text">
                  Welcome, {currentUser.username}!
                </span>
                <button 
                  onClick={handleLogout}
                  className="nav-button btn-logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onAuthClick('login')} 
                className="nav-button btn-login"
              >
                <i className="fas fa-user"></i>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;