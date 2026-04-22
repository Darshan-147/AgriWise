import React from 'react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
  isLoading = false,
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2,
      });
    }
  }, []);

  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`py-2 px-4 rounded-md transition-all duration-200 ease-in-out font-medium 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1'} 
        ${className}
        opacity-0 translate-y-4`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
