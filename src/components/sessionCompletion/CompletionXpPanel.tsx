import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface CompletionXpPanelProps {
  xpGained: number;
}

export const CompletionXpPanel: React.FC<CompletionXpPanelProps> = ({ xpGained }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, type: "spring", stiffness: 100 }}
      className="relative flex flex-col items-center justify-center p-4 rounded-xl border border-neon/30 bg-gradient-to-b from-panel/40 to-[#04040a]/50 max-w-sm mx-auto my-4 text-center shadow-[0_4px_24px_rgb(0,229,212,0.15)] overflow-hidden"
      id="completion-xp-panel"
    >
      {/* Pulse background circle glow */}
      <span className="absolute w-24 h-24 rounded-full bg-neon/10 blur-xl pointer-events-none" />

      {/* Star Sparks absolute */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-2 right-2 text-neon/40 pointer-events-none"
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <span className="text-[10px] text-neon/80 font-mono font-black tracking-wider uppercase mb-1">
        إجمالي مكافآت الجولة الكونية
      </span>

      <div className="flex items-baseline justify-center gap-1.5 py-1">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon/85 via-violet/70 to-gold/70 font-mono"
        >
          +{xpGained}
        </motion.span>
        <span className="text-sm font-black text-white/70 font-sans">
          نقطة خبرة (XP)
        </span>
      </div>

      <div className="text-[11px] text-white/50 font-sans mt-0.5 leading-tight">
        تم تسجيل النقاط بأمان في مصفوفة السفينة وترحيلها لحسابك.
      </div>
    </motion.div>
  );
};
