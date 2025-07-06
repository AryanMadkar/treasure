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

// Particle system component
const ParticleSystem = ({ activeItem }) => {
  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-1 h-1 bg-white rounded-full opacity-70";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    const tl = gsap.timeline({ repeat: -1 });
    particles.forEach((particle, i) => {
      tl.to(
        particle,
        {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3 + 2,
          ease: "sine.inOut",
        },
        i * 0.1
      );
    });

    particlesRef.current = particles;

    return () => {
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  useEffect(() => {
    if (activeItem && particlesRef.current.length > 0) {
      gsap.to(particlesRef.current, {
        boxShadow: `0 0 10px ${activeItem.glow}`,
        backgroundColor: activeItem.glow,
        duration: 0.5,
        stagger: 0.02,
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

// Rarity badge component
const RarityBadge = ({ rarity }) => {
  const rarityColors = {
    Epic: "from-purple-500 to-pink-500",
    Legendary: "from-yellow-400 to-orange-500",
    Mythic: "from-red-500 to-purple-600",
  };

  return (
    <div
      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[rarity]} text-white shadow-lg`}
    >
      {rarity}
    </div>
  );
};

const App = () => {
  const component = useRef(null);
  const itemsRef = useRef([]);
  const [activeItem, setActiveItem] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const totalHeight = jewelryData.length * 100; // 100vh per item
      
      // Main pin animation - fixed to properly calculate end point
      ScrollTrigger.create({
        trigger: component.current,
        start: "top top",
        end: `+=${totalHeight}vh`,
        pin: ".pin-container",
        pinSpacing: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      // Enhanced item animations with proper trigger points
      itemsRef.current.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const startProgress = index / jewelryData.length;
        const endProgress = (index + 1) / jewelryData.length;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: component.current,
            start: `top+=${startProgress * totalHeight}vh top`,
            end: `top+=${endProgress * totalHeight}vh top`,
            scrub: 1,
            onEnter: () => setActiveItem(jewelryData[index]),
            onEnterBack: () => setActiveItem(jewelryData[index]),
            onLeave: () => {
              // Only clear if this is the last item
              if (index === jewelryData.length - 1) {
                setActiveItem(null);
              }
            },
          },
        });

        // More dramatic entrance animation
        tl.fromTo(
          item,
          {
            autoAlpha: 0,
            xPercent: isEven ? -300 : 300,
            yPercent: -100,
            rotation: isEven ? -90 : 90,
            scale: 0.3,
            z: -500,
            rotationY: isEven ? 180 : -180,
          },
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1,
            z: 0,
            rotationY: 0,
            duration: 0.4,
            ease: "power3.out",
          }
        )
          .to(
            item,
            {
              rotationY: isEven ? 15 : -15,
              scale: 1.05,
              duration: 0.2,
              ease: "power2.inOut",
              yoyo: true,
              repeat: 1,
            },
            ">0.1"
          )
          .to(
            item,
            {
              autoAlpha: 0,
              yPercent: isEven ? -80 : 80,
              scale: 0.6,
              rotation: isEven ? 45 : -45,
              z: -200,
              duration: 0.4,
              ease: "power2.in",
            },
            ">0.3"
          );
      });

      // Set initial active item
      setActiveItem(jewelryData[0]);
    }, component);

    return () => ctx.revert();
  }, []);

  // Dynamic background with transparency
  const backgroundStyle = {
    background: activeItem
      ? `radial-gradient(circle at 50% 50%, ${activeItem.glow}15 0%, transparent 70%)`
      : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
    backdropFilter: "blur(20px)",
    "--glow-color": activeItem ? activeItem.glow : "#ffffff",
    "--glow-intensity": scrollProgress,
  };

  return (
    <>
      <div className="relative w-full min-h-screen">
        {/* Transparent animated background */}
        <div
          className="fixed inset-0 w-full h-full transition-all duration-1000 ease-out"
          style={backgroundStyle}
        >
          <ParticleSystem activeItem={activeItem} />

          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-full animate-spin-slow" />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/10 rotate-45 animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-white/10 rounded-full animate-bounce-slow" />
          </div>
        </div>

        {/* Main content */}
        <div ref={component} className="relative z-10">
          <div className="pin-container h-screen w-full flex flex-col items-center justify-center px-4">
            {/* Enhanced title section */}
            <div className="text-center mb-12 pointer-events-none">
              <div className="relative">
                <h1
                  className="text-4xl sm:text-6xl lg:text-8xl font-black text-white uppercase transition-all duration-700 leading-tight"
                  style={{
                    textShadow: `0 0 30px var(--glow-color), 0 0 60px var(--glow-color)33`,
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
                <div className="mt-6 space-y-2">
                  <p className="text-2xl sm:text-3xl text-white font-bold">
                    ${activeItem.price.toLocaleString()}
                  </p>
                  <p className="text-lg text-gray-300 italic">
                    {activeItem.description}
                  </p>
                </div>
              )}

              {!activeItem && (
                <p className="text-xl sm:text-2xl text-gray-300 mt-6 font-light">
                  Scroll to traverse the cosmic collection
                </p>
              )}
            </div>

            {/* Enhanced rift portal */}
            <div className="relative">
              {/* Outer ring effect */}
              <div
                className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow"
                style={{
                  width: "500px",
                  height: "500px",
                  marginLeft: "-250px",
                  marginTop: "-250px",
                  left: "50%",
                  top: "50%",
                  boxShadow: `0 0 50px var(--glow-color)33`,
                }}
              />

              {/* Inner portal */}
              <div className="relative w-[300px] h-[400px] sm:w-[400px] sm:h-[500px] perspective-1000">
                {jewelryData.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => (itemsRef.current[index] = el)}
                    className="absolute inset-0 w-full h-full invisible"
                  >
                    <div className="w-full h-full p-6 transform-gpu">
                      <div
                        className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-xl border shadow-2xl group"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                          borderColor: `${item.glow}66`,
                          boxShadow: `
                            0 0 40px -10px ${item.glow}99,
                            inset 0 0 30px 0px ${item.glow}22,
                            0 25px 50px -12px rgba(0,0,0,0.5)
                          `,
                        }}
                      >
                        <RarityBadge rarity={item.rarity} />

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay gradient */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(45deg, transparent 0%, ${item.glow}44 100%)`,
                          }}
                        />

                        {/* Energy particles overlay */}
                        <div className="absolute inset-0 opacity-60">
                          <div
                            className="absolute top-4 left-4 w-2 h-2 rounded-full animate-ping"
                            style={{ backgroundColor: item.glow }}
                          />
                          <div
                            className="absolute bottom-8 right-8 w-1 h-1 rounded-full animate-pulse"
                            style={{ backgroundColor: item.glow }}
                          />
                          <div
                            className="absolute top-1/3 right-6 w-1.5 h-1.5 rounded-full animate-bounce"
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

        {/* Final section */}
        <div className="relative z-20 h-screen w-full bg-transparent flex items-center justify-center text-center">
          <div className="backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Rift Closed
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              You have witnessed all cosmic treasures
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* Enhanced global styles */}
      <style jsx global>{`
        body {
        
          color: #fff;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
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
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </>
  );
};

export default App;