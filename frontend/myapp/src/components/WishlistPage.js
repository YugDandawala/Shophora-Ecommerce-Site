import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';

const WishlistPage = ({ onClose }) => {
  const { wishlist, toggleWishlist, addToCart, showNotification } = useEcommerce();

  const handleRemoveFromWishlist = (product) => {
    toggleWishlist(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showNotification('Product added to cart!', 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="empty-wishlist">
          <i className="fas fa-heart-broken"></i>
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love to your wishlist!</p>
          <button onClick={onClose} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist ({wishlist.length} items)</h1>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="wishlist-content">
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-item">
              <div className="wishlist-item-image">
                <img src={product.image} alt={product.name} />
                <button 
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="remove-wishlist-btn"
                >
                  <i className="fas fa-heart-broken"></i>
                </button>
              </div>
              
              <div className="wishlist-item-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                
                <div className="product-price">
                  <span className="current-price">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">₹{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="discount">{product.discount}% OFF</span>
                  )}
                </div>
                
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < product.rating ? 'filled' : ''}`}
                      ></i>
                    ))}
                  </div>
                  <span className="review-count">({product.reviewCount} reviews)</span>
                </div>
                
                <div className="wishlist-item-actions">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="btn-add-cart"
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 