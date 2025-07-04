import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGrid } from 'react-icons/fi';
import heroImage from '/homebg.png';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Home1() {
  const container = useRef(null);
  const title = useRef(null);
  const subtitle = useRef(null);
  const image = useRef(null);
  const cta = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text entrance
      gsap.from([title.current, subtitle.current], {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Image slide-in
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

      // Button bounce
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
    <section
        ref={container}
        className="relative w-full h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden flex items-center justify-center p-6"
    >
        {/* Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-12 grid-rows-6 mix-blend-overlay opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={`col-${i}`} className="border-l border-gray-700" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={`row-${i}`} className="border-t border-gray-700 col-span-12 row-start-1 row-end-7" />
            ))}
        </div>

        {/* Glass Card */}
        <div className="relative backdrop-blur-lg bg-white bg-opacity-5 rounded-2xl shadow-xl max-w-6xl w-full flex flex-col lg:flex-row p-8 lg:p-16">
            {/* Text */}
            <div className="flex-1 text-white flex flex-col justify-center space-y-6 lg:pr-12">
                <h2 ref={title} className="text-4xl lg:text-6xl font-light">
                    THE
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 font-bold">
                        spicegirlscharm
                    </span>
                </h2>
                <p ref={subtitle} className="text-base lg:text-lg leading-relaxed text-gray-200">
                    The Essence of Ornamentation is rooted in timeless beauty, blending craftsmanship with contemporary design. Each piece is a reflection of elegance, curated to complement every moment. The finer the detail, the deeper the impression.
                </p>
                <button
                    ref={cta}
                    className="self-start bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition"
                >
                    See More
                </button>
            </div>

            {/* Image */}
            <div ref={image} className="flex-1 mt-8 lg:mt-0 flex items-center justify-center">
                <img
                    src={heroImage}
                    alt="Spice Girl Jewelry"
                    className="h-80 lg:h-[28rem] object-cover rounded-xl shadow-2xl"
                    style={{ transform: 'scaleX(-1)' }}
                />
            </div>
        </div>
    </section>
);
}
