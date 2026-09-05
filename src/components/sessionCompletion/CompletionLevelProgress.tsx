import React from "react";
import { motion } from "motion/react";
import { UserData } from "../../shared";

interface CompletionLevelProgressProps {
  user: UserData;
}

export const CompletionLevelProgress: React.FC<CompletionLevelProgressProps> = ({ user }) => {
  const currentXp = user.xp || 0;
  
  // Calculate Level and Progress
  // Level = Math.floor(xp / 1000) + 1
  const level = Math.floor(currentXp / 1000) + 1;
  const currentLevelStartXp = (level - 1) * 1000;
  const xpInCurrentLevel = currentXp - currentLevelStartXp;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 1000) * 100));
  const xpNeededForNextLevel = 1000 - xpInCurrentLevel;

  return (
    <div className="w-full max-w-sm mx-auto my-4 text-right" id="completion-level-progress-container">
      {/* Top Details Header */}
      <div className="flex items-center justify-between mb-1.5 font-sans">
        <span className="text-[11px] text-white/50 font-medium font-sans">
          متبقي <strong className="text-neon font-mono font-bold">{xpNeededForNextLevel} XP</strong> للترقية
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-violet font-sans font-bold">المستوى</span>
          <span className="text-sm font-black text-white font-mono">{level}</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-2.5 rounded-full bg-white/[0.04] border border-white/5 overflow-hidden">
        {/* Animated fill indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-neon via-violet to-violet shadow-[0_0_8px_rgb(0,229,212,0.4)]"
          style={{ float: "right" }} // Ensure Arabic alignment filling from right-to-left
        />
      </div>

      {/* Footer Indicators */}
      <div className="flex items-center justify-between mt-1 text-[11px] text-white/45 font-mono">
        <span>{level + 1}</span>
        <span>{xpInCurrentLevel} / 1000 XP</span>
        <span>{level}</span>
      </div>
    </div>
  );
};
