import React, { useState, useEffect } from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CategoryCards from './components/CategoryCards';
import ProductFilters from './components/ProductFilters';
import ProductGrid from './components/ProductGrid';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';
import ProductDetailPage from './components/ProductDetailPage';
import AuthModal from './components/AuthModal';
import Notification from './components/Notification';

function AppContent() {
  const { 
    cart, 
    wishlist, 
    currentUser, 
    notifications,
    showNotification,
    checkout 
  } = useEcommerce();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'wishlist', 'cart', 'orders', 'product-detail'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleWishlistClick = () => {
    setCurrentPage('wishlist');
  };

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  const handleOrdersClick = () => {
    setCurrentPage('orders');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleClosePage = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  const handleProceedToBuy = (product) => {
    // If product is passed, it's from individual product view
    // If cart is passed, it's from cart checkout
    if (Array.isArray(product)) {
      // This is the entire cart
      setSelectedProduct({ type: 'cart', items: product });
    } else {
      // This is a single product
      setSelectedProduct({ type: 'single', product: product });
    }
    setCurrentPage('product-detail');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'wishlist':
        return <WishlistPage onClose={handleClosePage} />;
      case 'cart':
        return <CartPage onClose={handleClosePage} onProceedToBuy={handleProceedToBuy} />;
      case 'orders':
        return <OrdersPage onClose={handleClosePage} />;
      case 'product-detail':
        return <ProductDetailPage product={selectedProduct} onClose={handleClosePage} />;
      default:
        return (
          <>
            <HeroSection />
            <CategoryCards />
            <ProductFilters />
            <ProductGrid onQuickView={handleProductClick} />
          </>
        );
    }
  };

  return (
    <div>
      <Navigation 
        onCartClick={handleCartClick}
        onWishlistClick={handleWishlistClick}
        onOrdersClick={handleOrdersClick}
        onAuthClick={handleAuthClick}
        onHomeClick={handleHomeClick}
      />
      
      {renderPage()}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        initialMode={authMode}
      />

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification 
            key={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <EcommerceProvider>
      <AppContent />
    </EcommerceProvider>
  );
}

export default App;

// Admin panel username:ecommerce pass:project1