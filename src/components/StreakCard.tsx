import React, { useState } from 'react';
import { Share2, Send, Check, Copy, Flame, Award, Sparkles } from 'lucide-react';
import { UserProfile, StreakState } from '../types';

interface StreakCardProps {
  profile: UserProfile;
  streak: StreakState;
}

export default function StreakCard({ profile, streak }: StreakCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'emerald' | 'amber' | 'indigo' | 'slate'>('emerald');
  const [sharing, setSharing] = useState(false);
  const [customText, setCustomText] = useState(`Keep learning! I’m on a ${streak.currentStreak}-day studying streak with Ilmsevar.`);

  const getThemeColors = () => {
    switch (selectedTheme) {
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-amber-600 to-orange-700',
          accent: 'text-amber-200',
          glow: 'shadow-amber-500/25',
          border: 'border-amber-500/30'
        };
      case 'indigo':
        return {
          bg: 'bg-gradient-to-br from-indigo-600 to-purple-700',
          accent: 'text-indigo-200',
          glow: 'shadow-indigo-500/25',
          border: 'border-indigo-500/30'
        };
      case 'slate':
        return {
          bg: 'bg-gradient-to-br from-slate-800 to-slate-950',
          accent: 'text-slate-300',
          glow: 'shadow-slate-900/35',
          border: 'border-slate-700/30'
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
          accent: 'text-emerald-200',
          glow: 'shadow-emerald-500/25',
          border: 'border-emerald-500/30'
        };
    }
  };

  const colors = getThemeColors();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${customText}\nJoin me & build study habits here: https://ilmsevar.com/ref/${profile.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    setSharing(true);
    const text = encodeURIComponent(`${customText} 🔥\nJoin me in learning at Ilmsevar!`);
    const telegramUrl = `https://t.me/share/url?url=https://ilmsevar.com/ref/${profile.referralCode}&text=${text}`;
    
    // Simulate API call and open link
    setTimeout(() => {
      setSharing(false);
      window.open(telegramUrl, '_blank');
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm" id="streak-card-share-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Share Streak Card
          </h3>
          <p className="text-slate-500 text-xs">Generate and share your consistency milestone to Telegram or save card</p>
        </div>
        
        {/* Theme select */}
        <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
          {(['emerald', 'amber', 'indigo', 'slate'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className={`w-5 h-5 rounded-full border border-white transition-all ${
                t === 'emerald' ? 'bg-emerald-500' :
                t === 'amber' ? 'bg-amber-500' :
                t === 'indigo' ? 'bg-indigo-500' : 'bg-slate-800'
              } ${selectedTheme === t ? 'scale-125 ring-2 ring-emerald-500/50' : 'opacity-80'}`}
              title={`${t} theme`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Dynamic Card Preview */}
        <div className="lg:col-span-7">
          <div className={`relative overflow-hidden rounded-xl p-8 text-white ${colors.bg} ${colors.glow} shadow-lg transition-all duration-300`}>
            {/* Ambient glows inside card */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-36 h-36 bg-black/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex justify-between items-start">
              <div>
                <p className="font-mono text-xs tracking-widest text-white/70 uppercase">Ilmsevar consistency</p>
                <div className="flex items-center gap-2 mt-2">
                  <Flame className="w-8 h-8 text-amber-300 fill-amber-300 animate-pulse" />
                  <span className="text-4xl font-extrabold tracking-tight">{streak.currentStreak} Days</span>
                </div>
                <p className="text-xs text-white/90 mt-1">Study Streak and counting!</p>
              </div>

              <div className="flex flex-col items-end">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-inner bg-slate-100">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-xs font-semibold mt-1.5 opacity-90">@{profile.username}</span>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full mt-1">LVL {profile.level}</span>
              </div>
            </div>

            <div className="border-t border-white/20 my-5" />

            <div className="flex justify-between items-center text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">Best Streak</p>
                  <p className="font-bold text-sm text-amber-200">{streak.longestStreak} days</p>
                </div>
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">Total Days</p>
                  <p className="font-bold text-sm text-emerald-200">{streak.totalLearningDays} days</p>
                </div>
              </div>
              <div className="bg-black/20 p-2 rounded-lg border border-white/10 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                <span className="font-mono text-[9px] tracking-wide uppercase">Consistent Scholar</span>
              </div>
            </div>

            <p className="text-[11px] text-white/80 italic mt-4 line-clamp-2 underline-offset-4 decoration-white/20">
              "{customText}"
            </p>
          </div>
        </div>

        {/* Card Controls & Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Caption Text</label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={120}
              rows={2}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 bg-slate-50"
              placeholder="Write what you achieved today..."
            />
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Text Quote</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareTelegram}
              disabled={sharing}
              className="flex-1 flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1E8EC2] text-white font-medium text-xs py-2 px-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>{sharing ? 'Sharing...' : 'Share to Telegram'}</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5">
            <span className="text-emerald-500 font-bold">•</span>
            <span>Sharing embeds your personalized invitation badge <strong>{profile.referralCode}</strong> to earn the Network Ambassador badge.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
