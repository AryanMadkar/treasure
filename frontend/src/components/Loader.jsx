import React, { useEffect, useState, useRef, useCallback } from 'react';

const Loader = ({ onLoadComplete }) => {
  const [phase, setPhase] = useState('preload'); // preload, startup, video1, transition, video2, shutdown, complete
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [scanlines, setScanlines] = useState(true);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [tvPower, setTvPower] = useState(false);
  const [staticNoise, setStaticNoise] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const timelineRef = useRef(null);

  // Video URLs
  const videoUrls = [
    "https://res.cloudinary.com/dteqlumrz/video/upload/v1751708583/fantasy1_c79h0u.mp4",
    "https://res.cloudinary.com/dteqlumrz/video/upload/v1751708569/cynamatic1_xm1gup.mp4"
  ];

  // Preload videos
  const preloadVideo = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      
      const onCanPlay = () => {
        video.removeEventListener('canplaythrough', onCanPlay);
        video.removeEventListener('error', onError);
        resolve(video);
      };
      
      const onError = () => {
        video.removeEventListener('canplaythrough', onCanPlay);
        video.removeEventListener('error', onError);
        reject(new Error(`Failed to load video: ${url}`));
      };
      
      video.addEventListener('canplaythrough', onCanPlay);
      video.addEventListener('error', onError);
      video.src = url;
      video.load();
    });
  });

  // Preload all videos
  useEffect(() => {
    let mounted = true;
    
    const loadVideos = async () => {
      try {
        const promises = videoUrls.map(url => preloadVideo(url));
        
        // Track progress
        let completed = 0;
        promises.forEach(promise => {
          promise.then(() => {
            if (mounted) {
              completed++;
              setVideosLoaded(completed);
              setLoadingProgress((completed / videoUrls.length) * 100);
            }
          });
        });
        
        await Promise.all(promises);
        
        if (mounted) {
          // Start the main timeline after videos are loaded
          setTimeout(() => {
            startTimeline();
          }, 500);
        }
      } catch (error) {
        console.error('Error preloading videos:', error);
        if (mounted) {
          // Continue anyway after a delay
          setTimeout(() => {
            startTimeline();
          }, 1000);
        }
      }
    };
    
    loadVideos();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Main timeline
  const startTimeline = useCallback(() => {
    let startTime = Date.now();
    
    const timeline = () => {
      // TV Startup sequence (0.5s)
      setTimeout(() => {
        setPhase('startup');
        setTvPower(true);
        setStaticNoise(false);
        setGlitchIntensity(0.8);
      }, 200);

      // First video starts (0.5s - 2.5s)
      setTimeout(() => {
        setPhase('video1');
        setGlitchIntensity(0.3);
        if (video1Ref.current) {
          video1Ref.current.currentTime = 0;
          video1Ref.current.play().catch(console.error);
        }
      }, 500);

      // Glitch transition to second video (2.5s - 3s)
      setTimeout(() => {
        setGlitchIntensity(1);
        setPhase('transition');
      }, 2500);

      // Second video starts (3s - 4.5s)
      setTimeout(() => {
        setPhase('video2');
        setGlitchIntensity(0.2);
        if (video2Ref.current) {
          video2Ref.current.currentTime = 0;
          video2Ref.current.play().catch(console.error);
        }
      }, 3000);

      // Camera pan in effect (4s - 4.5s)
      setTimeout(() => {
        setCameraZoom(1.2);
      }, 4000);

      // TV shutdown sequence (4.5s - 5s)
      setTimeout(() => {
        setPhase('shutdown');
        setGlitchIntensity(0.9);
        setScanlines(false);
      }, 4500);

      // Complete shutdown
      setTimeout(() => {
        setTvPower(false);
        setStaticNoise(true);
      }, 4800);

      // Fade out and complete
      setTimeout(() => {
        setPhase('complete');
        onLoadComplete?.();
      }, 5000);
    };

    timeline();
    
    // Progress timer
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 5000) * 100, 100);
      setCurrentTime(elapsed);
      
      if (elapsed >= 5000) {
        clearInterval(progressTimer);
      }
    }, 50);

    timelineRef.current = progressTimer;
  }, [onLoadComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        clearInterval(timelineRef.current);
      }
    };
  }, []);

  // Generate random glitch values
  const glitchStyle = {
    background: `linear-gradient(90deg, 
      transparent ${Math.random() * 100}%, 
      rgba(255,0,255,${glitchIntensity * 0.3}) ${Math.random() * 100}%, 
      transparent ${Math.random() * 100}%,
      rgba(0,255,255,${glitchIntensity * 0.2}) ${Math.random() * 100}%,
      transparent ${Math.random() * 100}%)`,
    animation: `glitch ${0.1 + Math.random() * 0.1}s infinite`,
    mixBlendMode: 'screen'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Static noise background */}
      {staticNoise && (
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            animation: 'staticNoise 0.1s infinite'
          }}
        />
      )}

      {/* Old TV Container */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          phase === 'complete' ? 'opacity-0 scale-95' : 'opacity-100'
        }`}
        style={{
          transform: `scale(${cameraZoom})`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        {/* TV Bezel */}
        <div 
          className={`relative rounded-3xl p-8 shadow-2xl border-4 border-gray-700 transition-all duration-300 ${
            tvPower ? 'shadow-blue-500/20' : 'shadow-black/50'
          }`}
          style={{
            width: '80vw',
            height: '60vh',
            maxWidth: '800px',
            maxHeight: '600px',
            background: 'linear-gradient(145deg, #2d3748, #1a202c)',
            boxShadow: tvPower 
              ? '0 0 50px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(0,0,0,0.5)'
              : '0 0 20px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          {/* TV Screen */}
          <div 
            className="relative w-full h-full bg-black rounded-2xl overflow-hidden"
            style={{
              border: '3px solid #374151',
              filter: tvPower ? 'brightness(1)' : 'brightness(0.1)'
            }}
          >
            {/* Screen content */}
            <div className="absolute inset-0">
              {/* Video 1 */}
              {(phase === 'video1' || phase === 'transition') && (
                <video
                  ref={video1Ref}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    phase === 'video1' ? 'opacity-100' : 'opacity-0'
                  }`}
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    filter: `contrast(1.2) saturate(1.1) ${glitchIntensity > 0.5 ? 'hue-rotate(90deg)' : ''}`
                  }}
                >
                  <source src={videoUrls[0]} type="video/mp4" />
                </video>
              )}

              {/* Video 2 */}
              {(phase === 'video2' || phase === 'shutdown') && (
                <video
                  ref={video2Ref}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    phase === 'video2' ? 'opacity-100' : 'opacity-60'
                  }`}
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    filter: `contrast(1.3) saturate(1.2) ${phase === 'shutdown' ? 'brightness(0.3)' : ''}`
                  }}
                >
                  <source src={videoUrls[1]} type="video/mp4" />
                </video>
              )}

              {/* Startup flash */}
              {phase === 'startup' && (
                <div 
                  className="absolute inset-0 bg-white" 
                  style={{ 
                    animation: 'startupFlash 0.5s ease-out' 
                  }} 
                />
              )}

              {/* Preload indicator */}
              {phase === 'preload' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-400 font-mono text-sm">
                      LOADING MEDIA... {Math.round(loadingProgress)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Glitch overlay */}
            {glitchIntensity > 0 && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={glitchStyle}
              />
            )}

            {/* Digital noise bars */}
            {glitchIntensity > 0.5 && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white opacity-20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${Math.random() * 20 + 5}px`,
                      height: `${Math.random() * 5 + 1}px`,
                      animation: `digitalNoise ${Math.random() * 0.2 + 0.1}s infinite`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Scanlines */}
            {scanlines && tvPower && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.1) 2px,
                    rgba(255,255,255,0.1) 4px
                  )`,
                  animation: 'scanlines 0.1s linear infinite'
                }}
              />
            )}

            {/* TV shutdown effect */}
            {phase === 'shutdown' && (
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle, transparent 0%, black 100%)',
                  animation: 'tvShutdown 0.5s ease-in forwards'
                }}
              />
            )}

            {/* Power indicator */}
            <div 
              className={`absolute bottom-4 right-4 w-3 h-3 rounded-full transition-all duration-300 ${
                tvPower ? 'bg-green-400' : 'bg-red-600'
              }`}
              style={{
                boxShadow: tvPower ? '0 0 10px rgba(74, 222, 128, 0.8)' : 'none'
              }}
            />
          </div>

          {/* TV Brand */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm font-mono">
            RETRO-VISION
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="mb-2">
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
              style={{
                width: phase === 'preload' 
                  ? `${loadingProgress}%` 
                  : `${Math.min((currentTime / 5000) * 100, 100)}%`
              }}
            />
          </div>
        </div>
        <p className="text-gray-400 text-sm font-mono tracking-wider">
          {phase === 'preload' && `PRELOADING MEDIA... ${videosLoaded}/${videoUrls.length}`}
          {phase === 'startup' && 'INITIALIZING...'}
          {phase === 'video1' && 'LOADING SEQUENCE A...'}
          {phase === 'transition' && 'SWITCHING FEED...'}
          {phase === 'video2' && 'LOADING SEQUENCE B...'}
          {phase === 'shutdown' && 'POWERING DOWN...'}
          {phase === 'complete' && 'READY'}
        </p>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes startupFlash {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1); }
        }
        
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes digitalNoise {
          0% { opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        @keyframes tvShutdown {
          0% { 
            transform: scale(1, 1);
            opacity: 0;
          }
          50% { 
            transform: scale(1, 0.1);
            opacity: 1;
          }
          100% { 
            transform: scale(0, 0.1);
            opacity: 1;
          }
        }
        
        @keyframes staticNoise {
          0% { opacity: 0.4; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Loader;