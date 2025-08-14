import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import AuthModal from './AuthModal';

const CartPage = ({ onClose, onProceedToBuy }) => {
  const { cart, removeFromCart, updateCartQuantity, showNotification, currentUser } = useEcommerce();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      // Removed redundant showNotification call - it's already handled in removeFromCart
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    // Removed redundant showNotification call - it's already handled in removeFromCart
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 5.99 : 0; // Free shipping over ₹50
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + shipping + tax;
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setAuthMode('login');
      setShowAuthModal(true);
      showNotification('Please login to proceed to checkout!', 'error');
    } else {
      // User is logged in, proceed to product detail page with entire cart
      if (onProceedToBuy && cart.length > 0) {
        onProceedToBuy(cart); // Pass entire cart
      }
    }
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful login, automatically proceed to checkout with entire cart
    if (cart.length > 0) {
      onProceedToBuy(cart); // Pass entire cart
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to get started!</p>
          <button onClick={onClose} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart ({cart.length} items)</h1>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <h3 className="product-title">{item.name}</h3>
                <p className="product-brand">{item.brand}</p>
                
                <div className="product-price">
                  <span className="current-price">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="original-price">₹{item.originalPrice}</span>
                  )}
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                
                <div className="item-total">
                  <span>Total: ₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="remove-item-btn"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-item">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-item">
            <span>Shipping</span>
            <span>{calculateSubtotal() > 50 ? 'Free' : '₹5.99'}</span>
          </div>
          
          <div className="summary-item">
            <span>Tax</span>
            <span>₹{(calculateSubtotal() * 0.08).toFixed(2)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
          
          <button onClick={handleProceedToCheckout} className="btn-checkout">
            <i className="fas fa-credit-card"></i>
            Proceed to Checkout
          </button>
          
          <button onClick={onClose} className="btn-continue-shopping">
            <i className="fas fa-arrow-left"></i>
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        initialMode={authMode}
        onLoginSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default CartPage; 