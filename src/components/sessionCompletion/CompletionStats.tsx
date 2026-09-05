import React from "react";
import { motion } from "motion/react";
import { Clock, Navigation, Hourglass, HelpCircle } from "lucide-react";

interface CompletionStatsProps {
  durationMinutes: number;
  stationName: string;
}

export const CompletionStats: React.FC<CompletionStatsProps> = ({ durationMinutes, stationName }) => {
  const hours = (durationMinutes / 60).toFixed(2);

  const statItems = [
    {
      id: "stat-stationName",
      label: "المحطة الاستكشافية",
      value: stationName,
      icon: <Navigation className="w-5 h-5 text-violet" />,
      delay: 0.35,
    },
    {
      id: "stat-duration",
      label: "وقت التركيز الصافي",
      value: `${durationMinutes} دقيقة`,
      icon: <Clock className="w-5 h-5 text-neon" />,
      delay: 0.4,
    },
    {
      id: "stat-hours",
      label: "حساب الساعات الفلكية",
      value: `${hours} ساعة`,
      icon: <Hourglass className="w-5 h-5 text-gold" />,
      delay: 0.45,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full my-5" id="completion-stats-grid">
      {statItems.map((item) => (
        <motion.div
          key={item.id}
          id={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, type: "spring", stiffness: 120 }}
          className="relative flex flex-col justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden text-right"
        >
          {/* Accent light highlight */}
          <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-neon/20 to-transparent" />
          
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="p-1 px-1.5 rounded-md border border-white/5 bg-white/[0.04]">
              {item.icon}
            </div>
            <span className="text-[10px] text-white/50 font-medium font-sans uppercase">
              {item.label}
            </span>
          </div>

          <div className="text-sm sm:text-base font-black text-white truncate font-sans">
            {item.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
