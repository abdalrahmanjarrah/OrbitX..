import { useState, useEffect, useCallback } from "react";
import { Timer, Lock, CheckCircle, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getChestState, claimChest, CHEST_CONFIG } from "../lib/timeChests";
import { useLanguage } from "../context/LanguageContext";
import type { UserData } from "../shared";

function formatTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface TimeChestsProps {
  user: UserData;
}

export function TimeChests({ user }: TimeChestsProps) {
  const { isAr } = useLanguage();
  const [state, setState] = useState(() => getChestState(user));
  const [claiming, setClaiming] = useState<number | null>(null);
  const [showReward, setShowReward] = useState<{ xp: number; icon: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setState(getChestState(user)), 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleClaim = useCallback(async (i: number) => {
    if (claiming !== null) return;
    setClaiming(i);
    const granted = await claimChest(i, user);
    setClaiming(null);
    if (granted > 0) {
      setShowReward({ xp: CHEST_CONFIG[i].xp, icon: CHEST_CONFIG[i].icon });
      setState(getChestState(user));
      setTimeout(() => setShowReward(null), 2500);
    }
  }, [user, claiming]);

  const nextLockedIdx = state.statuses.findIndex((s) => s === "locked");

  return (
    <div className="relative rounded-3xl bg-[#0e1025]/80 backdrop-blur-xl border border-white/5 p-5 overflow-hidden group hover:border-amber-500/20 transition-all">
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center gap-2 mb-4">
        <Timer size={16} className="text-amber-400" />
        <h3 className="text-sm font-black text-white">
          {isAr ? "صناديق الوقت" : "Time Chests"}
        </h3>
      </div>

      <div className="relative flex items-center justify-between gap-2 mb-4">
        {CHEST_CONFIG.map((chest, i) => {
          const status = state.statuses[i];
          return (
            <button
              key={i}
              disabled={status !== "ready" || claiming !== null}
              onClick={() => handleClaim(i)}
              className={`
                relative flex items-center justify-center w-12 h-12 rounded-2xl text-xl transition-all
                ${status === "claimed"
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : status === "ready"
                    ? "bg-amber-500/15 border border-amber-500/40 hover:scale-110 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer animate-pulse"
                    : "bg-white/5 border border-white/5 opacity-40"
                }
              `}
            >
              {status === "claimed" ? (
                <CheckCircle size={18} className="text-emerald-400" />
              ) : status === "ready" ? (
                <Gift size={18} className="text-amber-400" />
              ) : (
                <Lock size={14} className="text-gray-600" />
              )}
            </button>
          );
        })}
      </div>

      {state.allClaimed ? (
        <div className="relative text-center text-xs font-bold text-emerald-400/80">
          {isAr ? "أكملت الدورة! تتجدد بعد 24 ساعة" : "Cycle complete! Resets in 24h"}
        </div>
      ) : nextLockedIdx >= 0 ? (
        <div className="relative text-center text-xs font-bold text-gray-500">
          {isAr ? "الصندوق الجاي يفتح بعد" : "Next chest in"}{" "}
          <span className="text-amber-400 font-black">{formatTime(state.timeUntilNext)}</span>
        </div>
      ) : (
        <div className="relative text-center text-xs font-bold text-amber-400/80">
          {isAr ? "صندوق جاهز! اضغط لفتحه" : "Chest ready! Tap to open"}
        </div>
      )}

      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl px-5 py-3 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <div className="text-2xl mb-1">{showReward.icon}</div>
              <div className="text-sm font-black text-amber-300">+{showReward.xp} XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
