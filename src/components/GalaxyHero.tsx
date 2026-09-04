import React, { useEffect, useRef, useState } from "react";

/**
 * GalaxyHero — wraps the procedural WebGL Milky Way as an interactive hero.
 *
 * The iframe (and all ~79MB of galaxy assets) is only loaded once the user
 * scrolls close to this section (lazy), so the main site stays light and the
 * heavy 3D scene never runs in the background of the whole page.
 */
export default function GalaxyHero({
  className = "",
  height = "80vh",
}: {
  className?: string;
  height?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [active, setActive] = useState(true);
  const { BASE_URL } = import.meta.env;

  // Load the galaxy only when this section enters the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={sectionRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {shouldLoad ? (
        <iframe
          src={`${BASE_URL}galaxy/index.html`}
          title="OrbitX Interactive Galaxy"
          className="absolute inset-0 w-full h-full border-0"
          loading="eager"
          allow="autoplay; fullscreen"
          onLoad={() => {}}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#03040a]">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">
              Initializing star charts…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
