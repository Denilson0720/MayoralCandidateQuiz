'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'warning' | 'error' | 'success' | 'info';
  onDismiss: () => void;
  onNavigateToQuestion?: () => void;
  showNavigateButton?: boolean;
  navigateButtonText?: string;
  isVisible: boolean;
}

export default function Toast({
  message,
  type,
  onDismiss,
  onNavigateToQuestion,
  showNavigateButton = false,
  navigateButtonText = 'Go to Question',
  isVisible
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Allow dismissal after a short delay to prevent immediate dismissal
      const timer = setTimeout(() => {
        setCanDismiss(true);
      }, 500); // 500ms delay before allowing dismissal
      
      return () => clearTimeout(timer);
    } else {
      setCanDismiss(false);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-400 border-yellow-600 text-yellow-800';
      case 'error':
        return 'bg-red-400 border-red-600 text-red-800';
      case 'success':
        return 'bg-green-400 border-green-600 text-green-800';
      case 'info':
        return 'bg-blue-400 border-blue-600 text-blue-800';
      default:
        return 'bg-gray-400 border-gray-600 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] max-w-sm">
      <div
        className={`
          ${getToastStyles()}
          border rounded-lg shadow-md p-3 transition-all duration-500 ease-in-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-sm flex-shrink-0">
              {getIcon()}
            </span>
            <div className="flex-1">
              <p className="font-medium text-xs leading-relaxed">
                {message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {showNavigateButton && onNavigateToQuestion && (
              <button
                onClick={onNavigateToQuestion}
                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors flex-shrink-0"
                title="Go to unanswered question"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            )}
            <button
              onClick={handleDismiss}
              disabled={!canDismiss}
              className={`p-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                canDismiss 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
