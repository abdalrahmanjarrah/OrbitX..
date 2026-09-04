import React, { useEffect, useRef, useState } from "react";

/**
 * GalaxyHero — wraps the procedural WebGL Milky Way as an interactive hero.
 *
 * The iframe (and all ~79MB of galaxy assets) is only loaded once the user
 * scrolls close to this section (lazy), so the main site stays light and the
 * heavy 3D scene never runs in the background of the whole page.
 *
 * If WebGL is unavailable in the visitor's browser (which would make the 3D
 * canvas render as a plain black box), we fall back to a lightweight CSS-only
 * animated galaxy so the hero always looks alive instead of empty.
 */

function webglSupported(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") ||
        c.getContext("experimental-webgl") ||
        c.getContext("webgl2"))
    );
  } catch {
    return false;
  }
}

export default function GalaxyHero({
  className = "",
  height = "80vh",
}: {
  className?: string;
  height?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const { BASE_URL } = import.meta.env;

  // Check WebGL support once on mount.
  useEffect(() => {
    setWebglOk(webglSupported());
  }, []);

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

  const galaxyReady = shouldLoad && webglOk !== false && !iframeFailed;

  return (
    <div
      ref={sectionRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ height }}
    >
      {galaxyReady ? (
        <iframe
          src={`${BASE_URL}galaxy/index.html`}
          title="OrbitX Interactive Galaxy"
          className="absolute inset-0 w-full h-full border-0"
          loading="eager"
          allow="autoplay; fullscreen"
          onError={() => setIframeFailed(true)}
        />
      ) : webglOk === false || iframeFailed ? (
        <CSSGalaxyFallback />
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

/**
 * Lightweight CSS-only animated galaxy — shown only when WebGL is missing.
 * Pure gradients + transforms, no heavy filters, safe for any device.
 */
function CSSGalaxyFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#03040a]">
      <style>{`
        .ghf-dust { position: absolute; inset: -10%; background-image:
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.8) 0 1px, transparent 1.5px),
            radial-gradient(circle at 60% 20%, rgba(199,210,254,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 80% 70%, rgba(167,139,250,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,0.6) 0 1px, transparent 1.5px),
            radial-gradient(circle at 15% 65%, rgba(255,255,255,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle at 70% 45%, rgba(207,230,255,0.6) 0 1px, transparent 1.5px),
            radial-gradient(circle at 90% 15%, rgba(255,207,138,0.6) 0 1px, transparent 1.5px),
            radial-gradient(circle at 5% 25%, rgba(255,255,255,0.5) 0 1px, transparent 1.5px);
          background-size: 220px 220px;
          animation: ghf-drift 90s linear infinite; }
        .ghf-arm { position: absolute; top: 50%; left: 50%; width: 60vmin; height: 60vmin;
          border-radius: 50%; transform: translate(-50%,-50%); mix-blend-mode: screen; }
        .ghf-core { position: absolute; top: 50%; left: 50%; width: 14vmin; height: 14vmin; border-radius: 50%;
          transform: translate(-50%,-50%);
          background: radial-gradient(circle, #fff 0%, #ffe7c2 30%, rgba(249,115,22,0.6) 55%, transparent 75%);
          box-shadow: 0 0 12vmin rgba(249,115,22,0.55);
          animation: ghf-pulse 5s ease-in-out infinite; }
        @keyframes ghf-drift { from { background-position: 0 0; } to { background-position: 220px 220px; } }
        @keyframes ghf-pulse { 0%,100% { opacity: .75; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.06); } }
        @keyframes ghf-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ghf-body { position: absolute; top: 0; left: 50%; width: 2vmin; height: 2vmin; margin-left: -1vmin;
          transform-origin: center 28vmin; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #e4ecff, #5b6bd6 60%, #222c7a); }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        <div className="ghf-dust" />
        <div
          className="ghf-arm"
          style={{
            background:
              "conic-gradient(from 20deg, transparent 0 18deg, rgba(139,92,246,0.16) 22deg, transparent 40deg, rgba(59,130,246,0.18) 50deg, transparent 72deg, rgba(217,70,239,0.14) 80deg, transparent 100deg)",
            animation: "ghf-orbit 80s linear infinite",
          }}
        />
        <div
          className="ghf-arm"
          style={{
            background:
              "conic-gradient(from 200deg, transparent 0 18deg, rgba(56,189,248,0.15) 24deg, transparent 42deg, rgba(129,140,248,0.18) 55deg, transparent 76deg, rgba(251,113,133,0.13) 84deg, transparent 102deg)",
            animation: "ghf-orbit 110s linear infinite reverse",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div className="ghf-core" />
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: "56vmin",
            height: "56vmin",
            transform: "translate(-50%,-50%)",
            animation: "ghf-orbit 26s linear infinite",
          }}
        >
          <div className="ghf-body" />
        </div>
      </div>
    </div>
  );
}
