import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const Details = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [modelsPreloaded, setModelsPreloaded] = useState(false);
  const preloadedModels = useRef({});

  // Sample jewelry data - replace with your actual data
  const jewelryData = [
    {
      id: "spider",
      title: "Spider Charm",
      description: "Intricate spider design with detailed craftsmanship",
      image:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708735/spidercharm2_qaw7tv.jpg",
      modelPath:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708736/spider_dsigfw.glb",
      scale: 1.2,
      position: [0, 0, 0],
    },
    {
      id: "star-bow",
      title: "Star Bow",
      description: "24K gold fusion with precious gemstones",
      image:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708737/star_bow2_w1gua2.jpg",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708752/starandbow_lxhh8b.glb",
      scale: 1.0,
      position: [0, -0.5, 0],
    },
    {
      id: "royal",
      title: "Royal Collection",
      description: "Exclusive design with sapphire and emerald",
      image:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708661/mauth1_-_Copy_pvi76m.webp",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751709575/tripo_convert_28861a54-aa0c-4b11-91c9-a7c95d747522_mv9ay6.glb",
      scale: 1.8,
      position: [0, 0, 0],
    },
    {
      id: "vintage",
      title: "Vintage Base",
      description: "Classic design with modern craftsmanship",
      image:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708624/locket3_qwopjv.webp",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708583/gem_y88pmm.glb",
      scale: 1.5,
      position: [0, -0.6, 0],
    },
    {
      id: "gem-artistry",
      title: "Gem Artistry",
      description: "Contemporary design with platinum finish",
      image: "/goldenshell2 - Copy - Copy.webp",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708747/stars_der5ij.glb",
      scale: 1.0,
      position: [0, -1, 0],
    },
    {
      id: "sparkle-heart",
      title: "Sparkle Heart",
      description: "Eternal elegance meets innovative design",
      image:
        "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708733/sparkleheart2_v2gghe.webp",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708729/Sparkle_Heart_Pendant_0704170231_texture_spi1vg.glb",
      scale: 0.8,
      position: [0, 0, 0],
    },
  ];

  // Preload all 3D models
  useEffect(() => {
    const preloadModels = async () => {
      const loader = new GLTFLoader();
      const loadPromises = jewelryData.map((item) => {
        return new Promise((resolve) => {
          loader.load(
            item.modelPath,
            (gltf) => {
              // Clone the scene for reuse
              preloadedModels.current[item.id] = gltf.scene.clone();
              resolve();
            },
            undefined,
            (error) => {
              console.error(`Error preloading model ${item.title}:`, error);
              resolve(); // Continue even if one model fails
            }
          );
        });
      });

      await Promise.all(loadPromises);
      setModelsPreloaded(true);
    };

    preloadModels();
  }, []);

  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap) {
        setGsapLoaded(true);
        return;
      }

      try {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Load ScrollTrigger plugin
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        window.gsap.registerPlugin(window.ScrollTrigger);
        setGsapLoaded(true);
      } catch (error) {
        console.error("Failed to load GSAP:", error);
      }
    };

    loadGSAP();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!gsapLoaded || !window.gsap || !modelsPreloaded) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 100, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1.5, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Card animations
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Stagger animation on scroll
      gsap.fromTo(
        card,
        { 
          opacity: 0, 
          y: 100, 
          scale: 0.8,
          rotationY: 45
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect
      gsap.to(card, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Hover animation enhancement
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.08,
          rotationY: 5,
          z: 50,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [gsapLoaded, modelsPreloaded]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-transparent text-white overflow-hidden"
    >
      {/* Loading overlay */}
      {(!gsapLoaded || !modelsPreloaded) && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-yellow-400 opacity-20"></div>
            </div>
            <p className="text-lg font-semibold">
              {!gsapLoaded ? "Loading animations..." : "Preparing 3D models..."}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {modelsPreloaded ? "Almost ready!" : "This may take a moment..."}
            </p>
          </div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent"
        >
          Premium Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {jewelryData.map((item, index) => (
            <div
              key={item.id}
              ref={el => cardsRef.current[index] = el}
              className="transform-gpu"
            >
              <JewelryCard
                item={item}
                isActive={isHovered === item.id}
                onHoverStart={() => setIsHovered(item.id)}
                onHoverEnd={() => setIsHovered(null)}
                preloadedModel={preloadedModels.current[item.id]}
              />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Each piece is meticulously crafted using the finest materials and
            cutting-edge 3D design technology. Hover over items to see them come
            to life.
          </p>
        </div>
      </div>
    </div>
  );
};

// Jewelry Card Component
function JewelryCard({ item, isActive, onHoverStart, onHoverEnd, preloadedModel }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const animationId = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Initialize and clean up Three.js
  useEffect(() => {
    if (!isActive || !canvasRef.current || !preloadedModel) return;

    const initScene = () => {
      // Setup renderer with optimized settings
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Setup scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        45,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 3);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Enhanced lighting
      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
      scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight1.position.set(2, 2, 3);
      directionalLight1.castShadow = true;
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight2.position.set(-2, -1, -2);
      scene.add(directionalLight2);

      // Add rim lighting
      const rimLight = new THREE.DirectionalLight(0x4444ff, 0.4);
      rimLight.position.set(0, 0, -3);
      scene.add(rimLight);

      // Use preloaded model
      const model = preloadedModel.clone();
      model.scale.set(item.scale, item.scale, item.scale);
      model.position.set(...item.position);
      
      // Enable shadows for model
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Optimize materials
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });

      scene.add(model);
      modelRef.current = model;
      setModelLoaded(true);

      // Start animation
      animate();
    };

    const animate = () => {
      if (!modelRef.current || !sceneRef.current || !cameraRef.current) {
        animationId.current = requestAnimationFrame(animate);
        return;
      }

      // Smooth rotation
      modelRef.current.rotation.y += 0.008;
      modelRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationId.current = requestAnimationFrame(animate);
    };

    initScene();

    // Cleanup
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
          sceneRef.current.remove(child);
        }
      }

      setModelLoaded(false);
    };
  }, [isActive, item, preloadedModel]);

  return (
    <div
      className={`relative h-80 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isActive ? "ring-2 ring-yellow-400/50 shadow-2xl shadow-yellow-400/20" : "ring-1 ring-gray-700/50"
      }`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Default image */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-700 ${
          isActive ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* 3D Model Canvas */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-700 ${
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Model loading indicator */}
        {isActive && !modelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent">
        <h3 className="text-lg font-bold text-yellow-300 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {isActive ? "Interactive 3D Model" : "Hover to view 3D"}
          </div>
          <div className="text-xs text-yellow-400 font-semibold">
            Premium Quality
          </div>
        </div>
      </div>

      {/* Hover effects */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
        </div>
      )}
    </div>
  );
}

export default Details;