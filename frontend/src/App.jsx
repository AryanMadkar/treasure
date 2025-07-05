import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

import Home from "./pages/Home"; // Import your Home page
import Collections from "./pages/Collections"; // Import your Collections page
// Import your pages here (uncomment when ready)
// import Home from "./pages/Home";
// import Abouts from "./pages/Abouts";
// import Details from "./pages/Details";
// import Collections from "./pages/Collections";
import Loader from "./components/Loader"; // Import the Loader component
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Custom hook for device detection
function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    const onResize = debounce(check, 150);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { isMobile };
}

// Enhanced fluid component
function EnhancedFluid({ isMobile }) {
  const fluidRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e) => {
    target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  useFrame(() => {
    const lerpVal = isMobile ? 0.12 : 0.16;
    mouse.current.x += (target.current.x - mouse.current.x) * lerpVal;
    mouse.current.y += (target.current.y - mouse.current.y) * lerpVal;
  });

  const settings = useMemo(
    () => ({
      rainbow: true,
      intensity: isMobile ? 7 : 10,
      force: isMobile ? 1.5 : 2.5,
      radius: isMobile ? 0.3 : 0.5,
      resolution: isMobile ? 0.5 : 1.0,
      autoAnimate: true,
      mousePosition: mouse.current,
    }),
    [isMobile]
  );

  return <Fluid ref={fluidRef} {...settings} />;
}

// Floating particles layer
function AnimatedParticles({ isMobile }) {
  const particles = useMemo(() => {
    const count = isMobile ? 20 : 50;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (isMobile ? 3 : 4) + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: ["#ff3d81", "#3d9eff", "#00ff95"][Math.floor(Math.random() * 3)],
      speed: Math.random() * 0.3 + 0.1,
    }));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            animation: `float ${10 + p.speed * 10}s ease-in-out infinite`,
            animationDelay: `${p.id * 0.1}s`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

const StarsLayer = React.memo(({ isMobile }) =>
  isMobile ? null : (
    <Stars
      radius={100}
      depth={50}
      count={1500}
      factor={4}
      fade
      saturation={0}
      speed={0.3}
    />
  )
);

export default function App() {
  const { isMobile } = useDeviceDetection();
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const canvasProps = useMemo(
    () => ({
      camera: { position: [0, 0, 5], fov: 75 },
      gl: {
        pixelRatio: isMobile ? 0.8 : 1.5,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      },
      style: { position: "fixed", inset: 0, zIndex: 0 },
    }),
    [isMobile]
  );

  return (
    <div className="relative w-[98vw] h-screen">
      {/* Show loader while loading */}
      {isLoading && <Loader onLoadComplete={handleLoadComplete} />}
      
      {/* Main app content - hidden while loading */}
      <div 
        className={`transition-opacity duration-1000 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Canvas {...canvasProps}>
          <StarsLayer isMobile={isMobile} />
          <EffectComposer>
            <EnhancedFluid isMobile={isMobile} />
          </EffectComposer>
        </Canvas>

        <AnimatedParticles isMobile={isMobile} />

        <div className="relative z-20">
          {/* Uncomment and replace with your router setup */}
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/abouts" element={<Abouts />} />
              <Route path="/details" element={<Details />} /> */}
              <Route path="/collection" element={<Collections />} />
            </Routes>
          </BrowserRouter>
         
          
          {/* Temporary content - remove when you add router */}
          <div className="text-white text-center pt-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Epic App</h1>
            <p className="text-lg opacity-80">Retro TV loading complete! 🔥</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}