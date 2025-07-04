import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '/homebg.png'; // your image path

// register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const title     = useRef(null);
  const subtitle  = useRef(null);
  const image     = useRef(null);
  const cta       = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([title.current, subtitle.current], {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from(image.current, {
        x: 200,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top center',
        }
      });

      gsap.from(cta.current, {
        scale: 0,
        duration: 0.5,
        delay: 1.2,
        ease: 'bounce.out'
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={container}
      className="
        relative w-full h-screen
        flex items-center justify-center p-6
        z-10
      "
      style={{ pointerEvents: 'none' }}
    >
      {/* grid lines (purely decorative) */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 mix-blend-overlay opacity-10 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`col-${i}`} className="border-l border-gray-700" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`row-${i}`}
            className="border-t border-gray-700 col-span-12 row-start-1 row-end-7"
          />
        ))}
      </div>

      {/* glass card */}
      <div 
        className="
          relative backdrop-blur-lg bg-white bg-opacity-5
          rounded-2xl shadow-xl max-w-6xl w-full
          flex flex-col lg:flex-row p-8 lg:p-16
        "
        style={{ pointerEvents: 'auto' }}
      >
        {/* text block */}
        <div className="flex-1 text-white flex flex-col justify-center space-y-6 lg:pr-12">
          <h2 ref={title} className="text-4xl lg:text-6xl font-light leading-tight">
            THE
            <span className="
              block bg-clip-text text-transparent
              bg-gradient-to-r from-pink-500 to-purple-500
              font-bold
            ">
              spicegirlscharm
            </span>
          </h2>

          <p
            ref={subtitle}
            className="text-base lg:text-lg text-gray-200 leading-relaxed"
          >
            The Essence of Ornamentation is rooted in timeless beauty, blending craftsmanship with contemporary design. Each piece is a reflection of elegance, curated to complement every moment. The finer the detail, the deeper the impression.
          </p>

          <button
            ref={cta}
            className="
              bg-gradient-to-r from-purple-600 to-pink-500
              px-6 py-3 rounded-full font-semibold shadow-lg
              transform hover:scale-105 transition
              w-fit
            "
          >
            See More
          </button>
        </div>

        {/* image */}
        <div
          ref={image}
          className="flex-1 mt-8 lg:mt-0 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <img
            src={heroImage}
            alt="Spice Girl Jewelry"
            className="h-80 lg:h-[28rem] object-cover rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}