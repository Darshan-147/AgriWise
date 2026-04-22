import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current) {
      // Entrance animation
      gsap.fromTo(
        alertRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        if (onClose) {
          gsap.to(alertRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onClose,
          });
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const alertTypes = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  };

  return (
    <div
      ref={alertRef}
      className={`px-4 py-3 rounded relative border-l-4 ${alertTypes[type]}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          onClick={() => {
            gsap.to(alertRef.current, {
              y: -20,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: onClose,
            });
          }}
        >
          <svg
            className={`fill-current h-6 w-6 ${type === 'error' ? 'text-red-500' : `text-${type}-500`}`}
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Alert;
