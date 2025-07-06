import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Enhanced jewelry data with more cosmic themes
const jewelryData = [
  {
    id: 1,
    name: "Cosmic Shard Ring",
    price: 2499,
    rarity: "Mythic",
    glow: "#8A2BE2",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708736/star_bow_a3nwjq.jpg",
    description: "Forged from stardust and dreams",
  },
  {
    id: 2,
    name: "Galaxy Opal Necklace",
    price: 3299,
    rarity: "Legendary",
    glow: "#00FFFF",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708735/spidercharm1_sxbbrg.jpg",
    description: "Holds the essence of distant galaxies",
  },
  {
    id: 3,
    name: "Nebula Bloom Earrings",
    price: 1899,
    rarity: "Epic",
    glow: "#FF1493",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708730/sparkleheart1_c4teao.webp",
    description: "Blooms with celestial energy",
  },
  {
    id: 4,
    name: "Supernova Bracelet",
    price: 2799,
    rarity: "Legendary",
    glow: "#FFD700",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708725/silverbat1_igbhva.webp",
    description: "Radiates explosive stellar power",
  },
  {
    id: 5,
    name: "Voidforged Crown",
    price: 4999,
    rarity: "Mythic",
    glow: "#FF4500",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708722/mauth2_f5oijf.webp",
    description: "Crafted in the heart of a black hole",
  },
  {
    id: 6,
    name: "Stardust Signet",
    price: 1799,
    rarity: "Epic",
    glow: "#4169E1",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708624/locket2_wvyp4q.webp",
    description: "Binds cosmic forces to your will",
  },
  {
    id: 7,
    name: "Event Horizon Choker",
    price: 2199,
    rarity: "Legendary",
    glow: "#32CD32",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708616/kitty_star1_vwqwru.jpg",
    description: "Touches the edge of reality",
  },
  {
    id: 8,
    name: "Celestial Cuff",
    price: 3499,
    rarity: "Mythic",
    glow: "#BA55D3",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708601/goldenstart1_ljd7g2.jpg",
    description: "Channels pure cosmic energy",
  },
  {
    id: 9,
    name: "Pulsar Pendant",
    price: 1999,
    rarity: "Epic",
    glow: "#00BFFF",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708589/goldenshell1_yec248.webp",
    description: "Pulses with neutron star rhythm",
  },
  {
    id: 10,
    name: "Quasar Ring",
    price: 2899,
    rarity: "Legendary",
    glow: "#FF6347",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708570/dragon1_tnryzu.webp",
    description: "Blazes with galactic core fire",
  },
  {
    id: 11,
    name: "Asteroid Weave Bracelet",
    price: 2399,
    rarity: "Epic",
    glow: "#20B2AA",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708563/cross1_-_Copy_h241xk.webp",
    description: "Woven from asteroid belt remnants",
  },
  {
    id: 12,
    name: "Solar Flare Earrings",
    price: 1699,
    rarity: "Epic",
    glow: "#FF4500",
    image:
      "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708577/drangwing2_-_Copy_-_Copy_qynvx3.webp",
    description: "Captures solar storm essence",
  },
];

// Mobile-optimized particle system
const ParticleSystem = ({ activeItem }) => {
  const particlesRef = useRef([]);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = [];
    const particleCount = isMobile ? 15 : 30; // Reduced for mobile

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-1 h-1 bg-white rounded-full opacity-50";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    // Smoother, lighter animation for mobile
    const tl = gsap.timeline({ repeat: -1 });
    particles.forEach((particle, i) => {
      tl.to(
        particle,
        {
          x: (Math.random() - 0.5) * (isMobile ? 100 : 200),
          y: (Math.random() - 0.5) * (isMobile ? 100 : 200),
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 4 + 3, // Slower animation
          ease: "sine.inOut",
        },
        i * 0.2
      );
    });

    particlesRef.current = particles;

    return () => {
      particles.forEach((particle) => particle.remove());
    };
  }, [isMobile]);

  useEffect(() => {
    if (activeItem && particlesRef.current.length > 0) {
      gsap.to(particlesRef.current, {
        boxShadow: `0 0 8px ${activeItem.glow}`,
        backgroundColor: activeItem.glow,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [activeItem]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    />
  );
};

// Mobile-optimized rarity badge
const RarityBadge = ({ rarity }) => {
  const rarityColors = {
    Epic: "from-purple-500 to-pink-500",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-red-500 to-purple-600",
  };

  return (
    <div
      className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r ${rarityColors[rarity]} text-white shadow-lg z-10`}
    >
      {rarity}
    </div>
  );
};

const Collections = () => {
  const component = useRef(null);
  const itemsRef = useRef([]);
  const [activeItem, setActiveItem] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Smoother, slower scroll behavior
      const totalHeight = jewelryData.length * 120; // Increased for smoother transitions
      
      // Main pin animation with improved mobile handling
      ScrollTrigger.create({
        trigger: component.current,
        start: "top top",
        end: `+=${totalHeight}vh`,
        pin: ".pin-container",
        pinSpacing: true,
        scrub: isMobile ? 0.5 : 1, // Smoother scrub for mobile
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Mobile-optimized item animations
      itemsRef.current.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const startProgress = index / jewelryData.length;
        const endProgress = (index + 1) / jewelryData.length;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: component.current,
            start: `top+=${startProgress * totalHeight}vh top`,
            end: `top+=${endProgress * totalHeight}vh top`,
            scrub: isMobile ? 0.3 : 0.8, // Smoother scrub
            onEnter: () => setActiveItem(jewelryData[index]),
            onEnterBack: () => setActiveItem(jewelryData[index]),
            onLeave: () => {
              if (index === jewelryData.length - 1) {
                setActiveItem(null);
              }
            },
          },
        });

        // Gentler, mobile-friendly animations
        tl.fromTo(
          item,
          {
            autoAlpha: 0,
            xPercent: isEven ? (isMobile ? -150 : -300) : (isMobile ? 150 : 300),
            yPercent: isMobile ? -50 : -100,
            rotation: isEven ? (isMobile ? -30 : -90) : (isMobile ? 30 : 90),
            scale: isMobile ? 0.5 : 0.3,
            z: isMobile ? -200 : -500,
            rotationY: isEven ? (isMobile ? 90 : 180) : (isMobile ? -90 : -180),
          },
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1,
            z: 0,
            rotationY: 0,
            duration: 0.6, // Slower duration
            ease: "power2.out",
          }
        )
          .to(
            item,
            {
              rotationY: isEven ? (isMobile ? 8 : 15) : (isMobile ? -8 : -15),
              scale: isMobile ? 1.02 : 1.05,
              duration: 0.3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: 1,
            },
            ">0.2"
          )
          .to(
            item,
            {
              autoAlpha: 0,
              yPercent: isEven ? (isMobile ? -40 : -80) : (isMobile ? 40 : 80),
              scale: isMobile ? 0.8 : 0.6,
              rotation: isEven ? (isMobile ? 20 : 45) : (isMobile ? -20 : -45),
              z: isMobile ? -100 : -200,
              duration: 0.5,
              ease: "power2.in",
            },
            ">0.5"
          );
      });

      // Set initial active item
      setActiveItem(jewelryData[0]);
    }, component);

    return () => ctx.revert();
  }, [isMobile]);

  // Mobile-optimized background
  const backgroundStyle = {
    background: activeItem
      ? `radial-gradient(circle at 50% 50%, ${activeItem.glow}${isMobile ? '10' : '15'} 0%, transparent 70%)`
      : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
    backdropFilter: isMobile ? "blur(10px)" : "blur(20px)",
    "--glow-color": activeItem ? activeItem.glow : "#ffffff",
    "--glow-intensity": scrollProgress,
  };

  return (
    <>
      <div className="relative w-full min-h-screen">
        {/* Optimized animated background */}
        <div
          className="fixed inset-0 w-full h-full transition-all duration-1000 ease-out"
          style={backgroundStyle}
        >
          <ParticleSystem activeItem={activeItem} />

          {/* Simplified geometric shapes for mobile */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 border border-white/5 sm:border-white/10 rounded-full animate-spin-slow" />
            <div className="absolute top-3/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 border border-white/5 sm:border-white/10 rotate-45 animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 sm:w-16 sm:h-16 border border-white/5 sm:border-white/10 rounded-full animate-bounce-slow" />
          </div>
        </div>

        {/* Main content */}
        <div ref={component} className="relative z-10">
          <div className="pin-container h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8">
            {/* Mobile-responsive title section */}
            <div className="text-center mb-8 sm:mb-12 pointer-events-none">
              <div className="relative">
                <h1
                  className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase transition-all duration-1000 leading-tight"
                  style={{
                    textShadow: `0 0 ${isMobile ? '15px' : '30px'} var(--glow-color), 0 0 ${isMobile ? '30px' : '60px'} var(--glow-color)33`,
                    background: `linear-gradient(45deg, white, var(--glow-color))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {activeItem ? activeItem.name : "Dimensional Rift"}
                </h1>
                <div
                  className="absolute inset-0 blur-sm opacity-50"
                  style={{
                    background: `linear-gradient(45deg, transparent, var(--glow-color))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {activeItem ? activeItem.name : "Dimensional Rift"}
                </div>
              </div>

              {activeItem && (
                <div className="mt-4 sm:mt-6 space-y-2">
                  <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
                    ${activeItem.price.toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 italic px-4">
                    {activeItem.description}
                  </p>
                </div>
              )}

              {!activeItem && (
                <p className="text-base sm:text-xl md:text-2xl text-gray-300 mt-4 sm:mt-6 font-light px-4">
                  Scroll to traverse the cosmic collection
                </p>
              )}
            </div>

            {/* Mobile-optimized rift portal */}
            <div className="relative">
              {/* Simplified outer ring for mobile */}
              <div
                className="absolute inset-0 rounded-full border border-white/10 sm:border-2 sm:border-white/20 animate-spin-slow"
                style={{
                  width: isMobile ? "280px" : "500px",
                  height: isMobile ? "280px" : "500px",
                  marginLeft: isMobile ? "-140px" : "-250px",
                  marginTop: isMobile ? "-140px" : "-250px",
                  left: "50%",
                  top: "50%",
                  boxShadow: `0 0 ${isMobile ? '25px' : '50px'} var(--glow-color)33`,
                }}
              />

              {/* Responsive inner portal */}
              <div className="relative w-[240px] h-[320px] sm:w-[300px] sm:h-[400px] md:w-[400px] md:h-[500px] perspective-1000">
                {jewelryData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => (itemsRef.current[index] = el)}
                    className="absolute inset-0 w-full h-full invisible"
                  >
                    <div className="w-full h-full p-3 sm:p-4 md:p-6 transform-gpu">
                      <div
                        className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl border shadow-2xl group"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                          borderColor: `${item.glow}66`,
                          boxShadow: `
                            0 0 ${isMobile ? '20px' : '40px'} ${isMobile ? '-5px' : '-10px'} ${item.glow}99,
                            inset 0 0 ${isMobile ? '15px' : '30px'} 0px ${item.glow}22,
                            0 ${isMobile ? '15px' : '25px'} ${isMobile ? '30px' : '50px'} ${isMobile ? '-8px' : '-12px'} rgba(0,0,0,0.5)
                          `,
                        }}
                      >
                        <RarityBadge rarity={item.rarity} />

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Mobile-optimized overlay */}
                        <div
                          className="absolute inset-0 opacity-20 sm:opacity-30"
                          style={{
                            background: `linear-gradient(45deg, transparent 0%, ${item.glow}44 100%)`,
                          }}
                        />

                        {/* Simplified energy particles for mobile */}
                        <div className="absolute inset-0 opacity-40 sm:opacity-60">
                          <div
                            className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-ping"
                            style={{ backgroundColor: item.glow }}
                          />
                          <div
                            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-1 h-1 rounded-full animate-pulse"
                            style={{ backgroundColor: item.glow }}
                          />
                          <div
                            className="absolute top-1/3 right-4 sm:right-6 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-bounce"
                            style={{ backgroundColor: item.glow }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized final section */}
        <div className="relative z-20 h-screen w-full bg-transparent flex items-center justify-center text-center px-4">
          <div className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-white/10 max-w-md sm:max-w-lg">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Rift Closed
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
              You have witnessed all cosmic treasures
            </p>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* Enhanced mobile-optimized global styles */}
      <style jsx global>{`
        body {
          color: #fff;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        /* Mobile-optimized scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        /* Mobile performance optimizations */
        @media (max-width: 767px) {
          * {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          .animate-spin-slow {
            animation: spin-slow 40s linear infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 5s ease-in-out infinite;
          }
        }
      `}</style>
    </>
  );
};

export default Collections;