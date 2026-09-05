import React from "react";
import { Swords, Users, Rocket, Flame } from "lucide-react";
import { motion } from "motion/react";

interface ChallengesHeroProps {
  onStartChallengeClick: () => void;
  onInviteFriendClick: () => void;
  friendsCount: number;
  activeCount: number;
  invitesCount: number;
  winsCount: number;
}

export const ChallengesHero: React.FC<ChallengesHeroProps> = ({
  onStartChallengeClick,
  onInviteFriendClick,
  friendsCount,
  activeCount,
  invitesCount,
  winsCount,
}) => {
  const stats = [
    { label: "نزالات مشتعلة", value: activeCount, accent: "text-gold", dot: "bg-gold/80" },
    { label: "طلبات معلقة", value: invitesCount, accent: "text-gold", dot: "bg-gold/80" },
    { label: "انتصاراتك", value: winsCount, accent: "text-lemon", dot: "bg-lemon/80" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-space-dark p-6 md:p-8 shadow-[0_20px_60px_rgb(0,0,0,0.45)]">
      {/* خلفية متوهجة - طاقة ساحة النزال */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* أعمدة الضوء */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-24 left-[18%] w-px h-64 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent" />
        <div className="absolute -top-24 left-[46%] w-px h-64 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent" />
        <div className="absolute -top-24 left-[72%] w-px h-64 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent" />
      </div>

      {/* شرارات حية */}
      {Array.from({ length: 26 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gold/35 opacity-25 animate-pulse"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
        {/* النص */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/12 text-gold text-xs font-medium mb-4 border border-gold/25 tracking-wide"
          >
            <Swords size={12} className="animate-pulse" />
            حلبة النزالات · OrbitX
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2"
          >
            حلبة{" "}
            <span className="bg-gradient-to-r from-gold/85 via-gold/70 to-gold/85 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgb(212,175,55,0.35)]">
              نزالات التركيز
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm leading-relaxed max-w-lg mb-6"
          >
            خصمك بانتظارك في قلب الحلبة. كل دقيقة تركيز حقيقية تجمعها بأي محطة
            تتحول لنقطة في نزالك — ومين يجمع أكتر دقائق قبل نهاية المدة، يفوز
            بالنزال ويحصد الجوائز.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={onStartChallengeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-gold to-gold border border-gold/40 text-white text-sm font-medium shadow-[0_0_25px_rgb(212,175,55,0.3)] hover:from-gold/90 hover:to-gold/90 hover:shadow-[0_0_35px_rgb(212,175,55,0.45)] transition-all active:scale-95 cursor-pointer"
            >
              <Rocket size={14} />
              فتح نزال جديد
            </button>
            <button
              onClick={onInviteFriendClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <Users size={14} />
              استدعاء مقاتل ({friendsCount})
            </button>
          </motion.div>
        </div>

        {/* لوحة العدادات */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-3 lg:w-80 shrink-0"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 flex flex-col items-center gap-2 backdrop-blur-sm"
            >
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${s.dot}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`}></span>
              </span>
              <span className={`text-2xl font-black font-mono ${s.accent}`}>{s.value}</span>
              <span className="text-[10px] text-white/60 font-semibold text-center leading-tight">{s.label}</span>
            </div>
          ))}
          <div className="lg:hidden col-span-3" />
        </motion.div>
      </div>

      {/* شريط "المجد" السفلي */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex items-center gap-2 mt-6 pt-4 border-t border-white/5 text-[10px] text-white/50"
      >
        <Flame size={11} className="text-gold/70" />
        <span>الفائز يرفع راية النزال، يكسب شارة البطل الأسبوعية، ويغادر الحلبة أقوى.</span>
      </motion.div>
    </div>
  );
};
