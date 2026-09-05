import React, { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getLevelFromXp, getLevelColor } from '../lib/levelConfig';

export function UserSearchView({ user, onSelectUser }: { user: any, onSelectUser: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        setSearchError(null);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const usersRef = collection(db, 'profiles');
        const searchTermExact = searchTerm.trim();
        const q1 = query(
          usersRef, 
          where('displayName', '>=', searchTermExact),
          where('displayName', '<=', searchTermExact + '\uf8ff'),
          limit(20)
        );
        
        const snapshot = await getDocs(q1);
        const fetchedUsers = snapshot.docs.map(doc => doc.data());
        
        setResults(fetchedUsers);
      } catch (err) {
        console.error("Search error:", err);
        setSearchError("تعذر البحث. تحقق من اتصالك بالإنترنت.");
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-violet/20 to-neon/20 rounded-2xl border border-violet/30 text-violet">
          <Search size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-1">المحققون </h2>
          <p className="text-violet/80">ابحث عن أصدقائك وتابع مستوياتهم وتعرف على رواد جدد</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
          <Search className="text-violet/50" size={24} />
        </div>
        <input 
          type="text" 
          placeholder="ابحث بالاسم (مثال: أحمد)..."
          className="w-full bg-space-dark/80 border-2 border-violet/30 focus:border-violet/40 rounded-3xl py-5 pr-14 pl-6 text-white text-lg placeholder-white/30 outline-none transition-all shadow-[0_4px_20px_rgb(140,82,255,0.05)] focus:shadow-[0_4px_30px_rgb(140,82,255,0.2)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isSearching && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-6">
            <div className="w-6 h-6 border-2 border-violet/40 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {searchError && searchTerm.trim().length >= 2 && (
        <div className="flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-2xl p-4">
          <Zap size={18} className="text-gold shrink-0" />
          <span className="text-sm text-gold font-semibold">{searchError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {results.length > 0 ? (
            results.map((u, i) => (
              <motion.div 
                key={u.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-[#090b1f]/80 backdrop-blur-md rounded-3xl border border-white/5 hover:border-violet/30 p-5 flex gap-4 items-center hover:bg-white/5 transition-all cursor-pointer shadow-lg hover:shadow-violet/10"
                onClick={() => onSelectUser(u.uid)}
              >
                <img 
                  src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`} 
                  alt={u.displayName || 'Unnamed'} 
                  className="w-16 h-16 rounded-full bg-black/50 border-2 border-white/10 group-hover:border-violet/40 transition-colors" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg text-white mb-1 group-hover:text-violet/90 transition-colors">{u.displayName || 'رائد مجهول'}</div>
                  <div className={cn("text-xs font-bold inline-block px-2 py-0.5 rounded border border-current", getLevelColor(getLevelFromXp(u.xp || 0)).bg)}>
                    {'Level ' + getLevelFromXp(u.xp || 0)}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 min-w-[70px]">
                  <div className="px-3 py-2 bg-black/40 rounded-xl border border-white/5 text-center w-full group-hover:bg-violet/10 group-hover:border-violet/30 transition-colors">
                    <div className="text-[10px] text-white/60 font-bold mb-1">المستوى</div>
                    <div className="font-mono font-black text-violet leading-none">{u.level || 0}</div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : searchTerm.trim().length >= 2 && !isSearching ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="col-span-1 md:col-span-2 text-center py-16 text-white/50 bg-white/5 rounded-3xl border border-white/5 border-dashed"
             >
                <Search size={48} className="mx-auto text-white/45 mb-4 opacity-50" />
                <div className="text-lg">لم نتمكن من العثور على رائد بهذا الاسم</div>
                <div className="text-sm mt-2 opacity-70">تأكد من كتابة الاسم بشكل صحيح</div>
             </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

    </div>
  );
}
