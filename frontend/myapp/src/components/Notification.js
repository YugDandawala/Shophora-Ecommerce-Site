import React, { useEffect, useState } from 'react';

const Notification = ({ message, type = 'info' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after a small delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Hide notification after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className={`notification ${isVisible ? 'show' : ''} ${type}`}>
      <div className="notification-content">
        <i className={`${getIcon()} notification-icon`}></i>
        <span className="notification-message">{message}</span>
      </div>
    </div>
  );
};

export default Notification; 