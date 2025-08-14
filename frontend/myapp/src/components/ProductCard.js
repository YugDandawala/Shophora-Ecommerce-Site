import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, wishlist } = useEcommerce();
  
  const isInWishlist = wishlist.some(item => item.id === product.id);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name}
        className="product-image"
        onClick={handleQuickView}
        style={{ cursor: 'pointer' }}
      />
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="discount">-{discountPercentage}%</span>
            </>
          )}
        </div>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
          <span className="review-count">({product.numReviews})</span>
        </div>
        
        <div className="product-actions">
          <button 
            onClick={handleAddToCart}
            className="action-button btn-add-cart"
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button 
            onClick={handleToggleWishlist}
            className={`action-button btn-wishlist ${isInWishlist ? 'text-red-500' : ''}`}
          >
            <i className={`fas fa-heart ${isInWishlist ? 'text-red-500' : ''}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 