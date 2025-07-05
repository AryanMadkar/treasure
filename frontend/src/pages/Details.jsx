import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Details = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  
  // Sample jewelry data - replace with your actual data
  const jewelryData = [
    {
      id: "spider",
      title: "Spider Charm",
      description: "Intricate spider design with detailed craftsmanship",
      image: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708735/spidercharm2_qaw7tv.jpg",
      modelPath: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708736/spider_dsigfw.glb",
      scale: 1.2,
      position: [0, 0, 0]
    },
    {
      id: "star-bow",
      title: "Star Bow",
      description: "24K gold fusion with precious gemstones",
      image: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708737/star_bow2_w1gua2.jpg",
      modelPath: "/starandbow.glb",
      scale: 1.0,
      position: [0, -0.5, 0]
    },
    {
      id: "royal",
      title: "Royal Collection",
      description: "Exclusive design with sapphire and emerald",
      image: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708661/mauth1_-_Copy_pvi76m.webp",
      modelPath: "/mauth.glb",
      scale: 0.9,
      position: [0, 0, 0]
    },
    {
      id: "vintage",
      title: "Vintage Base",
      description: "Classic design with modern craftsmanship",
      image: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708624/locket3_qwopjv.webp",
      modelPath: "/gem.glb",
      scale: 1.1,
      position: [0, 0.2, 0]
    },
    {
      id: "gem-artistry",
      title: "Gem Artistry",
      description: "Contemporary design with platinum finish",
      image: "/goldenshell2 - Copy - Copy.webp",
      modelPath: "/golden.glb",
      scale: 1.0,
      position: [0, 0, 0]
    },
    {
      id: "sparkle-heart",
      title: "Sparkle Heart",
      description: "Eternal elegance meets innovative design",
      image: "https://res.cloudinary.com/dteqlumrz/image/upload/v1751708733/sparkleheart2_v2gghe.webp",
      modelPath: "/Sparkle_Heart_Pendant_0704170231_texture.glb",
      scale: 0.8,
      position: [0, 0, 0]
    }
  ];

  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap) {
        setGsapLoaded(true);
        return;
      }

      try {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
        setGsapLoaded(true);
      } catch (error) {
        console.error("Failed to load GSAP:", error);
      }
    };

    loadGSAP();
  }, []);

  useEffect(() => {
    if (gsapLoaded && window.gsap && titleRef.current) {
      window.gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
  }, [gsapLoaded]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Loading overlay */}
      {!gsapLoaded && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading animations...</p>
          </div>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent"
        >
          Premium Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {jewelryData.map((item) => (
            <JewelryCard
              key={item.id}
              item={item}
              isActive={isHovered === item.id}
              onHoverStart={() => setIsHovered(item.id)}
              onHoverEnd={() => setIsHovered(null)}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each piece is meticulously crafted using the finest materials and cutting-edge 3D design technology. 
            Hover over items to see them come to life.
          </p>
        </div>
      </div>
    </div>
  );
};

// Jewelry Card Component
function JewelryCard({ item, isActive, onHoverStart, onHoverEnd }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const animationId = useRef(null);
  const loaderRef = useRef(new GLTFLoader());
  
  // Initialize and clean up Three.js
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const initScene = () => {
      // Setup renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
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
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);
      
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight1.position.set(2, 2, 3);
      scene.add(directionalLight1);
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-2, -1, -2);
      scene.add(directionalLight2);
      
      // Load model
      loaderRef.current.load(
        item.modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(item.scale, item.scale, item.scale);
          model.position.set(...item.position);
          scene.add(model);
          modelRef.current = model;
          
          // Start animation
          animate();
        },
        undefined,
        (error) => {
          console.error(`Error loading model ${item.title}:`, error);
        }
      );
    };
    
    const animate = () => {
      if (!modelRef.current || !sceneRef.current || !cameraRef.current) {
        animationId.current = requestAnimationFrame(animate);
        return;
      }
      
      // Rotate model
      modelRef.current.rotation.y += 0.01;
      
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
        while(sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
          sceneRef.current.remove(child);
        }
      }
    };
  }, [isActive, item]);
  
  return (
    <div
      className={`relative h-80 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? "ring-2 ring-yellow-400 scale-105" : "ring-1 ring-gray-700"
      }`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Default image */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isActive ? "opacity-0" : "opacity-100"
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
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <h3 className="text-lg font-bold text-yellow-300">{item.title}</h3>
        <p className="text-sm text-gray-300">{item.description}</p>
        <div className="mt-2 text-xs text-gray-400">
          {isActive ? "3D Model" : "Hover to view 3D"}
        </div>
      </div>
    </div>
  );
}

export default Details;