import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
          border: 'border-emerald-200'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          border: 'border-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          border: 'border-yellow-200'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-purple-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          border: 'border-blue-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          icon: null,
          border: 'border-purple-200'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`fixed top-4 right-4 z-[60] max-w-md w-full animate-slide-in`}>
      <div className={`${styles.bg} text-white p-4 rounded-lg shadow-xl border ${styles.border} backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {styles.icon && (
              <div className="flex-shrink-0">
                {styles.icon}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white rounded-full h-1 transition-all ease-linear"
            style={{
              animation: `shrink ${duration}ms linear`,
              animationFillMode: 'forwards'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;


