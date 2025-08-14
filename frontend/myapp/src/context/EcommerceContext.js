import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProducts } from '../data/products';

const EcommerceContext = createContext();

const initialState = {
  products: mockProducts,
  filteredProducts: mockProducts,
  cart: [],
  wishlist: [],
  currentUser: null,
  filters: {
    search: '',
    category: '',
    brand: '',
    price: '',
    rating: '',
    sort: 'createdAt'
  },
  loading: false,
  notifications: []
};

const ecommerceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'SET_FILTERED_PRODUCTS':
      return { ...state, filteredProducts: action.payload };
    
    case 'ADD_TO_CART':
      const existingCartItem = state.cart.find(item => item.id === action.payload.id);
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'TOGGLE_WISHLIST':
      const isInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (isInWishlist) {
        return {
          ...state,
          wishlist: state.wishlist.filter(item => item.id !== action.payload.id)
        };
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'LOGOUT':
      return { 
        ...state, 
        currentUser: null,
        cart: [],
        wishlist: []
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
};

export const EcommerceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ecommerceReducer, initialState);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (savedCart) {
      const cart = JSON.parse(savedCart);
      cart.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }

    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      wishlist.forEach(item => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: item });
      });
    }

    if (savedUser && accessToken) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
  }, []);

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.currentUser]);

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...state.products];

    // Apply search filter
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    // Apply brand filter
    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }

    // Apply price filter
    if (state.filters.price) {
      if (state.filters.price === '500+') {
        filtered = filtered.filter(product => product.price >= 500);
      } else {
        const [min, max] = state.filters.price.split('-').map(Number);
        filtered = filtered.filter(product =>
          product.price >= min && (!max || product.price <= max)
        );
      }
    }

    // Apply rating filter
    if (state.filters.rating) {
      const ratingValue = parseFloat(state.filters.rating.replace('+', ''));
      filtered = filtered.filter(product => product.rating >= ratingValue);
    }

    // Apply sorting
    if (state.filters.sort) {
      filtered.sort((a, b) => {
        switch (state.filters.sort) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'createdAt':
          default:
            return 0;
        }
      });
    }

    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
  }, [state.filters, state.products]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    showNotification('Product added to cart!', 'success');
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    showNotification('Product removed from cart!', 'info');
  };

  const updateCartQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } });
  };

  const toggleWishlist = (product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    const isInWishlist = state.wishlist.some(item => item.id === product.id);
    showNotification(
      isInWishlist ? 'Product removed from wishlist!' : 'Product added to wishlist!',
      isInWishlist ? 'info' : 'success'
    );
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {
      search: '',
      category: '',
      brand: '',
      price: '',
      rating: '',
      sort: 'createdAt'
    }});
  };

  const login = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
    showNotification('Login successful!', 'success');
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    dispatch({ type: 'LOGOUT' });
    showNotification('Logged out successfully!', 'info');
  };

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 3000);
  };

  // Lightweight authenticated fetch wrapper for backend API
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';

  const apiRequest = async (path, options = {}) => {
    const doFetch = async () => {
      const accessToken = localStorage.getItem('access_token');
      const defaultHeaders = { 'Content-Type': 'application/json' };
      if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
      }
      return fetch(`${API_BASE}${path}`, {
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...(options.headers || {}) },
        body: options.body,
      });
    };

    let response = await doFetch();
    if (response.status !== 401) return response;

    // Try silent token refresh once
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('Authentication failed');
    try {
      const refreshResp = await fetch(`${API_BASE}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });
      if (!refreshResp.ok) throw new Error('Authentication failed');
      const data = await refreshResp.json();
      if (data.access) localStorage.setItem('access_token', data.access);
      // retry original request once with new token
      response = await doFetch();
      return response;
    } catch (e) {
      throw new Error('Authentication failed');
    }
  };

  const checkout = () => {
    if (state.cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }

    if (!state.currentUser) {
      showNotification('Please login to checkout!', 'error');
      return;
    }

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Order placed successfully! Total: ₹${total.toFixed(2)}`, 'success');
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showNotification('Cart cleared successfully!', 'info');
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    setFilters,
    clearFilters,
    login,
    logout,
    showNotification,
    checkout,
    clearCart,
    apiRequest
  };

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
}; 