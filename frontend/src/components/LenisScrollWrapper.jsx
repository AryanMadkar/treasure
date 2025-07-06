import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const LenisScrollWrapper = ({ children }) => {
  const [lenis, setLenis] = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let lenisInstance;

    const initializeLenis = async () => {
      // Dynamic import for Lenis
      const Lenis = (await import('@studio-freight/lenis')).default;
      
      lenisInstance = new Lenis({
        duration: 1.8, // Scroll animation duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
        direction: 'vertical', // Scroll direction
        gestureDirection: 'vertical', // Gesture direction
        smooth: true,
        mouseMultiplier: 1.2, // Mouse wheel sensitivity
        smoothTouch: true, // Enable smooth scrolling on touch devices
        touchMultiplier: 2, // Touch sensitivity
        infinite: false,
        autoResize: true, // Auto resize on window resize
        prevent: (node) => {
          // Prevent smooth scrolling on specific elements
          return node.classList.contains('lenis-prevent') || 
                 node.tagName === 'TEXTAREA' || 
                 node.tagName === 'INPUT' ||
                 node.tagName === 'SELECT';
        },
        // Advanced settings for maximum smoothness
        lerp: 0.08, // Linear interpolation factor (lower = smoother)
        syncTouch: true, // Sync touch events
        syncTouchLerp: 0.1, // Touch lerp
        touchInertiaMultiplier: 35, // Touch inertia
        wheelMultiplier: 1.2, // Wheel sensitivity
        normalizeWheel: true, // Normalize wheel events
      });

      setLenis(lenisInstance);

      // Update GSAP ScrollTrigger
      lenisInstance.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        ScrollTrigger.update();
      });

      // Animation loop
      const raf = (time) => {
        lenisInstance.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      
      rafRef.current = requestAnimationFrame(raf);

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        lenisInstance.destroy();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    initializeLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2.5,
        easing: (t) => 1 - Math.pow(1 - t, 4), // Custom easing
      });
    }
  }, [lenis]);

  // Scroll to element function
  const scrollToElement = useCallback((target, options = {}) => {
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 2,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        ...options,
      });
    }
  }, [lenis]);

  // Stop/Start scrolling
  const stopScroll = useCallback(() => {
    if (lenis) lenis.stop();
  }, [lenis]);

  const startScroll = useCallback(() => {
    if (lenis) lenis.start();
  }, [lenis]);

  return (
    <>
      <div className="lenis-wrapper">
        {children}
      </div>

      {/* Custom Scrollbar */}
      <div className="custom-scrollbar">
        <div className="scrollbar-track">
          <div className="scrollbar-thumb"></div>
        </div>
      </div>

      {/* Lenis Smooth Scroll Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: unset !important;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .lenis-wrapper {
          width: 100%;
          min-height: 100vh;
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          position: fixed;
          top: 0;
          right: 0;
          width: 6px;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .custom-scrollbar:hover {
          opacity: 1;
        }

        .scrollbar-track {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          backdrop-filter: blur(10px);
        }

        .scrollbar-thumb {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(
            to bottom,
            #ffd700 0%,
            #ffa500 25%,
            #ff8c00 50%,
            #c0c0c0 75%,
            #808080 100%
          );
          border-radius: 3px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .scrollbar-thumb:hover {
          width: 8px;
          margin-left: -1px;
          background: linear-gradient(
            to bottom,
            #ffed4e 0%,
            #ff8c00 25%,
            #ff6b35 50%,
            #e0e0e0 75%,
            #a0a0a0 100%
          );
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        /* Show scrollbar on scroll */
        body.lenis-scrolling .custom-scrollbar {
          opacity: 1;
        }

        /* Smooth reveal animations */
        [data-scroll-reveal] {
          opacity: 0;
          transform: translateY(100px) scale(0.95);
          transition: opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-scroll-reveal].revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Parallax elements */
        [data-scroll-speed] {
          will-change: transform;
        }

        /* Performance optimizations */
        * {
          scroll-behavior: unset !important;
        }

        /* Disable default scrolling behaviors */
        html,
        body {
          overscroll-behavior: none;
          scroll-behavior: unset !important;
        }

        /* Enhanced performance */
        [data-scroll-container] * {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .custom-scrollbar {
            width: 4px;
          }
          
          .scrollbar-thumb:hover {
            width: 5px;
            margin-left: -0.5px;
          }
        }

        /* Smooth transitions for all elements */
        [data-lenis-prevent] {
          overscroll-behavior: contain;
        }

        /* Ultra-smooth scrolling optimizations */
        .lenis-wrapper {
          will-change: transform;
        }

        /* Enhanced touch scrolling */
        @media (hover: none) and (pointer: coarse) {
          .lenis-wrapper {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }
        }

        /* Prevent text selection during scroll */
        .lenis-scrolling * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Smooth focus transitions */
        [data-scroll-sticky] {
          will-change: transform;
        }

        /* Custom scroll indicators */
        .scroll-indicator {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .scroll-indicator.visible {
          opacity: 1;
        }

        /* Luxury scroll effects */
        .luxury-scroll-text {
          background: linear-gradient(
            45deg,
            #ffd700,
            #ffa500,
            #c0c0c0,
            #808080
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Smooth page transitions */
        .page-transition {
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
};

export default LenisScrollWrapper;