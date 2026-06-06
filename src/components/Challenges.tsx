import React, { useState } from 'react';
import { Challenge, Achievement, UserProfile } from '../types';
import { 
  Award, 
  Flame, 
  Zap, 
  BookOpen, 
  Users, 
  Gift, 
  Check, 
  Copy, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Library,
  Clock
} from 'lucide-react';

interface ChallengesProps {
  challenges: Challenge[];
  achievements: Achievement[];
  profile: UserProfile;
  onChangeJoinChallenge: (id: string) => void;
  onRedeemReferralCode: (code: string) => boolean;
}

export default function Challenges({
  challenges,
  achievements,
  profile,
  onChangeJoinChallenge,
  onRedeemReferralCode
}: ChallengesProps) {
  const [activeSegment, setActiveSegment] = useState<'challenges' | 'achievements' | 'referrals'>('challenges');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState<{ status: 'success' | 'error' | null; message: string }>({ status: null, message: '' });

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://ilmsevar.com/ref/${profile.referralCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = onRedeemReferralCode(inputCode);
    if (ok) {
      setRedeemFeedback({
        status: 'success',
        message: `Successfully redeemed code! You earned a consistent reward streak multiplier and unlocked custom referral counts.`
      });
      setInputCode('');
    } else {
      setRedeemFeedback({
        status: 'error',
        message: 'Invalid code. Referral code format is ILM-XXXX-YY.'
      });
    }
    setTimeout(() => {
      setRedeemFeedback({ status: null, message: '' });
    }, 4000);
  };

  // Helper to resolve icon from name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'Library':
        return <Library className="w-5 h-5 text-purple-500" />;
      case 'Users':
      default:
        return <Users className="w-5 h-5 text-[#a855f7]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="challenges-badges-root-container">
      {/* Tab Switcher upper-header */}
      <div className="bg-slate-50 border-b border-slate-100 flex divide-x divide-slate-100">
        <button
          onClick={() => setActiveSegment('challenges')}
          className={`flex-1 py-4 text-center text-xs font-semibold transition-all cursor-pointer ${
            activeSegment === 'challenges' ? 'bg-white text-emerald-700 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Consistency Sprints ({challenges.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSegment('achievements')}
          className={`flex-1 py-4 text-center text-xs font-semibold transition-all cursor-pointer ${
            activeSegment === 'achievements' ? 'bg-white text-emerald-700 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Scholar Badges ({achievements.filter(a => a.isEarned).length}/{achievements.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSegment('referrals')}
          className={`flex-1 py-4 text-center text-xs font-semibold transition-all cursor-pointer ${
            activeSegment === 'referrals' ? 'bg-white text-emerald-700 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4 text-[#a855f7]" />
            <span>Referrals</span>
          </div>
        </button>
      </div>

      {/* Main Container body */}
      <div className="p-6">
        {activeSegment === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-xs tracking-tight uppercase font-mono text-emerald-700">Active Learning Sprints</h4>
                <p className="text-slate-400 text-[10px] mt-0.5">Commit to consistent timeframes to accelerate your studying pace</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono font-bold px-2 py-0.5 rounded-full">
                Weekly Active Sprints
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((ch) => {
                const percent = Math.min(100, Math.round((ch.progress / ch.targetValue) * 100));
                return (
                  <div key={ch.id} className="border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-350 bg-white shadow-xs transition-shadow">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold font-mono tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">
                          {ch.duration} limit
                        </span>
                        {ch.isJoined && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold font-mono rounded-md flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Joined
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-slate-800 text-xs tracking-tight leading-snug">{ch.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 md:h-8 leading-relaxed">
                        {ch.description}
                      </p>

                      <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg my-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400">Sprint Target:</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">{ch.goal}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between gap-4 mt-1">
                      {ch.isJoined ? (
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                            <span>Sprint Progress</span>
                            <span>{ch.progress}/{ch.targetValue} {ch.unit} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onChangeJoinChallenge(ch.id)}
                          className="w-full text-center py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Join Consistency Sprint
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSegment === 'achievements' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 text-xs tracking-tight uppercase font-mono text-emerald-700">Locked & Unlocked Badges</h4>
              <p className="text-slate-400 text-[10px] mt-0.5">Celebrate learning streaks and logging volume with beautiful physical achievements</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((ach) => {
                return (
                  <div 
                    key={ach.id} 
                    className={`border rounded-xl p-4 flex gap-3 transition-all ${
                      ach.isEarned 
                        ? 'border-emerald-200/80 bg-emerald-50/15' 
                        : 'border-slate-150 bg-slate-50/40 opacity-70'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl self-start ${ach.isEarned ? 'bg-emerald-50/80' : 'bg-slate-100/80'}`}>
                      {renderIcon(ach.iconName)}
                    </div>

                    <div>
                      <h4 className={`font-semibold text-xs leading-snug ${ach.isEarned ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>
                        {ach.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {ach.description}
                      </p>
                      {ach.isEarned ? (
                        <span className="text-[9px] text-emerald-700 font-mono font-bold mt-1.5 flex items-center gap-1 bg-emerald-100/30 px-1.5 py-0.5 rounded inline-block">
                          <Check className="w-2.5 h-2.5" /> Earned on {ach.earnedAt ? new Date(ach.earnedAt).toLocaleDateString() : 'Just now'}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-mono tracking-tight mt-1 px-1 rounded border border-slate-100 inline-block bg-white text-center">
                          🔒 In progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSegment === 'referrals' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Left Side: stats of referrals */}
              <div className="lg:w-7/12 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs tracking-tight uppercase font-mono text-purple-700">Invite Friends - Ignite Learning</h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">Studies show peer support increases consistency. Unlock the referral badge!</p>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-purple-50 rounded-xl">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">Successful Invites</p>
                      <p className="font-extrabold text-lg text-slate-800">{profile.referredCount} Friends</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-mono tracking-wider font-bold border border-purple-150 px-2 py-0.5 rounded-full inline-block">
                      {profile.referredCount >= 3 ? '🎉 Badge Unlocked' : 'Invite 1 more friend for Badge'}
                    </span>
                  </div>
                </div>

                {/* Copy referral links */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">Your Personal Invite Link</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      type="text"
                      className="flex-1 text-xs border border-slate-200 bg-slate-50 text-slate-600 px-3 py-1 px-3 rounded-lg border focus:ring-0 cursor-default truncate text-ellipsis select-all"
                      value={`https://ilmsevar.com/ref/${profile.referralCode}`}
                    />
                    <button
                      onClick={copyInviteLink}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-950 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: mock code validation input */}
              <div className="lg:w-5/12 w-full bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 self-stretch flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs tracking-tight flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Redeem Code
                  </h4>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-normal">Got an invite code from a classmate? Redeem here to instantly reward them and boost your learning pace!</p>
                </div>

                <form onSubmit={handleRedeemSubmit} className="space-y-2.5">
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ILM-ALISHER-99"
                      className="w-full text-xs p-2 border border-slate-200 focus:ring-1 focus:ring-emerald-500 rounded-lg bg-white uppercase text-slate-700 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-center py-1.5 bg-slate-800 hover:bg-slate-950 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Redeem Invitation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {redeemFeedback.status && (
                  <div className={`p-2 rounded-lg text-[10px] leading-relaxed ${
                    redeemFeedback.status === 'success' ? 'bg-emerald-50 border border-emerald-150 text-emerald-800' : 'bg-red-50 border border-red-150 text-red-800'
                  }`}>
                    {redeemFeedback.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
