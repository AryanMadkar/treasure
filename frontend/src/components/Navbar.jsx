import React, { useRef, useLayoutEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function SexyGSAPNavbar() {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const logoRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useLayoutEffect(() => {
    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial animations
    if (navRef.current) {
      navRef.current.style.transform = 'translateY(-100px)';
      navRef.current.style.opacity = '0';
      
      setTimeout(() => {
        navRef.current.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.320, 1)';
        navRef.current.style.transform = 'translateY(0)';
        navRef.current.style.opacity = '1';
      }, 100);
    }

    // Stagger links animation
    linksRef.current.forEach((link, i) => {
      if (link) {
        link.style.transform = 'translateY(-20px)';
        link.style.opacity = '0';
        setTimeout(() => {
          link.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
          link.style.transform = 'translateY(0)';
          link.style.opacity = '1';
        }, 500 + i * 100);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = ["Home", "Services", "Portfolio", "Contact"];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-8 py-4 flex items-center justify-between ${
        scrolled 
          ? 'backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl' 
          : 'backdrop-blur-lg bg-black/20'
      }`}
    >
      {/* Logo with magnetic effect */}
      <div
        ref={logoRef}
        className="text-white font-extrabold text-2xl cursor-pointer select-none relative overflow-hidden group"
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1) rotate(5deg)';
          e.target.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        <span className="relative z-10">Premium💎</span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
      </div>

      {/* Hamburger */}
      <button
        className="text-white text-2xl lg:hidden relative group"
        onClick={() => setOpen(!open)}
      >
        <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        <div className="relative z-10 p-2">
          {open ? <FiX /> : <FiMenu />}
        </div>
      </button>

      {/* Links */}
      <ul
        className={`flex-col lg:flex-row lg:flex lg:items-center lg:space-x-8 ${
          open ? "flex" : "hidden"
        } absolute lg:static top-full left-0 w-full lg:w-auto bg-black/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-6 lg:p-0 rounded-b-xl lg:rounded-none border-b border-white/10 lg:border-none`}
      >
        {navItems.map((item, i) => (
          <li key={item} className="mb-4 lg:mb-0">
            <a
              href={`#${item.toLowerCase()}`}
              ref={(el) => (linksRef.current[i] = el)}
              className="text-white text-lg relative group cursor-pointer block"
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.color = '#ec4899';
                e.target.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.color = '#ffffff';
              }}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}