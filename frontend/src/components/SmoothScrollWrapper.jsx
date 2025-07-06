import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SmoothScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);
  const [locomotive, setLocomotive] = useState(null);

  useEffect(() => {
    let locomotiveScroll;

    const initializeLocomotive = async () => {
      // Dynamic import for Locomotive Scroll
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      
      locomotiveScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1.2, // Scroll speed multiplier
        class: 'is-revealed',
        scrollbarClass: 'locomotive-scrollbar',
        scrollingClass: 'has-scroll-scrolling',
        draggingClass: 'has-scroll-dragging',
        smoothClass: 'has-scroll-smooth',
        initClass: 'has-scroll-init',
        getSpeed: true,
        getDirection: true,
        scrollFromAnywhere: true,
        inertia: 0.8, // Smooth deceleration
        tablet: {
          smooth: true,
          multiplier: 0.8,
        },
        smartphone: {
          smooth: true,
          multiplier: 0.6,
        },
        reloadOnContextChange: true,
        touchMultiplier: 2,
        firefoxMultiplier: 50,
        lerp: 0.08, // Linear interpolation for ultra-smooth scrolling
      });

      setLocomotive(locomotiveScroll);

      // Update ScrollTrigger when Locomotive Scroll updates
      locomotiveScroll.on('scroll', ScrollTrigger.update);

      // Refresh ScrollTrigger and Locomotive Scroll after everything is set up
      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          return arguments.length
            ? locomotiveScroll.scrollTo(value, { duration: 0, disableLerp: true })
            : locomotiveScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollRef.current.style.transform ? 'transform' : 'fixed',
      });

      // Refresh on window resize
      const handleResize = () => {
        locomotiveScroll.update();
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);
      ScrollTrigger.addEventListener('refresh', () => locomotiveScroll.update());
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener('resize', handleResize);
        locomotiveScroll.destroy();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    initializeLocomotive();

    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (locomotive) {
      locomotive.scrollTo(0, {
        duration: 2000,
        easing: [0.25, 0.0, 0.35, 1.0],
      });
    }
  };

  // Scroll to element function
  const scrollToElement = (target, options = {}) => {
    if (locomotive) {
      locomotive.scrollTo(target, {
        duration: 1500,
        easing: [0.25, 0.0, 0.35, 1.0],
        ...options,
      });
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        data-scroll-container
        className="smooth-scroll-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <div data-scroll-section>
          {children}
        </div>
      </div>

      {/* Smooth Scroll Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: unset !important;
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .smooth-scroll-container {
          will-change: transform;
        }

        .locomotive-scrollbar {
          position: fixed;
          right: 0;
          top: 0;
          width: 4px;
          height: 100%;
          transform-origin: center right;
          transition: transform 0.3s, opacity 0.3s;
          opacity: 0;
          z-index: 999;
        }

        .locomotive-scrollbar:hover {
          transform: scaleX(1.45);
        }

        .locomotive-scrollbar-thumb {
          position: absolute;
          top: 0;
          right: 0;
          background: linear-gradient(
            to bottom,
            #ffd700,
            #ffa500,
            #c0c0c0,
            #808080
          );
          border-radius: 2px;
          width: 100%;
          cursor: grab;
          transition: all 0.3s ease;
        }

        .locomotive-scrollbar-thumb:active {
          cursor: grabbing;
        }

        .has-scroll-smooth {
          overflow: hidden;
        }

        .has-scroll-smooth body {
          overflow: hidden;
        }

        .has-scroll-smooth [data-scroll-container] {
          min-height: 100vh;
        }

        .has-scroll-scrolling .locomotive-scrollbar {
          opacity: 1;
        }

        .has-scroll-dragging .locomotive-scrollbar {
          opacity: 1;
        }

        .has-scroll-dragging .locomotive-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            #ffed4e,
            #ff8c00,
            #e0e0e0,
            #a0a0a0
          );
        }

        /* Smooth reveal animations */
        [data-scroll] {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.5s ease, transform 1.5s ease;
        }

        [data-scroll].is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Parallax elements */
        [data-scroll-speed] {
          will-change: transform;
        }

        /* Custom easing for ultra-smooth experience */
        * {
          scroll-behavior: unset !important;
        }

        /* Disable default scrolling */
        html,
        body {
          overscroll-behavior: none;
        }

        /* Enhance performance */
        [data-scroll-container] * {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .locomotive-scrollbar {
            width: 3px;
          }
        }

        /* Smooth focus transitions */
        [data-scroll-sticky] {
          will-change: transform;
        }

        /* Enhanced smooth scrolling for touch devices */
        @media (hover: none) and (pointer: coarse) {
          .smooth-scroll-container {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </>
  );
};

export default SmoothScrollWrapper;