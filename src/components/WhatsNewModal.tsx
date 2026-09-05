import { useEffect, useState } from "react";
import { shouldShowWhatsNew, markWhatsNewSeen, WHATS_NEW_ITEMS, APP_VERSION } from "../lib/versionConfig";
import { useLanguage } from "../context/LanguageContext";

export default function WhatsNewModal() {
  const [show, setShow] = useState(false);
  const { isAr } = useLanguage();

  useEffect(() => {
    if (shouldShowWhatsNew()) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    markWhatsNewSeen();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fade-in_0.2s_ease]">
      <div className="bg-[#090b1f]/95 border border-neon/20 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-neon/40 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-30px] w-32 h-32 bg-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-black text-white mb-1">
            {isAr ? "تحديثات OrbitX" : "OrbitX Updates"}
          </h2>
          <span className="text-[10px] font-bold text-neon/60 tracking-widest">
            v{APP_VERSION}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {WHATS_NEW_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-neon/5 border border-neon/10 rounded-2xl px-4 py-3"
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="text-sm text-white/70 font-semibold">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-neon to-violet hover:from-neon/85 hover:to-violet text-white font-black text-sm transition-all active:scale-95"
        >
          {isAr ? "تمام!" : "Got it!"}
        </button>
      </div>
    </div>
  );
}
