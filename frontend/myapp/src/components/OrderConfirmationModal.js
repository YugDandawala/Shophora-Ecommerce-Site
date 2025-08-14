import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';

const App = ({ onClose, items }) => {
    const { showNotification, apiRequest, clearCart } = useEcommerce();
    
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null); // 'success' or 'error'
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        payment_method: 'cod'
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const calculateSubtotal = () => {
        return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        return subtotal + shipping + tax;
    };

    const handlePlaceOrder = async () => {
        if (!items || items.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.street || !formData.city) {
            showNotification('Please fill in all required fields!', 'error');
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                shipping_address: `${formData.fullName}, ${formData.street}, ${formData.city}, ${formData.state || ''} ${formData.postalCode || ''}, ${formData.country}`.trim(),
                shipping_city: formData.city,
                shipping_state: formData.state || 'N/A',
                shipping_country: formData.country,
                shipping_postal_code: formData.postalCode || 'N/A',
                shipping_phone: formData.phone,
                payment_method: formData.payment_method,
                items: items.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity || 1,
                    price: item.price,
                    product_image: item.image,
                    description: item.description || `${item.name} by ${item.brand}`,
                })),
                total_amount: calculateTotal().toFixed(2),
                subtotal: calculateSubtotal().toFixed(2),
                shipping_cost: (calculateSubtotal() > 50 ? 0 : 5.99).toFixed(2),
                tax_amount: (calculateSubtotal() * 0.08).toFixed(2)
            };

            const response = await apiRequest('/orders/', {
                method: 'POST',
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                const saved = await response.json().catch(() => ({}));
                setOrderStatus('success');
                clearCart();
                showNotification('Order placed successfully!', 'success');
            } else {
                setOrderStatus('error');
                const errorData = await response.json().catch(() => ({}));
                console.error('Order creation failed:', errorData);
                showNotification(errorData.error || errorData.detail || 'Failed to place order. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setOrderStatus('error');
            showNotification('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    // Success/Error Modal
    const StatusModal = ({ status }) => {
        const isSuccess = status === 'success';
        return (
            <div className="status-modal-overlay">
                <div className="status-modal-content">
                    <div className={`status-icon ${isSuccess ? 'success' : 'error'}`}>
                        <i className={`fas fa-${isSuccess ? 'check-circle' : 'times-circle'}`}></i>
                    </div>
                    <h3 className="status-title">{isSuccess ? 'Order Placed!' : 'Order Failed!'}</h3>
                    <p className="status-message">
                        {isSuccess 
                            ? 'Your order has been placed successfully and is being processed. You can view your order history to track its status.' 
                            : 'There was an issue processing your order. Please try again or contact support.'
                        }
                    </p>
                    <div className="status-actions">
                        <button onClick={onClose} className="btn-continue-shopping">
                            <i className="fas fa-shopping-bag"></i>
                            Continue Shopping
                        </button>
                        {isSuccess && (
                            <button onClick={onClose} className="btn-view-orders">
                                <i className="fas fa-list-alt"></i>
                                View Orders
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (orderStatus) {
        return <StatusModal status={orderStatus} />;
    }

    return (
        <div className="order-confirmation-overlay">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

                .order-confirmation-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }

                .order-confirmation-modal {
                    background: #ffffff;
                    border-radius: 16px;
                    max-width: 650px;
                    width: 95%;
                    max-height: 95vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                    animation: modalFadeIn 0.3s ease-out forwards;
                    position: relative;
                }

                @keyframes modalFadeIn {
                    from {
                        transform: scale(0.95) translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                .confirmation-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 32px;
                    border-bottom: 1px solid #e5e7eb;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px 16px 0 0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .confirmation-header h2 {
                    margin: 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                }

                .confirmation-header .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .confirmation-header .close-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .confirmation-content {
                    padding: 32px;
                }

                .checkout-form-card-single {
                    display: flex;
                    flex-direction: column;
                }

                .form-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1f2937;
                    margin: 0 0 8px 0;
                    text-align: center;
                    letter-spacing: -0.05em;
                }

                .form-description {
                    font-size: 1rem;
                    color: #6b7280;
                    margin: 0 0 32px 0;
                    text-align: center;
                    line-height: 1.5;
                }

                .form-section {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                    margin-bottom: 24px;
                    transition: box-shadow 0.3s;
                }
                .form-section:hover {
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .section-header i {
                    font-size: 1.4rem;
                    color: #667eea;
                    width: 28px;
                    text-align: center;
                }

                .section-header h4 {
                    margin: 0;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1f2937;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                }

                @media (min-width: 640px) {
                    .form-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #374151;
                }

                .form-group input {
                    padding: 14px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: white;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
                }
                .form-group input::placeholder {
                    color: #9ca3af;
                    font-style: italic;
                }

                .payment-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .payment-option {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                .payment-option:hover {
                    border-color: #667eea;
                    background: #f8fafc;
                }

                .payment-option input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .payment-option input[type="radio"]:checked + .payment-option-content {
                    background: #f0f4ff;
                    border-color: #667eea;
                }
                .payment-option input[type="radio"]:checked + .payment-option-content .payment-icon {
                    background: #667eea;
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .payment-option-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                }

                .payment-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    color: #6b7280;
                    transition: all 0.2s;
                }

                .payment-details {
                    flex: 1;
                }

                .payment-details h5 {
                    margin: 0 0 4px 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                }

                .payment-details p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                .form-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: flex-end;
                    padding-top: 24px;
                    border-top: 1px solid #e5e7eb;
                    margin-top: auto;
                }

                .btn-back {
                    padding: 12px 24px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    background: white;
                    color: #374151;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .btn-back:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                    transform: translateY(-1px);
                }

                .btn-place-order {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                }
                .btn-place-order:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }
                .btn-place-order:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Status Modal Styles */
                .status-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1001;
                    animation: modalFadeIn 0.3s ease-out forwards;
                }
                .status-modal-content {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .status-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 3rem;
                    color: white;
                }
                .status-icon.success {
                    background: #10b981;
                }
                .status-icon.error {
                    background: #ef4444;
                }
                .status-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 12px;
                }
                .status-message {
                    font-size: 1rem;
                    color: #6b7280;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .status-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .btn-continue-shopping, .btn-view-orders {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-continue-shopping {
                    background: #e5e7eb;
                    color: #374151;
                }
                .btn-continue-shopping:hover {
                    background: #d1d5db;
                }
                .btn-view-orders {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                .btn-view-orders:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }

                @media (max-width: 640px) {
                    .confirmation-content {
                        padding: 24px;
                    }
                    .confirmation-header h2 {
                        font-size: 1.4rem;
                    }
                    .form-title {
                        font-size: 1.6rem;
                    }
                    .form-description {
                        font-size: 0.9rem;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .section-header h4 {
                        font-size: 1.2rem;
                    }
                    .payment-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                    .form-actions {
                        flex-direction: column;
                        align-items: center;
                    }
                    .btn-back, .btn-place-order {
                        width: 100%;
                        justify-content: center;
                    }
                }
                `}
            </style>
            <div className="order-confirmation-modal">
                <div className="confirmation-header">
                    <h2>Complete Your Order</h2>
                    <button onClick={onClose} className="close-btn">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="confirmation-content">
                    <div className="checkout-form-card-single">
                        <h3 className="form-title">Shipping & Payment</h3>
                        <p className="form-description">Please fill in your details to complete the purchase.</p>

                        {/* Shipping Address */}
                        <div className="form-section">
                            <div className="section-header">
                                <i className="fas fa-map-marker-alt"></i>
                                <h4>Shipping Address</h4>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+91-1234567890"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="street">Street Address *</label>
                                <input
                                    id="street"
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="123, Main Street"
                                />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Maharashtra"
                                    />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        id="postalCode"
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="400001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        id="country"
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="India"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="form-section">
                            <div className="section-header">
                                <i className="fas fa-credit-card"></i>
                                <h4>Payment Method</h4>
                            </div>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={formData.payment_method === 'cod'}
                                        onChange={handleInputChange}
                                    />
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <i className="fas fa-money-bill-wave"></i>
                                        </div>
                                        <div className="payment-details">
                                            <h5>Cash on Delivery</h5>
                                            <p>Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="upi"
                                        checked={formData.payment_method === 'upi'}
                                        onChange={handleInputChange}
                                    />
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <i className="fas fa-mobile-alt"></i>
                                        </div>
                                        <div className="payment-details">
                                            <h5>UPI Payment</h5>
                                            <p>Pay using UPI apps</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="card"
                                        checked={formData.payment_method === 'card'}
                                        onChange={handleInputChange}
                                    />
                                    <div className="payment-option-content">
                                        <div className="payment-icon">
                                            <i className="fas fa-credit-card"></i>
                                        </div>
                                        <div className="payment-details">
                                            <h5>Credit/Debit Card</h5>
                                            <p>Pay securely with your card</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button onClick={onClose} className="btn-back">
                                <i className="fas fa-arrow-left"></i>
                                Back to Home
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="btn-place-order"
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-shopping-bag"></i>
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
