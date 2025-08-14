import React, { useState, useEffect, useMemo } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import OrderConfirmationModal from './OrderConfirmationModal';

const ProductDetailPage = ({ product, onClose }) => {
  const { showNotification, currentUser } = useEcommerce();
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  // Determine if this is a cart checkout or single product
  const isCartCheckout = product && product.type === 'cart';
  const items = useMemo(() => {
    return isCartCheckout ? (product?.items || []) : (product ? [product] : []);
  }, [product, isCartCheckout]);
  const singleProduct = !isCartCheckout ? product : null;

  // Reset function to clear all state
  const resetState = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
  };

  // Reset state when product changes or when component mounts
  useEffect(() => {
    resetState();
  }, [product?.id, product?.type]);

  const handlePlaceOrder = () => {
    if (!currentUser) {
      showNotification('Please login to proceed with purchase!', 'error');
      return;
    }

    // Prepare order data
    const orderData = {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      payment_method: 'cod',
      shipping_address: '',
      shipping_city: '',
      shipping_state: '',
      shipping_country: 'India',
      shipping_postal_code: '',
      shipping_phone: ''
    };

    setOrderData(orderData);
    setShowOrderConfirmation(true);
  };

  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
    onClose();
  };

  if (!product) return null;

  if (showOrderConfirmation) {
    return (
      <OrderConfirmationModal 
        order={orderData} 
        items={items}
        onClose={handleCloseOrderConfirmation} 
      />
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-header">
        <h1>{isCartCheckout ? 'Cart Checkout' : 'Product Details'}</h1>
        <button onClick={() => {
          resetState();
          onClose();
        }} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="product-detail-content">
        {isCartCheckout ? (
          // Cart checkout view
          <div className="cart-checkout-view">
            <div className="cart-items-summary">
              <h2>Items in Cart ({items.length})</h2>
              {items.map((item, index) => (
                <div key={item.id || index} className="cart-item-summary">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="brand">by {item.brand}</p>
                    <p className="price">₹{item.price} x {item.quantity || 1}</p>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h3>Cart Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({items.length} items):</span>
                <span>₹{items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) > 50 ? 'Free' : '₹5.99'}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{(items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) * 0.08).toFixed(2)}</span>
              </div>
                             <div className="summary-total">
                 <span>Total:</span>
                 <span>₹{((items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) * 1.08) + (items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) > 50 ? 0 : 5.99)).toFixed(2)}</span>
               </div>
            </div>
            
            <div className="product-actions">
              <button onClick={handlePlaceOrder} className="btn-buy-now">
                <i className="fas fa-shopping-bag"></i>
                Place Order
              </button>
            </div>
          </div>
        ) : (
          // Single product view
          <div className="product-detail-main">
            <div className="product-detail-image">
              <img src={singleProduct?.image} alt={singleProduct?.name} />
            </div>
            
            <div className="product-detail-info">
              <h2 className="product-title">{singleProduct?.name}</h2>
              <p className="product-brand">by {singleProduct?.brand}</p>
              
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(singleProduct?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    ></i>
                  ))}
                </div>
                <span className="review-count">({singleProduct?.numReviews || singleProduct?.reviewCount || 0} reviews)</span>
              </div>
              
              <div className="product-price">
                <span className="current-price">₹{singleProduct?.price}</span>
                {singleProduct?.originalPrice && (
                  <span className="original-price">₹{singleProduct.originalPrice}</span>
                )}
                {singleProduct?.discount && (
                  <span className="discount">{singleProduct.discount}% OFF</span>
                )}
              </div>
              
              <div className="product-description">
                <h3>Description</h3>
                <p>{singleProduct?.description}</p>
              </div>
              
              <div className="product-actions">
                <button onClick={handlePlaceOrder} className="btn-buy-now">
                  <i className="fas fa-shopping-bag"></i>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;