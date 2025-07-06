import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const SmoothHorizontalScroll = () => {
  // Refs for DOM elements
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const sectionsRef = useRef([]);

  // State variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Preload images for better performance
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
          image.src = img.url;
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    preloadImages();
  }, [images]);

  // Smooth horizontal scroll effect with sticky behavior
  useEffect(() => {
    if (isLoading) return;

    const container = containerRef.current;
    const horizontal = horizontalRef.current;

    if (!container || !horizontal) return;

    const handleScroll = () => {
      if (!container || !horizontal) return;

      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress - the container should stick while scrolling through it
      let progress = 0;
      
      if (containerTop <= 0 && containerTop > -containerHeight + windowHeight) {
        // Container is in the "sticky" zone - calculate progress based on how much we've scrolled through it
        const scrolledDistance = Math.abs(containerTop);
        const totalScrollDistance = containerHeight - windowHeight;
        progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollDistance));
      } else if (containerTop > 0) {
        // Container hasn't reached the sticky position yet
        progress = 0;
      } else {
        // Container has been completely scrolled through
        progress = 1;
      }

      setScrollProgress(progress);

      // Calculate horizontal translation
      const maxTranslateX = horizontal.scrollWidth - window.innerWidth;
      const translateX = progress * maxTranslateX;

      // Apply smooth horizontal translation
      horizontal.style.transform = `translateX(-${translateX}px)`;

      // Update current image index based on progress
      const newImageIndex = Math.floor(progress * (images.length - 1));
      const clampedIndex = Math.max(0, Math.min(images.length - 1, newImageIndex));
      setCurrentImageIndex(clampedIndex);
    };

    // Smooth scroll handler with requestAnimationFrame
    const smoothScrollHandler = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', smoothScrollHandler, { passive: true });
    window.addEventListener('resize', smoothScrollHandler, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', smoothScrollHandler);
      window.removeEventListener('resize', smoothScrollHandler);
    };
  }, [isLoading, images.length]);

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

  // Enhanced particle generation for visual flair
  const generateParticles = useCallback((index, count = 8) => {
    return Array.from({ length: count }, (_, i) => {
      const image = images[index];
      const size = Math.random() * 3 + 1;
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
  }, [images]);

  // Memoized particles for performance
  const allParticles = useMemo(() =>
    images.map((_, idx) => generateParticles(idx, 6))
  , [images, generateParticles]);

  // Loader component
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-3"></div>
          <p className="text-white text-base font-semibold">Loading Collection...</p>
          <div className="mt-2 text-sm text-gray-400">
            {loadedImages.size} / {images.length} images loaded
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black">
      {/* Section Title */}
      <div className="text-center py-8 md:py-12 lg:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-300 to-slate-300">
          Featured Collection
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Discover our handpicked selection of exquisite jewelry pieces
        </p>
      </div>

      {/* Scroll hint */}
      <div className="text-center pb-8">
        <div className="inline-flex items-center space-x-2 bg-black bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
          <span className="text-white text-sm">Scroll down to explore horizontally</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Main container - increased height for sticky scroll effect */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${images.length * 150}vh` }} // Increased height for longer sticky duration
      >
        {/* Sticky horizontal scroll container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            ref={horizontalRef}
            className="flex h-full"
            style={{
              width: `${images.length * 100}vw`,
              willChange: 'transform',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                ref={el => sectionsRef.current[index] = el}
                className="relative w-screen h-full flex-shrink-0 overflow-hidden"
              >
                {/* Base image */}
                {loadedImages.has(image.url) ? (
                  <img
                    src={image.url}
                    alt={`${image.title} - ${image.description}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: `scale(${1 + scrollProgress * 0.1})`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  />
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

                {/* Particle system */}
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

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 p-6">
                  <div className="max-w-2xl">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-black bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-medium tracking-wider">
                        {image.category}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-300 to-slate-300 leading-tight">
                      {image.title}
                    </h3>
                    <p className="text-base md:text-lg lg:text-xl text-gray-100 mb-6 font-light leading-relaxed opacity-90">
                      {image.description}
                    </p>
                    <div className="flex justify-center items-center space-x-3 mb-6">
                      <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      <div className="w-2 h-2 border-2 border-white rounded-full"></div>
                      <div className="w-8 h-1 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full"></div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-yellow-400 scale-125'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes floatSimple {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default SmoothHorizontalScroll;