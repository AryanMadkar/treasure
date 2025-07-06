import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const UltraSmoothHorizontalScroll = () => {
  // Refs for DOM elements
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const sectionsRef = useRef([]);
  const rafRef = useRef(null);
  const targetTranslateX = useRef(0);
  const currentTranslateX = useRef(0);
  const velocity = useRef(0);

  // State variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Enhanced jewelry-themed images with better metadata
  const images = useMemo(() => [
    {
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&q=80",
      title: "Diamond Elegance",
      description: "Exquisite diamond collection crafted with precision, showcasing brilliant cuts and timeless designs.",
      category: "Diamonds",
      color: "#FFD700",
      accent: "#FFA500"
    },
    {
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&h=1080&fit=crop&q=80",
      title: "Gold Luxury",
      description: "Handcrafted gold jewelry with timeless appeal, perfect for every occasion.",
      category: "Gold",
      color: "#FF6B35",
      accent: "#FFD700"
    },
    {
      url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop&q=80",
      title: "Silver Sophistication",
      description: "Modern silver designs for contemporary elegance, featuring sleek lines and minimalist aesthetics.",
      category: "Silver",
      color: "#C0C0C0",
      accent: "#808080"
    },
    {
      url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1920&h=1080&fit=crop&q=80",
      title: "Pearl Paradise",
      description: "Timeless pearl collection with oceanic beauty, each pearl hand-selected for its luster.",
      category: "Pearls",
      color: "#F8F8FF",
      accent: "#E6E6FA"
    },
    {
      url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&h=1080&fit=crop&q=80",
      title: "Emerald Dreams",
      description: "Rare emerald pieces with unmatched brilliance, set in exquisite designs.",
      category: "Emeralds",
      color: "#50C878",
      accent: "#228B22"
    }
  ], []);

  // Track window dimensions for responsive calculations
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Enhanced preload images with WebP support
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map(img => {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            setLoadedImages(prev => new Set([...prev, img.url]));
            resolve();
          };
          image.onerror = () => {
            console.error(`Failed to load image: ${img.url}`);
            resolve();
          };
          // Add crossOrigin for better performance
          image.crossOrigin = 'anonymous';
          image.src = img.url;
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    preloadImages();
  }, [images]);

  // Ultra-smooth lerp function for buttery smooth animations
  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  // Enhanced smooth scroll with momentum and easing
  const smoothScrollLoop = useCallback(() => {
    const container = containerRef.current;
    const horizontal = horizontalRef.current;

    if (!container || !horizontal || isLoading) {
      rafRef.current = requestAnimationFrame(smoothScrollLoop);
      return;
    }

    // Calculate scroll progress with enhanced precision
    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;
    const windowHeight = window.innerHeight;

    let progress = 0;
    
    if (containerTop <= 0 && containerTop > -containerHeight + windowHeight) {
      const scrolledDistance = Math.abs(containerTop);
      const totalScrollDistance = containerHeight - windowHeight;
      progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollDistance));
    } else if (containerTop > 0) {
      progress = 0;
    } else {
      progress = 1;
    }

    // Smooth progress transition
    setScrollProgress(prevProgress => lerp(prevProgress, progress, 0.1));

    // Calculate target translation with viewport considerations
    const maxTranslateX = horizontal.scrollWidth - dimensions.width;
    targetTranslateX.current = progress * maxTranslateX;

    // Ultra-smooth lerp animation with momentum
    const lerpFactor = 0.08; // Adjust for smoothness (lower = smoother)
    currentTranslateX.current = lerp(currentTranslateX.current, targetTranslateX.current, lerpFactor);

    // Calculate velocity for momentum effects
    velocity.current = (targetTranslateX.current - currentTranslateX.current) * 0.1;

    // Apply translation with subpixel precision
    horizontal.style.transform = `translate3d(-${currentTranslateX.current}px, 0, 0)`;

    // Update current image index with smooth transitions
    const newImageIndex = Math.floor(progress * (images.length - 1));
    const clampedIndex = Math.max(0, Math.min(images.length - 1, newImageIndex));
    if (clampedIndex !== currentImageIndex) {
      setCurrentImageIndex(clampedIndex);
    }

    rafRef.current = requestAnimationFrame(smoothScrollLoop);
  }, [dimensions.width, images.length, isLoading, lerp, currentImageIndex]);

  // Initialize smooth scroll loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(smoothScrollLoop);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothScrollLoop]);

  // Utility to convert hex color to RGBA
  const hexToRgba = useCallback((hex, alpha) => {
    if (!hex || hex.length !== 7) return `rgba(0, 0, 0, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }, []);

  // Dynamic gradient overlay for images
  const getGradientOverlay = useCallback((index) => {
    const image = images[index];
    if (!image) return 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)';
    return `linear-gradient(135deg, ${hexToRgba(image.color, 0.2)} 0%, rgba(0, 0, 0, 0.6) 50%, ${hexToRgba(image.accent, 0.15)} 100%)`;
  }, [images, hexToRgba]);

  // Enhanced particle generation with responsive sizing
  const generateParticles = useCallback((index, count = 8) => {
    const baseCount = dimensions.width < 768 ? 4 : count;
    return Array.from({ length: baseCount }, (_, i) => {
      const image = images[index];
      const size = Math.random() * (dimensions.width < 768 ? 2 : 3) + 1;
      const isGoldLike = index % 2 === 0;

      return {
        id: `${index}-${i}`,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        gradient: isGoldLike
          ? `linear-gradient(45deg, ${image.color}, ${image.accent})`
          : `linear-gradient(45deg, ${image.accent}, ${image.color})`,
        blur: Math.random() * 1
      };
    });
  }, [images, dimensions.width]);

  // Memoized particles for performance
  const allParticles = useMemo(() =>
    images.map((_, idx) => generateParticles(idx, 6))
  , [images, generateParticles]);

  // Responsive text sizes
  const getResponsiveTextSize = useCallback((base, md, lg) => {
    if (dimensions.width < 768) return base;
    if (dimensions.width < 1024) return md;
    return lg;
  }, [dimensions.width]);

  // Enhanced loader with better UX
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-yellow-400 border-r-orange-400"></div>
            <div className="absolute inset-0 inline-block animate-pulse rounded-full h-12 w-12 border-4 border-transparent border-b-slate-400 border-l-gray-400"></div>
          </div>
          <p className="text-white text-lg font-semibold mt-4">Loading Collection...</p>
          <div className="mt-2 text-sm text-gray-400">
            {loadedImages.size} / {images.length} images loaded
          </div>
          <div className="w-48 h-1 bg-gray-700 rounded-full mt-3 mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(loadedImages.size / images.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black">
      {/* Section Title - Fully Responsive */}
      <div className="text-center py-6 md:py-12 lg:py-16 px-4">
        <h2 className={`font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-300 to-slate-300 ${
          dimensions.width < 768 ? 'text-2xl' : dimensions.width < 1024 ? 'text-4xl' : 'text-5xl'
        }`}>
          Featured Collection
        </h2>
        <p className={`text-gray-300 max-w-2xl mx-auto px-4 ${
          dimensions.width < 768 ? 'text-base' : 'text-xl'
        }`}>
          Discover our handpicked selection of exquisite jewelry pieces
        </p>
      </div>

      {/* Scroll hint - Responsive */}
      <div className="text-center pb-6 md:pb-8 px-4">
        <div className="inline-flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-700">
          <span className="text-white text-xs md:text-sm">
            {dimensions.width < 768 ? 'Scroll to explore' : 'Scroll down to explore horizontally'}
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Main container - Responsive height */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${images.length * (dimensions.width < 768 ? 120 : 150)}vh` }}
      >
        {/* Sticky horizontal scroll container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            ref={horizontalRef}
            className="flex h-full"
            style={{
              width: `${images.length * 100}vw`,
              willChange: 'transform'
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                ref={el => sectionsRef.current[index] = el}
                className="relative w-screen h-full flex-shrink-0 overflow-hidden"
              >
                {/* Base image with responsive loading */}
                {loadedImages.has(image.url) ? (
                  <picture>
                    <img
                      src={image.url}
                      alt={`${image.title} - ${image.description}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{
                        transform: `scale(${1 + Math.abs(velocity.current) * 0.001})`,
                        imageRendering: 'crisp-edges'
                      }}
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gray-800 animate-pulse" />
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: getGradientOverlay(index)
                  }}
                />

                {/* Particle system - Responsive */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {allParticles[index].map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute rounded-full opacity-30"
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: particle.gradient,
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        filter: `blur(${particle.blur}px)`,
                        animation: `floatSimple ${particle.duration}s ease-in-out ${particle.delay}s infinite`
                      }}
                    />
                  ))}
                </div>

                {/* Content overlay - Fully Responsive */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 p-4 md:p-6">
                  <div className="max-w-xs md:max-w-2xl">
                    <div className="mb-2 md:mb-3">
                      <span className="inline-block px-2 py-1 md:px-3 md:py-1 bg-black bg-opacity-30 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium tracking-wider">
                        {image.category}
                      </span>
                    </div>
                    <h3 className={`font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-300 to-slate-300 leading-tight ${
                      dimensions.width < 768 ? 'text-xl' : dimensions.width < 1024 ? 'text-3xl' : 'text-5xl'
                    }`}>
                      {image.title}
                    </h3>
                    <p className={`text-gray-100 mb-4 md:mb-6 font-light leading-relaxed opacity-90 ${
                      dimensions.width < 768 ? 'text-sm' : dimensions.width < 1024 ? 'text-base' : 'text-xl'
                    }`}>
                      {image.description}
                    </p>
                    <div className="flex justify-center items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                      <div className="w-6 md:w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 border-2 border-white rounded-full"></div>
                      <div className="w-6 md:w-8 h-1 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full"></div>
                    </div>
                    <button className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      dimensions.width < 768 ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'
                    }`}>
                      {dimensions.width < 768 ? 'Explore' : 'Explore Collection'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator - Responsive */}
        <div className={`fixed z-50 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg border border-gray-700 ${
          dimensions.width < 768 ? 'top-2 right-2 px-2 py-1' : 'top-4 right-4 px-3 py-2'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`text-white font-medium ${
              dimensions.width < 768 ? 'text-xs' : 'text-sm'
            }`}>
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className={`bg-gray-700 rounded-full overflow-hidden ${
              dimensions.width < 768 ? 'w-8 h-1' : 'w-12 h-2'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation dots - Responsive */}
        <div className={`fixed left-1/2 transform -translate-x-1/2 z-50 ${
          dimensions.width < 768 ? 'bottom-2' : 'bottom-4'
        }`}>
          <div className="flex space-x-1.5 md:space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-yellow-400 scale-125'
                    : 'bg-gray-600'
                } ${dimensions.width < 768 ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CSS animations with better performance */}
      <style jsx>{`
        @keyframes floatSimple {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        /* GPU acceleration for smooth animations */
        * {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-perspective: 1000;
          perspective: 1000;
        }

        /* Smooth scrolling with better performance */
        html {
          scroll-behavior: smooth;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Enhanced mobile touch scrolling */
        @media (max-width: 768px) {
          body {
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Optimized transforms for better performance */
        .transform-gpu {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default UltraSmoothHorizontalScroll;