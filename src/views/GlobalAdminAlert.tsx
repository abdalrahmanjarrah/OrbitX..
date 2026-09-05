import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSound } from "../lib/sound";
import { useLanguage } from "../context/LanguageContext";

export default function GlobalAdminAlert() {
  const { isAr, t } = useLanguage();
  const [alert, setAlert] = useState<any | null>(null);
  const shownAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only fetch alerts created extremely recently (we only want new realtime alerts)
    const q = query(collection(db, "admin_alerts"), orderBy("createdAt", "desc"), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const id = snap.docs[0].id;
        
        // Prevent showing old alerts on load, only show if it's within last 30 seconds
        const now = Date.now();
        const alertTime = data.createdAt?.toDate ? data.createdAt.toDate().getTime() : now;
        
        if (!shownAlertsRef.current.has(id) && (now - alertTime < 30000)) {
          shownAlertsRef.current.add(id);
          setAlert({ id, ...data });
          try {
            playSound("notification"); // Fallback to whatever sound is available in sound.ts
          } catch(e) {}
          
          setTimeout(() => {
            setAlert((prev: any) => prev?.id === id ? null : prev);
          }, 15000); // Auto hide after 15 seconds
        }
      }
    }, (error) => {
      console.warn("Global alert error:", error.message);
    });

    return () => unsub();
  }, []);

  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-[950] px-4"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="bg-gold/95 backdrop-blur-xl border-2 border-gold/40 p-4 rounded-2xl shadow-[0_0_50px_rgb(212,175,55,0.5)] flex items-start gap-4">
          <div className="p-3 bg-gold/50 rounded-xl text-gold/80 shrink-0 mt-1">
            <AlertTriangle size={24} className="animate-pulse" />
          </div>
          <div className="flex-1 text-right ltr:text-left">
            <h3 className="text-white font-black text-xl mb-1 flex items-center justify-between">
              {isAr ? "رسالة إدارية هامة" : "Important Admin Message"}
              <button 
                onClick={() => setAlert(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                title={isAr ? "إغلاق التنبيه" : "Close Alert"}
              >
                <X size={20} className="text-gold/80" />
              </button>
            </h3>
            <p className="text-gold/70 text-sm font-medium leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
