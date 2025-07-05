import React, { useEffect, useState, useRef } from 'react';

const Loader = ({ onLoadComplete }) => {
  const [phase, setPhase] = useState('startup'); // startup, video1, transition, video2, shutdown, complete
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [scanlines, setScanlines] = useState(true);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [tvPower, setTvPower] = useState(false);
  const [staticNoise, setStaticNoise] = useState(true);
  
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    const timeline = async () => {
      setTimeout(() => {
        setTvPower(true);
        setStaticNoise(false);
        setGlitchIntensity(0.8);
      }, 200);

      setTimeout(() => {
        setPhase('video1');
        setGlitchIntensity(0.3);
        video1Ref.current?.play();
      }, 500);

      setTimeout(() => {
        setPhase('transition');
        setGlitchIntensity(1);
      }, 2500);

      setTimeout(() => {
        setPhase('video2');
        setGlitchIntensity(0.2);
        video2Ref.current?.play();
      }, 3000);

      setTimeout(() => setCameraZoom(1.2), 4000);

      setTimeout(() => {
        setPhase('shutdown');
        setGlitchIntensity(0.9);
        setScanlines(false);
      }, 4500);

      setTimeout(() => {
        setTvPower(false);
        setStaticNoise(true);
      }, 4800);

      setTimeout(() => {
        setPhase('complete');
        onLoadComplete();
      }, 5000);
    };

    timeline();
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {staticNoise && (
        <div
          className="absolute inset-0 opacity-40 animate-staticNoise"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${phase === 'complete' ? 'opacity-0' : 'opacity-100'}`}
        style={{ transform: `scale(${cameraZoom})`, transition: 'transform 0.5s ease-out' }}
      >
        <div
          className={`relative bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border-4 border-gray-700 w-11/12 max-w-3xl aspect-video ${tvPower ? 'shadow-blue-500/20' : 'shadow-black/50'}`}
          style={{
            background: 'linear-gradient(145deg, #2d3748, #1a202c)',
            boxShadow: tvPower
              ? '0 0 50px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(0,0,0,0.5)'
              : '0 0 20px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden" style={{ filter: tvPower ? 'brightness(1)' : 'brightness(0.1)', border: '3px solid #374151' }}>
            <div className="absolute inset-0">
              {(phase === 'video1' || phase === 'transition') && (
                <video
                  ref={video1Ref}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${phase === 'video1' ? 'opacity-100' : 'opacity-0'}`}
                  muted playsInline
                  style={{ filter: `contrast(1.2) saturate(1.1) ${glitchIntensity > 0.5 ? 'hue-rotate(90deg)' : ''}` }}
                >
                  <source src="/fantasy1.mp4" type="video/mp4" />
                </video>
              )}

              {(phase === 'video2' || phase === 'shutdown') && (
                <video
                  ref={video2Ref}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${phase === 'video2' ? 'opacity-100' : 'opacity-60'}`}
                  muted playsInline
                  style={{ filter: `contrast(1.3) saturate(1.2) ${phase === 'shutdown' ? 'brightness(0.3)' : ''}` }}
                >
                  <source src="/cynamatic1.mp4" type="video/mp4" />
                </video>
              )}

              {phase === 'startup' && <div className="absolute inset-0 bg-white animate-startupFlash" />} 
            </div>

            {glitchIntensity > 0 && <div className="absolute inset-0 pointer-events-none mix-blend-screen animate-glitchOverlay" style={{ backgroundSize: '200% 200%' }} />} 
            {glitchIntensity > 0.5 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute bg-white opacity-20 animate-digitalNoise" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: `${Math.random()*20 + 5}px`, height: `${Math.random()*5 + 1}px` }} />
                ))}
              </div>
            )}
            {scanlines && tvPower && <div className="absolute inset-0 pointer-events-none opacity-30 animate-scanlines" />}
            {phase === 'shutdown' && <div className="absolute inset-0 bg-white animate-tvShutdown" style={{ background: 'radial-gradient(circle, transparent 0%, black 100%)' }} />}

            <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full ${tvPower ? 'bg-green-400 shadow-green-400/50' : 'bg-red-600'}`} />
          </div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm font-mono">RETRO-VISION</div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center px-4 w-11/12 max-w-md">
        <div className="mb-2">
          <div className="w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 animate-progressBar" />
          </div>
        </div>
        <p className="text-gray-400 text-sm font-mono tracking-wider">
          {phase === 'startup' && 'INITIALIZING...'}{phase === 'video1' && 'LOADING SEQUENCE A...'}{phase === 'transition' && 'SWITCHING FEED...'}{phase === 'video2' && 'LOADING SEQUENCE B...'}{phase === 'shutdown' && 'POWERING DOWN...'}{phase === 'complete' && 'READY'}
        </p>
      </div>

      <style jsx>{`
        @keyframes startupFlash { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0; transform: scale(1); } }
        @keyframes glitchOverlay { 0%,100% { opacity: 0.2; background-position: 0 0; } 50% { opacity: 0.6; background-position: 100% 100%; } }
        @keyframes digitalNoise { 0% { opacity: 0.2; } 50% { opacity: 0.8; } 100% { opacity: 0.2; } }
        @keyframes scanlines { 0% { background-position: 0 0; } 100% { background-position: 0 4px; } }
        @keyframes tvShutdown { 0% { transform: scale(1); opacity: 0; } 50% { transform: scale(1,0.1); opacity: 1; } 100% { transform: scale(0,0.1); opacity: 1; } }
        @keyframes staticNoise { to { opacity: 0.6; } }
        @keyframes progressBar { to { width: 100%; } }
      `}</style>
    </div>
  );
};

export default Loader;
