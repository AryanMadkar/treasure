import React, { useRef, useLayoutEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import SexyGSAPNavbar from "../components/Navbar";
import homebg from "/homebg.png"; // Assuming you have a homebg.jpg in your public folder
// import SexyGSAPNavbar from "./SexyGSAPNavbar"; // Uncomment when using as separate files

export default function Home() {
  const containerRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const ctaRef = useRef();
  const imgWrapRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    // Initial animations
    const elements = [titleRef.current, subtitleRef.current];
    elements.forEach((el, i) => {
      if (el) {
        el.style.transform = "translateY(50px)";
        el.style.opacity = "0";
        setTimeout(() => {
          el.style.transition = "all 1s cubic-bezier(0.23, 1, 0.320, 1)";
          el.style.transform = "translateY(0)";
          el.style.opacity = "1";
        }, i * 300);
      }
    });

    // Image animation
    if (imgWrapRef.current) {
      imgWrapRef.current.style.transform = "translateX(200px)";
      imgWrapRef.current.style.opacity = "0";
      setTimeout(() => {
        imgWrapRef.current.style.transition =
          "all 1.2s cubic-bezier(0.23, 1, 0.320, 1)";
        imgWrapRef.current.style.transform = "translateX(0)";
        imgWrapRef.current.style.opacity = "1";
      }, 600);
    }

    // CTA animation
    if (ctaRef.current) {
      ctaRef.current.style.transform = "scale(0)";
      setTimeout(() => {
        ctaRef.current.style.transition =
          "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        ctaRef.current.style.transform = "scale(1)";
      }, 1400);
    }

    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-transparent overflow-hidden"
    >
      {/* Uncomment when using as separate files */}
      <SexyGSAPNavbar />
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto h-screen px-6 lg:px-12 pt-20">
        {/* Text Content */}
        <div className="flex-1 text-white space-y-6 z-20">
          <h1
            ref={titleRef}
            className="text-4xl lg:text-6xl font-light leading-tight hover:scale-105 transition-all duration-500 cursor-default"
          >
            ELEVATE YOUR{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse hover:animate-none hover:scale-110 inline-block transition-all duration-300">
              ORNAMENTATION
            </span>
          </h1>
          <p
            ref={subtitleRef}
            className="text-gray-300 max-w-lg text-lg leading-relaxed hover:text-gray-100 hover:scale-105 transition-all duration-300 cursor-default"
          >
            Discover handcrafted pieces that blend timeless elegance with modern
            flair. Every ornament tells a story—make yours unforgettable.
          </p>
          <button
            ref={ctaRef}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-full font-semibold shadow-2xl relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-pink-500/50"
            onMouseEnter={(e) => {
              e.target.style.transform =
                "translateY(-5px) scale(1.08) rotate(2deg)";
              e.target.style.boxShadow = "0 25px 50px rgba(236, 72, 153, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1) rotate(0deg)";
              e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
            }}
          >
            <span className="relative z-10 group-hover:animate-pulse">
              Shop the Collection
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 delay-200"></div>
          </button>
        </div>

        {/* Image */}
        <div
          ref={imgWrapRef}
          className="flex-1 mt-10 lg:mt-0 flex justify-center z-10"
        >
          <div
            className="relative group cursor-pointer"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
              e.currentTarget.style.transition =
                "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            }}
          >
            <div className="w-80 lg:w-[28rem]  h-80 lg:h-[28rem] rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-pink-500/50 transition-all duration-500">
              <img
                src={homebg}
                alt="Ornament"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-500"></div>

              {/* Floating elements inside the card */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
              <div className="absolute top-6 right-6 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300 delay-100"></div>
              <div className="absolute bottom-6 left-6 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-200"></div>

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-pink-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Social Links */}
      <div className="absolute bottom-8 right-8 flex space-x-6 text-white text-2xl z-20">
        {[
          {
            icon: FaFacebook,
            color: "hover:text-blue-500",
            bg: "hover:bg-blue-500/20",
          },
          {
            icon: FaTwitter,
            color: "hover:text-blue-400",
            bg: "hover:bg-blue-400/20",
          },
          {
            icon: FaInstagram,
            color: "hover:text-pink-500",
            bg: "hover:bg-pink-500/20",
          },
        ].map((social, i) => (
          <a
            key={i}
            href="#"
            className={`${social.color} ${social.bg} transition-all duration-300 relative group p-3 rounded-full border border-transparent hover:border-white/20`}
            onMouseEnter={(e) => {
              e.target.style.transform =
                "translateY(-8px) scale(1.3) rotate(10deg)";
              e.target.style.filter =
                "drop-shadow(0 10px 20px rgba(236, 72, 153, 0.4))";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1) rotate(0deg)";
              e.target.style.filter = "drop-shadow(0 0 0 transparent)";
            }}
          >
            <social.icon className="group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-30 rounded-full transition-all duration-300"></div>
            <div className="absolute inset-0 border-2 border-pink-500 opacity-0 group-hover:opacity-100 rounded-full animate-ping transition-all duration-300"></div>
          </a>
        ))}
      </div>

      {/* Interactive Floating elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-pink-500 rounded-full animate-bounce opacity-60 hover:opacity-100 hover:scale-150 hover:animate-ping transition-all duration-300 cursor-pointer"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-300 opacity-60 hover:opacity-100 hover:scale-150 hover:animate-spin transition-all duration-300 cursor-pointer"></div>
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-700 opacity-60 hover:opacity-100 hover:scale-200 hover:animate-pulse transition-all duration-300 cursor-pointer"></div>
      <div className="absolute top-1/2 right-10 w-5 h-5 bg-emerald-500 rounded-full animate-pulse opacity-40 hover:opacity-100 hover:scale-125 hover:animate-bounce transition-all duration-300 cursor-pointer"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-500 opacity-50 hover:opacity-100 hover:scale-150 hover:animate-ping transition-all duration-300 cursor-pointer"></div>
    </div>
  );
}
