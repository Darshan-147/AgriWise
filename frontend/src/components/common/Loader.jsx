import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Loader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current) {
      const dots = loaderRef.current.querySelectorAll('.dot');

      gsap.to(dots, {
        y: -10,
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }
  }, []);

  return (
    <div ref={loaderRef} className="flex justify-center items-center space-x-2">
      <div className="dot w-3 h-3 bg-green-600 rounded-full"></div>
      <div className="dot w-3 h-3 bg-green-600 rounded-full"></div>
      <div className="dot w-3 h-3 bg-green-600 rounded-full"></div>
    </div>
  );
};

export default Loader;
