import { useState, useCallback } from "react";
import { UserPlus, Check } from "lucide-react";
import { buildInviteLink } from "../lib/share";
import { useLanguage } from "../context/LanguageContext";
import type { UserData } from "../shared";

interface ReferralCardProps {
  user: UserData;
}

export function ReferralCard({ user }: ReferralCardProps) {
  const { isAr } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildInviteLink(user.uid));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [user.uid]);

  return (
    <div
      className="relative rounded-3xl bg-[#090b1f]/80 backdrop-blur-xl border border-white/5 p-5 overflow-hidden group hover:border-violet/20 transition-all cursor-pointer"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet/15 border border-violet/25 flex items-center justify-center">
            <UserPlus size={14} className="text-violet" />
          </div>
          <span className="text-sm font-bold text-white">
            {isAr ? "ادعُ صديقاً واحصل على 100 XP" : "Invite a friend & get 100 XP"}
          </span>
        </div>

        <div
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0
            ${copied
              ? "bg-lemon/15 border border-lemon/30 text-lemon"
              : "bg-violet/10 border border-violet/25 text-violet group-hover:bg-violet/20"
            }
          `}
        >
          {copied ? (
            <>
              <Check size={12} />
              {isAr ? "تم النسخ" : "Copied!"}
            </>
          ) : (
            isAr ? "الرابط" : "Link"
          )}
        </div>
      </div>
    </div>
  );
}
