import React, { useState, useEffect, useCallback } from 'react';
import { useEcommerce } from '../context/EcommerceContext';

const OrdersPage = ({ onClose }) => {
  const { currentUser, showNotification, apiRequest } = useEcommerce();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        // This case should be handled by the main app, but we'll include a notification for robustness.
        showNotification('Please log in to view your orders', 'error');
        setLoading(false);
        return;
      }
      
      const response = await apiRequest('/orders/order_history/');
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        // No notification on success; render orders below
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.error || 'Failed to fetch orders';
        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.message.includes('Authentication failed')) {
        showNotification('Please log in again to view your orders', 'error');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        // This would typically trigger a redirect to the login page.
      } else {
        showNotification('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (currentUser) {
        await fetchOrders();
      } else if (mounted) {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser, fetchOrders]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-confirmed';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'processing':
        return 'fas fa-cog';
      case 'shipped':
        return 'fas fa-shipping-fast';
      case 'delivered':
        return 'fas fa-home';
      case 'cancelled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-check-circle';
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Confirmed';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrackingSteps = (orderStatus) => {
    const steps = [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been successfully placed',
        icon: 'fas fa-check',
        status: 'completed',
        time: 'Just now'
      },
      {
        id: 'processing',
        title: 'Processing',
        description: 'We\'re preparing your order for shipment',
        icon: 'fas fa-box',
        status: orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'active',
        time: 'Next step'
      },
      {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your order is on its way to you',
        icon: 'fas fa-shipping-fast',
        status: orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'pending',
        time: 'Estimated: 2-3 days'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Order will be delivered to your address',
        icon: 'fas fa-home',
        status: orderStatus === 'delivered' ? 'completed' : 'pending',
        time: 'Estimated: 3-5 days'
      }
    ];
    return steps;
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  if (!currentUser) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders</h1>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="empty-orders">
          <div className="empty-icon">
            <i className="fas fa-sign-in-alt"></i>
          </div>
          <h2>Please log in to view your orders</h2>
          <p>You need to be logged in to see your order history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders</h1>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="orders-content">
          <div className="orders-skeleton">
            {[1,2,3].map((k) => (
              <div key={k} className="order-card skeleton">
                <div className="skeleton-bar w-40"></div>
                <div className="skeleton-row">
                  <div className="skeleton-pill w-20"></div>
                  <div className="skeleton-pill w-10"></div>
                </div>
                <div className="skeleton-items">
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-thumb"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders</h1>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="empty-orders">
          <div className="empty-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
          <button onClick={onClose} className="btn-continue-shopping">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="header-content">
          <h1>My Orders</h1>
          <div className="order-stats">
            <span className="total-orders">{orders.length} orders</span>
            <span className="total-spent">
              Total spent: ₹{orders.reduce((total, order) => total + parseFloat(order.total_amount || 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="orders-content">
        <div className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Orders ({orders.length})
            </button>
            
          </div>
        </div>

        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-number">
                    <h3>Order #{order.order_number}</h3>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-amount">
                    <span className="amount">₹{order.total_amount}</span>
                    <span className="item-count">{order.item_count || order.items?.length || 0} items</span>
                  </div>
                </div>
                <div className={`order-status ${getStatusColor(order.status)}`}>
                  <i className={getStatusIcon(order.status)}></i>
                  <span>{getStatusDisplayText(order.status)}</span>
                </div>
              </div>
              
              <div className="order-items-preview">
                {order.items && order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="preview-item">
                    <div className="item-image">
                      {item.product_image || item.product?.image ? (
                        <img 
                          src={item.product_image || item.product?.image} 
                          alt={item.product_name || item.product?.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="item-image-fallback" style={{ display: item.product_image || item.product?.image ? 'none' : 'flex' }}>
                        <i className="fas fa-image"></i>
                      </div>
                    </div>
                    <div className="item-details">
                      <h4>{item.product_name || item.product?.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items && order.items.length > 3 && (
                  <div className="more-items">
                    <span>+{order.items.length - 3} more</span>
                  </div>
                )}
              </div>
              
              <div className="order-actions">
                <button 
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className="btn-view-details"
                >
                  <i className="fas fa-eye"></i>
                  {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                </button>
                <button className="btn-track-order">
                  <i className="fas fa-map-marker-alt"></i>
                  Track Order
                </button>
              </div>
              
              {selectedOrder === order.id && (
                <div className="order-details-expanded">
                  <div className="details-grid">
                    <div className="details-section">
                      <h4>Shipping Address</h4>
                      <div className="address-info">
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                        <p>{order.shipping_country}</p>
                        <p><strong>Phone:</strong> {order.shipping_phone}</p>
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h4>Payment Information</h4>
                      <div className="payment-info">
                        <p><strong>Method:</strong> {order.payment_method}</p>
                        <p><strong>Status:</strong> {order.payment_status}</p>
                        <p><strong>Transaction ID:</strong> {order.transaction_id || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h4>Order Summary</h4>
                      <div className="summary-breakdown">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotal}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>₹{order.shipping_cost}</span>
                        </div>
                        <div className="summary-row">
                          <span>Tax:</span>
                          <span>₹{order.tax_amount}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="all-items-section">
                    <h4>All Items</h4>
                    <div className="all-items">
                      {order.items && order.items.map((item) => (
                        <div key={item.id} className="order-item-detail">
                          <div className="item-image">
                            {item.product_image || item.product?.image ? (
                              <img 
                                src={item.product_image || item.product?.image} 
                                alt={item.product_name || item.product?.name}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="item-image-fallback" style={{ display: item.product_image || item.product?.image ? 'none' : 'flex' }}>
                              <i className="fas fa-image"></i>
                            </div>
                          </div>
                          <div className="item-details">
                            <h5>{item.product_name || item.product?.name}</h5>
                            <p className="item-price">₹{item.price} x {item.quantity}</p>
                            <p className="item-total">Total: ₹{item.total_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
