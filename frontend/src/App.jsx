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
import Home from "./components/Home";

// Custom hook for device detection
function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    const debouncedResize = debounce(checkDevice, 150);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);
  return { isMobile };
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Enhanced fluid component with smoother, lag-free effect
function EnhancedFluid({ isMobile }) {
  const fluidRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event) => {
    targetRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    // Always interpolate each frame for silky smooth movement
    const lerp = isMobile ? 0.12 : 0.16;
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * lerp;
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * lerp;
  });

  const fluidSettings = useMemo(
    () => ({
      rainbow: true,
      intensity: isMobile ? 7 : 10,
      force: isMobile ? 1.5 : 2.5,
      radius: isMobile ? 0.3 : 0.5,
      resolution: isMobile ? 0.5 : 1.0, // lower res on mobile
      autoAnimate: true,
      mousePosition: mouseRef.current,
    }),
    [isMobile]
  );

  return <Fluid ref={fluidRef} {...fluidSettings} />;
}

// Floating particles
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
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-pulse"
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

const OptimizedStars = React.memo(({ isMobile }) =>
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

// Main App
export default function App() {
  const { isMobile } = useDeviceDetection();

  const canvasSettings = useMemo(
    () => ({
      camera: { position: [0, 0, 5], fov: 75 },
      gl: {
        pixelRatio: isMobile ? 0.8 : 1.5,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      },
      style: {
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      },
    }),
    [isMobile]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Canvas with fluid animation */}
      <Canvas
        className="fixed top-0 left-0 w-full h-full z-0"
        {...canvasSettings}
      >
        <OptimizedStars isMobile={isMobile} />
        <EffectComposer>
          <EnhancedFluid isMobile={isMobile} />
        </EffectComposer>
      </Canvas>
      
      {/* Animated Particles Layer */}
      <AnimatedParticles isMobile={isMobile} />
      
      {/* Home Component Layer */}
      <Home />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .bg-gradient-to-br {
          background: linear-gradient(to bottom right, #000000, #1a1a2e, #4a148c);
        }
      `}</style>
    </div>
  );
}