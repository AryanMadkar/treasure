import React, { useEffect, useRef, useState } from "react";
import silverbat from "/silverbat1.webp";
import cross1 from "/cross1.webp";

const Abouts = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const skillsRef = useRef(null);
  const codeCardRef = useRef(null);
  const imageCardRef = useRef(null);
  const statsRef = useRef(null);
  const approachRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [preloadedModels, setPreloadedModels] = useState({
    cross: null,
    bat: null,
  });
  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap && window.ScrollTrigger) {
        setGsapLoaded(true);
        initAnimations();
        return;
      }

      try {
        if (!window.gsap) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!window.ScrollTrigger) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          setGsapLoaded(true);
          setTimeout(() => {
            initAnimations();
          }, 100);
        }
      } catch (error) {
        console.error("Failed to load GSAP:", error);
      }
    };

    loadGSAP();

    return () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  useEffect(() => {
    const preloadModels = async () => {
      if (!gsapLoaded) return;

      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );

        const loader = new GLTFLoader();
        const loadedModels = {};

        // Preload both models
        const crossPromise = new Promise((resolve, reject) => {
          loader.load("/crossshade.glb", resolve, undefined, reject);
        });

        const batPromise = new Promise((resolve, reject) => {
          loader.load("/base_basic_shaded.glb", resolve, undefined, reject);
        });

        // Wait for both models to load
        const [crossGltf, batGltf] = await Promise.all([
          crossPromise,
          batPromise,
        ]);

        loadedModels.cross = crossGltf.scene.clone();
        loadedModels.bat = batGltf.scene.clone();

        setPreloadedModels(loadedModels);
        setModelsLoaded(true);

        console.log("3D models preloaded successfully");
      } catch (error) {
        console.error("Failed to preload 3D models:", error);
      }
    };

    preloadModels();
  }, [gsapLoaded]);

  const initAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger || !containerRef.current) {
      console.warn("GSAP not loaded or container not available");
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    ScrollTrigger.refresh();

    const elementsToAnimate = [
      { ref: titleRef, props: { opacity: 0, y: 100 } },
      { ref: descriptionRef, props: { opacity: 0, y: 100 } },
      { ref: codeCardRef, props: { opacity: 0, rotateY: -45, scale: 0.8 } },
      { ref: imageCardRef, props: { opacity: 0, x: 100, scale: 0.9 } },
      { ref: approachRef, props: { opacity: 0, y: 50 } },
    ];

    elementsToAnimate.forEach(({ ref, props }) => {
      if (ref.current) {
        gsap.set(ref.current, props);
      }
    });

    if (skillsRef.current?.children) {
      gsap.set(skillsRef.current.children, {
        opacity: 0,
        y: 50,
        scale: 0.8,
      });
    }

    if (statsRef.current?.children) {
      gsap.set(statsRef.current.children, {
        opacity: 0,
        scale: 0.5,
      });
    }

    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    if (titleRef.current) {
      mainTl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }

    if (descriptionRef.current) {
      mainTl.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );
    }

    if (skillsRef.current?.children) {
      mainTl.to(
        skillsRef.current.children,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1,
        },
        "-=0.5"
      );
    }

    if (codeCardRef.current) {
      mainTl.to(
        codeCardRef.current,
        {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }

    if (imageCardRef.current) {
      mainTl.to(
        imageCardRef.current,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );
    }

    if (statsRef.current?.children) {
      mainTl.to(
        statsRef.current.children,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.1,
        },
        "-=0.3"
      );
    }

    if (approachRef.current) {
      mainTl.to(
        approachRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }
  };

  const handleCardHover = (cardRef, isEntering) => {
    if (!window.gsap || !cardRef.current) return;

    const gsap = window.gsap;
    const cardContent = cardRef.current.querySelector(".card-content");
    const hoverGlow = cardRef.current.querySelector(".hover-glow");

    if (isEntering) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        duration: 0.3,
        ease: "power2.out",
      });

      if (cardContent) {
        gsap.to(cardContent, {
          y: -10,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (hoverGlow) {
        gsap.to(hoverGlow, {
          opacity: 1,
          duration: 0.3,
        });
      }
    } else {
      gsap.to(cardRef.current, {
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      if (cardContent) {
        gsap.to(cardContent, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (hoverGlow) {
        gsap.to(hoverGlow, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  const handleImageHover = (isEntering) => {
    if (!window.gsap || !imageCardRef.current) return;

    const gsap = window.gsap;
    const imageContent = imageCardRef.current.querySelector(".image-content");
    const overlayText = imageCardRef.current.querySelector(".overlay-text");
    const parallaxElements =
      imageCardRef.current.querySelector(".parallax-elements");

    if (isEntering) {
      if (imageContent) {
        gsap.to(imageContent, {
          scale: 1.1,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (overlayText) {
        gsap.to(overlayText, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (parallaxElements) {
        gsap.to(parallaxElements, {
          x: 10,
          y: -10,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    } else {
      if (imageContent) {
        gsap.to(imageContent, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (overlayText) {
        gsap.to(overlayText, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (parallaxElements) {
        gsap.to(parallaxElements, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }
  };

  const handleSkillHover = (skillRef, isEntering) => {
    if (!window.gsap || !skillRef) return;

    const gsap = window.gsap;
    const skillGlow = skillRef.querySelector(".skill-glow");

    if (isEntering) {
      gsap.to(skillRef, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });

      if (skillGlow) {
        gsap.to(skillGlow, {
          opacity: 1,
          duration: 0.3,
        });
      }
    } else {
      gsap.to(skillRef, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      if (skillGlow) {
        gsap.to(skillGlow, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen text-white overflow-hidden">
      {!gsapLoaded && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading animations...</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
              >
                What I Do
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </div>

            <p
              ref={descriptionRef}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed"
            >
              I create memorable websites with smooth animations and interactive
              experiences.
            </p>

            <div className="mt-8 sm:mt-12">
              <h3 className="text-sm font-semibold text-purple-400 mb-3 sm:mb-4 tracking-wider uppercase">
                3D Card Hover Effect
              </h3>
              <div className="perspective-1000">
                <ThreeDCrossCard
                  codeCardRef={codeCardRef}
                  handleCardHover={handleCardHover}
                  modelsLoaded={modelsLoaded}
                  preloadedModels={preloadedModels}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 mt-8 sm:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-3 sm:mb-4 tracking-wider uppercase">
                Image Hover 3D Effect
              </h3>
              <ThreeDImageCard
                imageCardRef={imageCardRef}
                handleImageHover={handleImageHover}
                modelsLoaded={modelsLoaded}
                preloadedModels={preloadedModels}
              />
            </div>

            <div
              ref={approachRef}
              className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-800"
            >
              <h3 className="text-lg font-semibold text-white mb-2 sm:mb-3">
                My Approach
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                I focus on creating immersive digital experiences that combine
                beautiful design with smooth performance. Every interaction is
                crafted to feel natural and engaging.
              </p>
            </div>

            <div ref={statsRef} className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  50+
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  3+
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Years</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                  99%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New 3D Cross Card Component
function ThreeDCrossCard({ codeCardRef, handleCardHover, modelsLoaded, preloadedModels }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef(null);
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    model: null,
    animationId: null,
  });

  const cleanupThree = () => {
    const { renderer, scene, animationId } = threeRef.current;
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) renderer.dispose();
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    }
    threeRef.current = {
      renderer: null,
      scene: null,
      camera: null,
      model: null,
      animationId: null,
    };
  };

  useEffect(() => {
    if (hovered) {
      let cancelled = false;

      const initThree = async () => {
        try {
          const THREE = await import("three");
          const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );

          if (cancelled) return;

          // Initialize renderer
          const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
          });
          renderer.setSize(
            canvasRef.current.clientWidth,
            canvasRef.current.clientHeight
          );
          renderer.setClearColor(0x000000, 0);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(
            45,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            100
          );
          camera.position.set(0, 1, 3);

          // Enhanced lighting
          const ambient = new THREE.AmbientLight(0xffffff, 1.2);
          scene.add(ambient);
          const dir = new THREE.DirectionalLight(0xffffff, 0.8);
          dir.position.set(2, 5, 5);
          scene.add(dir);

          const pointLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
          pointLight.position.set(-10, 0, 10);
          scene.add(pointLight);

          const pointLight2 = new THREE.PointLight(0x3b82f6, 0.8, 100);
          pointLight2.position.set(10, 0, 10);
          scene.add(pointLight2);

          // Load Cross GLB model
          const loader = new GLTFLoader();
          loader.load(
            "/crossshade.glb", // Your cross model path
            (gltf) => {
              if (cancelled) return;
              const model = gltf.scene;
              model.scale.set(1.5, 1.5, 1.5);
              scene.add(model);
              threeRef.current.model = model;

              // Animate
              const animate = () => {
                if (cancelled) return;
                if (model) {
                  model.rotation.y += 0.01; // Only rotate horizontally (Y axis)
                  // model.rotation.x = 0; // Optionally lock X rotation
                }
                renderer.render(scene, camera);
                threeRef.current.animationId = requestAnimationFrame(animate);
              };
              animate();
            },
            undefined,
            (err) => {
              console.error("Failed to load 3D cross model", err);
            }
          );

          // Store references
          threeRef.current = {
            renderer,
            scene,
            camera,
            model: threeRef.current.model,
            animationId: threeRef.current.animationId,
          };
        } catch (error) {
          console.error("Error loading three.js:", error);
        }
      };

      initThree();

      return () => {
        cancelled = true;
        cleanupThree();
      };
    }
  }, [hovered]);

  useEffect(() => {
    return () => cleanupThree();
  }, []);

  return (
    <div
      ref={codeCardRef}
      className="relative w-full max-w-md h-64 sm:h-72 bg-transparent rounded-2xl border-0 overflow-hidden cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
      onMouseEnter={() => {
        setHovered(true);
        handleCardHover && handleCardHover(codeCardRef, true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        handleCardHover && handleCardHover(codeCardRef, false);
      }}
    >
      <div className="hover-glow absolute inset-0 bg-transparent opacity-0 transition-opacity duration-300"></div>

      {/* Default cross1 image (shown when not hovered) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={cross1}
          alt="Cross1"
          className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl transition-transform duration-300"
        />
      </div>

      {/* 3D Cross Canvas (shown when hovered) */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block", borderRadius: "1rem" }}
        />
      </div>

      {/* Overlay text */}
      <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
        {hovered ? "3D Cross Model" : "Hover to View 3D Cross"}
      </div>
    </div>
  );
}

function ThreeDImageCard({ imageCardRef, handleImageHover }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef(null);
  const threeRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    model: null,
    animationId: null,
  });

  const cleanupThree = () => {
    const { renderer, scene, animationId } = threeRef.current;
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) renderer.dispose();
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    }
    threeRef.current = {
      renderer: null,
      scene: null,
      camera: null,
      model: null,
      animationId: null,
    };
  };

  useEffect(() => {
    if (hovered) {
      let cancelled = false;

      const initThree = async () => {
        try {
          const THREE = await import("three");
          const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
          );

          if (cancelled) return;

          // Initialize renderer
          const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
          });
          renderer.setSize(
            canvasRef.current.clientWidth,
            canvasRef.current.clientHeight
          );

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(
            45,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            100
          );
          camera.position.set(0, 1, 3);

          // Lighting
          const ambient = new THREE.AmbientLight(0xffffff, 1.2);
          scene.add(ambient);
          const dir = new THREE.DirectionalLight(0xffffff, 0.8);
          dir.position.set(2, 5, 5);
          scene.add(dir);

          // Load GLB model - Use public path directly
          const loader = new GLTFLoader();
          loader.load(
            "/base_basic_shaded.glb", // Direct path to public folder
            (gltf) => {
              if (cancelled) return;
              const model = gltf.scene;
              model.scale.set(1.2, 1.2, 1.2);
              scene.add(model);
              threeRef.current.model = model;

              // Animate
              const animate = () => {
                if (cancelled) return;
                if (model) model.rotation.y += 0.01;
                renderer.render(scene, camera);
                threeRef.current.animationId = requestAnimationFrame(animate);
              };
              animate();
            },
            undefined,
            (err) => {
              console.error("Failed to load 3D model", err);
            }
          );

          // Store references
          threeRef.current = {
            renderer,
            scene,
            camera,
            model: threeRef.current.model,
            animationId: threeRef.current.animationId,
          };
        } catch (error) {
          console.error("Error loading three.js:", error);
        }
      };

      initThree();

      return () => {
        cancelled = true;
        cleanupThree();
      };
    }
  }, [hovered]);

  useEffect(() => {
    return () => cleanupThree();
  }, []);

  return (
    <div
      ref={imageCardRef}
      className="relative w-full h-80 sm:h-96 bg-transparent rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
      onMouseEnter={() => {
        setHovered(true);
        handleImageHover && handleImageHover(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        handleImageHover && handleImageHover(false);
      }}
      style={{ minHeight: 320 }}
    >
      {/* Default image (shown when not hovered) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-full h-full relative">
          <img
            src={silverbat}
            alt="Silver Bat"
            className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl transition-transform duration-300"
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        </div>
      </div>

      {/* 3D Model Canvas (shown when hovered) */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block", borderRadius: "1rem" }}
        />
      </div>

      {/* Overlay text */}
      <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
        {hovered ? "3D Model Loaded" : "Hover to View 3D Model"}
      </div>
    </div>
  );
}

export default Abouts;
