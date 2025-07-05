import React, { useRef, useLayoutEffect, useState } from "react";
import {
  FaArrowDown,
  FaGem,
  FaCrown,
  FaRing,
  FaStar,
  FaHeart,
  FaShoppingBag,
  FaEye,
} from "react-icons/fa";
import Abouts from "./Abouts";
import Details from "./Details";

export default function JewelryPortfolio() {
  const containerRef = useRef();
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();
  const leftTextRef = useRef();
  const rightTextRef = useRef();
  const scrollIndicatorRef = useRef();
  const mainContentRef = useRef();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    const initAnimation = () => {
      // Staggered text animations with luxury timing
      if (leftTextRef.current) {
        leftTextRef.current.style.transform =
          "translateX(-150px) rotate(-5deg)";
        leftTextRef.current.style.opacity = "0";
        setTimeout(() => {
          leftTextRef.current.style.transition =
            "all 2s cubic-bezier(0.165, 0.84, 0.44, 1)";
          leftTextRef.current.style.transform = "translateX(0) rotate(0deg)";
          leftTextRef.current.style.opacity = "1";
        }, 800);
      }

      if (rightTextRef.current) {
        rightTextRef.current.style.transform = "translateX(150px) rotate(5deg)";
        rightTextRef.current.style.opacity = "0";
        setTimeout(() => {
          rightTextRef.current.style.transition =
            "all 2s cubic-bezier(0.165, 0.84, 0.44, 1)";
          rightTextRef.current.style.transform = "translateX(0) rotate(0deg)";
          rightTextRef.current.style.opacity = "1";
        }, 1200);
      }

      // Luxury scroll indicator
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.transform =
          "translateY(100px) scale(0.5)";
        scrollIndicatorRef.current.style.opacity = "0";
        setTimeout(() => {
          scrollIndicatorRef.current.style.transition =
            "all 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
          scrollIndicatorRef.current.style.transform = "translateY(0) scale(1)";
          scrollIndicatorRef.current.style.opacity = "1";
        }, 2000);
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 0.8), 1);

      setScrollProgress(progress);

      if (progress > 0.05 && !isAnimating) {
        setIsAnimating(true);
      }

      if (leftPanelRef.current && rightPanelRef.current) {
        const translateX = progress * 120;
        const opacity = Math.max(0, 1 - progress * 1.5);

        leftPanelRef.current.style.transform = `translateX(-${translateX}%) scale(${
          1 + progress * 0.1
        })`;
        rightPanelRef.current.style.transform = `translateX(${translateX}%) scale(${
          1 + progress * 0.1
        })`;

        // Fade effect
        leftPanelRef.current.style.opacity = opacity;
        rightPanelRef.current.style.opacity = opacity;

        // Scroll indicator fade
        if (scrollIndicatorRef.current) {
          scrollIndicatorRef.current.style.opacity = Math.max(
            0,
            1 - progress * 2
          );
          scrollIndicatorRef.current.style.transform = `translateY(${
            progress * 50
          }px) scale(${1 - progress * 0.5})`;
        }
      }

      // Reveal main content with luxury timing
      if (progress > 0.6 && mainContentRef.current) {
        const contentOpacity = Math.min((progress - 0.6) * 2.5, 1);
        mainContentRef.current.style.opacity = contentOpacity;
        mainContentRef.current.style.transform = `translateY(${Math.max(
          0,
          80 - contentOpacity * 80
        )}px)`;
      }
    };

    initAnimation();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAnimating]);

  return (
    <div ref={containerRef} className="relative">
      {/* Split Screen Section */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Left Panel - Gold to Black Gradient */}
        <div
          ref={leftPanelRef}
          className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            background:
              "linear-gradient(135deg, #FFD700 0%, #FFA500 20%, #FF8C00 40%, #8B4513 70%, #2C1810 90%, #000000 100%)",
            zIndex: 10,
          }}
        >
          <div
            ref={leftTextRef}
            className="text-white text-center px-8 max-w-lg relative"
          >
            {/* Floating gems */}
            <div className="absolute -top-10 -left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute -top-5 -right-5 w-3 h-3 bg-amber-300 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute -bottom-8 left-5 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-50"></div>

            <FaCrown className="text-6xl text-yellow-300 mx-auto mb-8 animate-pulse" />
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              LUXURY
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-300 animate-pulse">
                GOLD
              </span>
              <span className="block text-2xl font-light mt-2 text-yellow-100">
                COLLECTION
              </span>
            </h1>
            <p className="text-lg text-yellow-100 mb-8 leading-relaxed opacity-90">
              Exquisite handcrafted gold jewelry pieces that embody timeless
              elegance and royal sophistication.
            </p>

            {/* Ornamental elements */}
            <div className="flex justify-center space-x-6 mb-6">
              <FaRing
                className="text-2xl text-yellow-300 animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <FaGem className="text-2xl text-amber-300 animate-bounce" />
            </div>

            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse delay-300"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Silver to Black Gradient */}
        <div
          ref={rightPanelRef}
          className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            background:
              "linear-gradient(225deg, #C0C0C0 0%, #A8A8A8 20%, #808080 40%, #505050 70%, #2C2C2C 90%, #000000 100%)",
            zIndex: 10,
          }}
        >
          <div
            ref={rightTextRef}
            className="text-white text-center px-8 max-w-lg relative"
          >
            {/* Floating gems */}
            <div className="absolute -top-10 -right-10 w-4 h-4 bg-slate-300 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute -top-5 -left-5 w-3 h-3 bg-gray-300 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute -bottom-8 right-5 w-2 h-2 bg-slate-400 rounded-full animate-ping opacity-50"></div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              PREMIUM
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 animate-pulse">
                SILVER
              </span>
              <span className="block text-2xl font-light mt-2 text-slate-100">
                COLLECTION
              </span>
            </h1>
            <p className="text-lg text-slate-100 mb-8 leading-relaxed opacity-90">
              Sophisticated sterling silver designs that capture modern elegance
              with contemporary flair.
            </p>

            {/* Ornamental elements */}
            <div className="flex justify-center space-x-6 mb-6">
              <FaHeart className="text-2xl text-slate-300 animate-pulse" />
              <FaGem className="text-2xl text-gray-300 animate-bounce" />
              <FaStar
                className="text-2xl text-slate-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>

            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-gray-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full animate-pulse delay-300"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-gray-300 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <FaGem className="text-3xl text-yellow-300 mx-auto mb-2 animate-bounce" />
              <span className="text-sm font-light tracking-widest text-white/80 block">
                DISCOVER
              </span>
              <span className="text-xs font-light tracking-wider text-white/60 block">
                THE COLLECTION
              </span>
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent rounded-full animate-pulse"></div>
              <div className="w-1 h-8 bg-gradient-to-b from-slate-400 to-transparent rounded-full animate-pulse delay-300"></div>
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Luxury Portfolio */}
      <div className="relative" style={{ paddingTop: "100vh" }}>
        <div
          ref={mainContentRef}
          className="min-h-screen bg-transparent text-white opacity-0 transition-all duration-1000"
        >
          {/* Hero Section */}
          <div className="container mx-auto px-6 py-20">
            <div className="text-center mb-20">
              <FaCrown className="text-8xl text-yellow-400 mx-auto mb-8 animate-pulse" />
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-300 to-slate-300">
                JEWEL ARTISTRY
              </h1>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Where precious metals meet extraordinary craftsmanship. Each
                piece tells a story of luxury, elegance, and timeless beauty.
              </p>
            </div>
            <Abouts />

            {/* Jewelry Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {[
                {
                  icon: FaGem,
                  number: "500+",
                  label: "Unique Designs",
                  color: "text-yellow-400",
                },
                {
                  icon: FaCrown,
                  number: "25+",
                  label: "Years Experience",
                  color: "text-slate-300",
                },
                {
                  icon: FaHeart,
                  number: "1000+",
                  label: "Happy Customers",
                  color: "text-pink-400",
                },
                {
                  icon: FaStar,
                  number: "5.0",
                  label: "Expert Rating",
                  color: "text-amber-400",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-8 bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-500 group"
                >
                  <stat.icon
                    className={`text-5xl ${stat.color} mx-auto mb-4 group-hover:scale-125 transition-transform duration-300`}
                  />
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Details />

            {/* Jewelry Collections */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "Bridal Collection",
                  description:
                    "Stunning engagement rings and wedding bands crafted for your special day.",
                  icon: FaRing,
                  gradient: "from-yellow-400 to-orange-500",
                  bgGradient: "from-yellow-400/20 to-orange-500/20",
                },
                {
                  title: "Luxury Necklaces",
                  description:
                    "Exquisite necklaces that add elegance to any occasion.",
                  icon: FaGem,
                  gradient: "from-slate-400 to-gray-500",
                  bgGradient: "from-slate-400/20 to-gray-500/20",
                },
                {
                  title: "Custom Designs",
                  description:
                    "Personalized jewelry pieces created exclusively for you.",
                  icon: FaCrown,
                  gradient: "from-pink-400 to-purple-500",
                  bgGradient: "from-pink-400/20 to-purple-500/20",
                },
              ].map((collection, i) => (
                <div
                  key={i}
                  className={`p-8 bg-gradient-to-br ${collection.bgGradient} backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 group hover:scale-105`}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${collection.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <collection.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {collection.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {collection.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    <FaEye />
                    <span>View Collection</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 px-10 py-5 rounded-full text-white font-bold text-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 cursor-pointer group shadow-2xl shadow-yellow-500/25">
                <FaShoppingBag className="text-xl group-hover:scale-110 transition-transform duration-300" />
                <span>Explore Collection</span>
                <FaGem className="text-xl group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <p className="text-gray-400 mt-4 text-sm">
                Free worldwide shipping on orders over $500
              </p>
            </div>
          </div>

          {/* Luxury Footer */}
          <div className="border-t border-gradient-to-r from-yellow-400/20 to-slate-400/20 py-12">
            <div className="container mx-auto px-6 text-center">
              <div className="flex justify-center space-x-6 mb-6">
                <FaCrown className="text-2xl text-yellow-400" />
                <FaGem className="text-2xl text-slate-300" />
              </div>
              <p className="text-gray-400">
                &copy; 2025 Jewel Artistry. Crafted with passion since 1999.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
