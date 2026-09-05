import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Rocket, Trophy } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserData } from "../shared";
import { playSound } from "../lib/sound";
import { useLanguage } from "../context/LanguageContext";

interface MissionRoleWizardProps {
  user: UserData;
  onComplete: (updatedData: Partial<UserData>) => void;
}

export default function MissionRoleWizard({ user, onComplete }: MissionRoleWizardProps) {
  const { isAr } = useLanguage();
  const [specialization, setSpecialization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialization.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      playSound("levelup");

      const updatesUser = {
        missionRole: specialization.trim(),
        completedWizard: true,
      };

      if (typeof window !== "undefined" && !(window as any).__firestoreQuotaExceeded) {
        // Update both user and profiles collections to ensure perfect sync
        await updateDoc(doc(db, "users", user.uid), updatesUser);
        await updateDoc(doc(db, "profiles", user.uid), {
          missionRole: specialization.trim(),
          completedWizard: true,
        });
      } else {
        console.warn("[Quota Fallback] Intercepted Firestore update.");
      }

      onComplete(updatesUser);
    } catch (error) {
      console.error("Error setting mission role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-navy/85 backdrop-blur-xl"
      id="mission-role-wizard-overlay"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Background stars / celestial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[15%] left-[25%] w-72 h-72 bg-violet/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[25%] right-[15%] w-80 h-80 bg-neon/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#090b1f]/95 border border-violet/25 rounded-3xl max-w-md w-full shadow-2xl shadow-violet/40 overflow-hidden p-6 md:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 border border-violet/10 rounded-full pointer-events-none" />
        <div className="absolute top-[-30px] right-[-30px] w-3 h-3 bg-violet/55 rounded-full blur-[1px] pointer-events-none animate-ping" />

        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-14 h-14 bg-violet/10 border border-violet/30 rounded-2xl flex items-center justify-center text-violet shadow-lg shadow-violet/5 mb-4 animate-[bounce_3s_infinite]">
            <Rocket className="w-7 h-7" />
          </div>

          <span className="text-xs font-semibold text-violet tracking-widest uppercase mb-1">
            {isAr ? "دليل انضمام رواد الفضاء" : "ASTRONAUT INITIATION PROTOCOL"}
          </span>
          <h2 className="text-2xl font-black text-white font-sans tracking-tight">
            {isAr ? "ما هو تخصصك الفضائي؟" : "What is your cosmic specialization?"}
          </h2>
          <p className="text-sm text-white/60 mt-2 leading-relaxed font-sans">
            {isAr
              ? "اكتب تخصصك أو شغفك لتمييز هويتك في هذه الرحلة المجريّة العظيمة."
              : "Tell us about your area of expertise or interest to personalize your space mission experience."}
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/60 mb-2 font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet" />
              {isAr ? "التخصص أو الهوية المهنية:" : "Cosmic discipline or role:"}
            </label>
            <input
              type="text"
              required
              maxLength={40}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={isAr ? "مثال: مبرمج كونيات، طبيب مجري، مصمم كواكب..." : "e.g., Space Programmer, Quantum Explorer, Planet Designer..."}
              className="w-full bg-navy/60 border border-violet/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-violet/40 focus:ring-1 focus:ring-violet/40 transition-all text-center font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !specialization.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-violet to-violet disabled:from-panel/40 disabled:to-panel/40 disabled:text-white/50 disabled:cursor-not-allowed border disabled:border-violet/5 text-white rounded-2xl font-black text-xs hover:from-violet hover:to-violet/85 transition-all shadow-lg shadow-violet/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trophy className="w-4 h-4" />
            )}
            {isAr ? "تأكيد الإقلاع والولوج 🚀" : "Confirm & Launch Protocol"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
