import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationIdRef = useRef(0);

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    notificationIdRef.current += 1;
    return notificationIdRef.current;
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = generateId();
    const newNotification = {
      id,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      message: notification.message,
      duration: notification.duration !== undefined ? notification.duration : 5000,
      persistent: notification.persistent || false,
      timestamp: new Date(),
    };

    // Add to state
    setNotifications((prev) => [...prev, newNotification]);

    // Show toast notification
    const toastOptions = {
      duration: newNotification.duration,
      id: newNotification.id,
    };

    switch (newNotification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(newNotification.message, toastOptions);
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(newNotification.message, toastOptions);
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast(newNotification.message, { ...toastOptions, icon: '⚠️' });
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        toast(newNotification.message, toastOptions);
        break;
    }

    // Auto remove from state after duration (if not persistent)
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration + 500); // Add buffer for toast animation
    }

    return id;
  }, [generateId]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    toast.dismiss(id);
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    toast.dismiss();
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: NOTIFICATION_TYPES.SUCCESS });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: NOTIFICATION_TYPES.ERROR, duration: 10000 }); // Longer for errors
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: NOTIFICATION_TYPES.WARNING });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({ ...options, message, type: NOTIFICATION_TYPES.INFO });
  }, [addNotification]);

  // Show promise notification (for async operations)
  const showPromise = useCallback((promise, loadingMessage, successMessage, errorMessage) => {
    const loadingId = addNotification({
      message: loadingMessage,
      type: NOTIFICATION_TYPES.INFO,
      duration: 0, // Persistent until promise resolves
      persistent: true,
    });

    return promise
      .then((data) => {
        removeNotification(loadingId);
        showSuccess(successMessage);
        return data;
      })
      .catch((error) => {
        removeNotification(loadingId);
        showError(errorMessage || error.message);
        throw error;
      });
  }, [addNotification, removeNotification, showSuccess, showError]);

  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
    types: NOTIFICATION_TYPES,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass',
          style: {
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};