import { playSound } from "../lib/sound";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Component } from "react";
import {
  Leaf,
  Swords,
  ChevronLeft,
  Rocket,
  Timer,
  Users,
  Zap,
  Star,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  User as UserIcon,
  Heart,
  ShieldAlert,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Lock,
  Send,
  Image as ImageIcon,
  Plus,
  X,
  MessageCircle,
  Calendar,
  Shield,
  Trash2,
  Music,
  CloudRain,
  Flame,
  Wind,
  Bird,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Info,
  Keyboard,
  Waves,
  TrainFront,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Radio,
  Trophy,
  Menu,
  Square,
  Store,
  BookOpen,
  Target,
  Telescope,
  Award,
  Activity,
  Eye,
  Terminal as TerminalIcon,
  Cpu,
  CheckSquare,
  Bell,
  BarChart3,
  Search, Globe2, UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StarBackground from "../components/StarBackground";

import { cn } from "../lib/utils";
import {
  auth,
  db,
  signInWithGoogle,
  logout,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot as originalOnSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where,
  deleteDoc,
  deleteField,
  writeBatch,
} from "firebase/firestore";
import { UserSearchView } from "../components/UserSearchView";

import { FirestoreError } from 'firebase/firestore';

function onSnapshot(...args: any[]) {
    // We try to catch uncaught snapshot errors
    if (args.length === 2 && typeof args[1] === 'function') {
        return originalOnSnapshot(args[0], args[1], (e: any) => {
            console.error('Intercepted onSnapshot error', e, args[0]);
            handleFirestoreError(e, OperationType.GET, 'snapshot_unknown');
        });
    }
    if (args.length === 3 && typeof args[1] === 'function' && typeof args[2] === 'function') {
        const originalError = args[2];
        args[2] = (e: any) => {
            console.error('Intercepted onSnapshot error', e, args[0]);
            originalError(e);
        };
        return originalOnSnapshot(args[0], args[1], args[2]);
    }
    return (originalOnSnapshot as any)(...args);
}


import { SURAHS, BADGES, MeteorEffect, RECITERS, UserData, Fleet, Discussion, Reply, ScheduleItem, Room, Challenge, AwarenessSignal, Message } from '../shared';
import NotificationsDropdown from './NotificationsDropdown';
import Dashboard from './Dashboard';
import NavPill from './NavPill';
import MobileNavPill from './MobileNavPill';
import DockButton from './DockButton';
import ChallengeModal from './ChallengeModal';
import ArticleModal from './ArticleModal';
import HomeView from './HomeView';
import StationCard from './StationCard';
import ExhibitionGallery from './ExhibitionGallery';
import SuggestionsSection from './SuggestionsSection';
import QuranPlayer from './QuranPlayer';
import PersonalTasks from './PersonalTasks';
import StudyRoomView from './StudyRoomView';
import LeaderboardView from './LeaderboardView';
import FocusHeatmap from './FocusHeatmap';
import ProfileView from './ProfileView';
import DiscussionsView from './DiscussionsView';
import ScheduleView from './ScheduleView';
import BadgeCard from './BadgeCard';
import CosmicDiary from './CosmicDiary';
import UserModal from './UserModal';
import NavLink from './NavLink';
import FleetsView from './FleetsView';
import { useLanguage } from '../context/LanguageContext';

export default function BlackHolesView({ user }: { user: UserData }) {
  const [globalProgress, setGlobalProgress] = useState(0);
  const [topContributors, setTopContributors] = useState<UserData[]>([]);
  const { isAr, t } = useLanguage();
  const targetGoal = 1000;

  // calculate total focus sessions from all users
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const q = query(
          collection(db, "profiles"),
          orderBy("xp", "desc"),
          limit(100)
        );
        const usersSnapshot = await getDocs(q);
        let totalSessions = 0;
        let users: UserData[] = [];
        usersSnapshot.forEach((doc) => {
          const data = doc.data() as UserData;
          if (data.xp) {
            totalSessions += data.xp; // We reuse totalSessions but as total XP
            users.push({ ...data, uid: doc.id });
          }
        });

        users.sort(
          (a, b) => (b.xp || 0) - (a.xp || 0),
        );
        setTopContributors(users.slice(0, 3));

        // 1 hour focus = 60 XP
        let totalHours = totalSessions / 60;
        setGlobalProgress(Math.floor(totalHours));
      } catch (e) {
        console.error("Failed to fetch black hole progress", e);
      }
    };
    fetchProgress();
  }, []);

  const progressPercent = Math.min((globalProgress / targetGoal) * 100, 100);

  return (
    <div className={cn("max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10 px-4 md:px-0 mt-8 mb-32", isAr ? "text-right" : "text-left")}>
      <div className={cn("flex items-center gap-4 mb-8", isAr ? "flex-row" : "flex-row-reverse self-end justify-end")}>
        <div className="p-3 bg-gradient-to-br from-violet/20 to-violet/20 rounded-2xl border border-violet/30 text-violet">
          <Target size={28} />
        </div>
        <div className={isAr ? "text-right" : "text-left"}>
          <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-1">
            {isAr ? "الثقوب السوداء (تحديات جماعية)" : "Black Holes (Cosmic Challenges)"}
          </h2>
          <p className="text-violet/80">
            {isAr 
              ? "تعاونوا مع جميع الرواد للوصول إلى الهدف وفك تشفير المعارف الكونية."
              : "Collaborate with all cosmic pilots to reach target parameters and unlock classified space documents."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative p-8 bg-black/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          {/* Animated Black Hole Background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgb(0,0,0,1) 10%, rgb(140,82,255,0.3) 40%, rgb(0,0,0,0) 70%)",
                boxShadow: "0 0 100px 20px rgb(140,82,255,0.2)",
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] rounded-full border border-violet/20 border-dashed"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[200px] h-[200px] rounded-full border border-violet/30 border-dotted"
            />
          </div>

          <div className="z-10 text-center flex flex-col items-center">
            <div className="w-28 h-28 mb-6 rounded-full bg-black border-4 border-violet/50 shadow-[0_0_50px_rgb(140,82,255,0.8)] flex items-center justify-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-violet/20 to-violet/20"
              />
              <span className="text-3xl font-bold text-white relative z-10">
                {progressPercent.toFixed(1)}%
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-snug">
              {isAr ? "تحدي الثقب الأسود: شفرة النجم المفقود" : "Black Hole: Code of the Lost Star"}
            </h3>
            <p className="text-violet/80 mb-8 max-w-md leading-relaxed text-sm">
              {isAr
                ? "يجب على جميع رواد الفضاء في المنصة تجميع 1000 ساعة تركيز هذا الأسبوع معاً لفك تشفير مقالة سرية جديدة في قسم الوعي الكوني."
                : "All astronauts must collectively complete 1000 hours of focused study this week to decrypt and unlock a super-secret entry inside the Cosmic Awareness Hub."}
            </p>

            <div className="w-full max-w-md bg-black/50 rounded-full h-5 border border-white/10 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-violet to-violet shadow-[0_0_15px_rgb(140,82,255,0.5)]"
              />
            </div>
            <div className="flex justify-between w-full max-w-md mt-3 text-sm font-medium">
              <span className="text-violet">
                {isAr ? `${globalProgress} ساعة تركيز مكتملة` : `${globalProgress} hours focused completed`}
              </span>
              <span className="text-white/50">
                {isAr ? `الهدف: ${targetGoal} س` : `Goal: ${targetGoal}h`}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#090b1f]/80 backdrop-blur-md rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet/50 to-transparent"></div>
            <h3 className={cn("text-lg font-bold text-white mb-4 flex items-center gap-2", isAr ? "flex-row" : "flex-row-reverse")}>
              <Award size={20} className="text-violet" />
              <span>{isAr ? "الجائزة المخبأة" : "Hidden Bounty"}</span>
            </h3>
            <div className={cn("p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4", isAr ? "flex-row" : "flex-row-reverse")}>
              <div className="p-3 bg-black/50 rounded-xl">
                <Lock size={20} className="text-white/60" />
              </div>
              <div className={isAr ? "text-right" : "text-left"}>
                <h4 className="text-white font-bold mb-1 text-sm">
                  {isAr ? "ملف مشفر (التصنيف: سري للغاية)" : "Encrypted Archive (Classified: Top Secret)"}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {isAr 
                    ? "يحتوي هذا الملف على حقائق قوية مخفية. لن يتم كشفها إلا بتعاون جميع الرواد!"
                    : "This entry contains deep classified cosmos wisdom. It will remain locked until collective goals are satisfied."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#090b1f]/80 backdrop-blur-md rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/50 to-transparent"></div>
            <h3 className={cn("text-lg font-bold text-white mb-4 flex items-center gap-2", isAr ? "flex-row" : "flex-row-reverse")}>
              <Flame size={20} className="text-gold" />
              <span>{isAr ? "أفضل المساهمين" : "Top Contributors"}</span>
            </h3>
            <div className="space-y-3">
              {topContributors.length > 0 ? (
                topContributors.map((usr, i) => (
                  <div
                    key={usr.uid}
                    className={cn("flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors", isAr ? "flex-row" : "flex-row-reverse")}
                  >
                    <div className={cn("flex items-center gap-3", isAr ? "flex-row" : "flex-row-reverse")}>
                      <div className="font-bold text-white/50 w-4 text-center">
                        {i + 1}
                      </div>
                      <img
                        src={
                          usr.photoURL ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${usr.uid}`
                        }
                        alt={usr.displayName || (isAr ? "مجهول" : "Unnamed")}
                        className="w-8 h-8 rounded-full bg-black/50"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm text-white/80 font-medium">
                        {usr.displayName || (isAr ? "رائد مجهول" : "Anonymous Astronaut")}
                      </span>
                    </div>
                    <span className="text-xs text-gold font-bold bg-gold/10 px-2 py-1 rounded-lg">
                      {Math.round((usr.xp || 0) / 60)} {isAr ? "س" : "h"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-white/60 text-sm">
                  {isAr ? "لا يوجد مساهمين بعد. كن أول من يساهم!" : "No contributors detected. Be the first to launch focus!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
