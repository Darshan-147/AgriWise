import { gsap } from 'gsap';

export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
  );
};

export const fadeOut = (element, callback) => {
  gsap.to(element, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: callback,
  });
};

export const staggerItems = (elements, staggerTime = 0.1) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: staggerTime,
      ease: 'power2.out',
    }
  );
};

export const pulseAnimation = (element) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    repeat: 1,
    yoyo: true,
    ease: 'power2.inOut',
  });
};
