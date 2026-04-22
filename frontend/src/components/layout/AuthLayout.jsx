// src/components/layout/AuthLayout.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const AuthLayout = ({
  children,
  title,
  subtitle,
  isLoginPage = false,
  activeRole = 'user', // Default to farmer (user) role
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(titleRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
      .fromTo(
        subtitleRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.2'
      )
      .fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.2'
      );
  }, []);

  // Determine colors based on active role
  const colorClass =
    activeRole === 'admin'
      ? 'from-blue-50 to-indigo-50 border-blue-200'
      : 'from-green-50 to-emerald-50 border-green-200';

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${colorClass} p-4`}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 ref={titleRef} className="text-2xl font-bold text-gray-800">
              {title}
            </h2>
            <p ref={subtitleRef} className="text-gray-600 mt-2">
              {subtitle}
            </p>
          </div>

          <div ref={contentRef}>{children}</div>

          <div className="mt-6 text-center text-sm">
            {isLoginPage ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-green-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
