import React, { useState } from 'react';
import { LeaderboardEntry, Friend, UserProfile } from '../types';
import { 
  Trophy, 
  Search, 
  UserPlus, 
  Check, 
  TrendingUp, 
  Clock, 
  Flame, 
  Calendar, 
  Plus, 
  UserMinus,
  Globe2,
  Users
} from 'lucide-react';

interface LeaderboardProps {
  profile: UserProfile;
  friends: Friend[];
  currentStreak: number;
  totalLearningDays: number;
  thisWeekHours: number;
  onAddFriendToggle: (username: string) => void;
}

export default function Leaderboard({
  profile,
  friends,
  currentStreak,
  totalLearningDays,
  thisWeekHours,
  onAddFriendToggle
}: LeaderboardProps) {
  const [activeCategory, setActiveCategory] = useState<'friends' | 'country' | 'global'>('friends');
  const [activeMetric, setActiveMetric] = useState<'hours' | 'streak' | 'days'>('hours');
  const [searchQuery, setSearchQuery] = useState('');

  // Assemble the static base competitors (and current state of friends)
  const baseCompetitors: LeaderboardEntry[] = [
    {
      userId: 'user_sardor',
      name: profile.name,
      username: profile.username,
      photoUrl: profile.avatarUrl,
      weeklyHours: thisWeekHours,
      learningDays: totalLearningDays,
      streak: currentStreak,
      country: profile.country
    },
    {
      userId: 'fr_1',
      name: 'Dilshod',
      username: 'dilshod_codes',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      weeklyHours: friends.find(f => f.username === 'dilshod_codes')?.weeklyHours || 14.5,
      learningDays: 180,
      streak: friends.find(f => f.username === 'dilshod_codes')?.currentStreak || 12,
      country: 'Uzbekistan 🇺🇿'
    },
    {
      userId: 'fr_2',
      name: 'Madina',
      username: 'madina_reads',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      weeklyHours: friends.find(f => f.username === 'madina_reads')?.weeklyHours || 18.2,
      learningDays: 210,
      streak: friends.find(f => f.username === 'madina_reads')?.currentStreak || 25,
      country: 'Uzbekistan 🇺🇿'
    },
    {
      userId: 'fr_3',
      name: 'Alisher',
      username: 'ali_prep',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      weeklyHours: friends.find(f => f.username === 'ali_prep')?.weeklyHours || 7.8,
      learningDays: 95,
      streak: friends.find(f => f.username === 'ali_prep')?.currentStreak || 5,
      country: 'Uzbekistan 🇺🇿'
    },
    {
      userId: 'fr_4',
      name: 'Sora',
      username: 'sora_chan',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      weeklyHours: 22.4,
      learningDays: 320,
      streak: 41,
      country: 'Japan 🇯🇵'
    },
    {
      userId: 'fr_5',
      name: 'Alex',
      username: 'alex_growth',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      weeklyHours: 11.2,
      learningDays: 145,
      streak: 18,
      country: 'United States 🇺🇸'
    },
    {
      userId: 'fr_6',
      name: 'Bakhodir',
      username: 'bako_scholastic',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      weeklyHours: 19.5,
      learningDays: 188,
      streak: 30,
      country: 'Uzbekistan 🇺🇿'
    },
    {
      userId: 'fr_7',
      name: 'Elena',
      username: 'elena_polyglot',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      weeklyHours: 26.8,
      learningDays: 290,
      streak: 52,
      country: 'Germany 🇩🇪'
    }
  ];

  // Resolve list based on category filter
  let displayList = baseCompetitors.filter((competitor) => {
    // Sardor is always in list
    if (competitor.userId === 'user_sardor') return true;

    if (activeCategory === 'friends') {
      // Must be marked in friends list as added
      const friendObj = friends.find((f) => f.username === competitor.username);
      return friendObj ? friendObj.isAdded : false;
    }

    if (activeCategory === 'country') {
      // Must be from the same country
      return competitor.country === profile.country;
    }

    // Global: everyone
    return true;
  });

  // Sort display list based on active metric
  displayList = displayList.sort((a, b) => {
    if (activeMetric === 'hours') return b.weeklyHours - a.weeklyHours;
    if (activeMetric === 'streak') return b.streak - a.streak;
    return b.learningDays - a.learningDays; // Days
  });

  // Assign ranks
  displayList = displayList.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  // Apply search query
  if (searchQuery.trim()) {
    displayList = displayList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Get active user's rank index for UI display
  const activeUserRank = displayList.find((entry) => entry.userId === 'user_sardor')?.rank || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="leaderboard-module-root">
      {/* Search and Trophy Header bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-slate-50 px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base leading-tight">Weekly Challenge Leaderboard</h3>
            <p className="text-slate-500 text-xs mt-0.5">Compete with mates, regional scholars, or globally</p>
          </div>
        </div>

        {/* Localized search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scholars..."
            className="w-full md:w-56 text-xs pl-8 pr-3 py-1.5 border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg bg-white placeholder-slate-400 text-slate-700"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Categories Bar & Metrics Selection controls */}
      <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-slate-50/20">
        {/* Category: Friends vs Country vs Global */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start">
          <button
            onClick={() => setActiveCategory('friends')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'friends' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends</span>
          </button>
          <button
            onClick={() => setActiveCategory('country')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'country' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Uzbekistan</span>
          </button>
          <button
            onClick={() => setActiveCategory('global')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeCategory === 'global' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Global</span>
          </button>
        </div>

        {/* Metric selection: study hours, learning days, streak */}
        <div className="flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveMetric('hours')}
            className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
              activeMetric === 'hours' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Study Hours</span>
          </button>
          <button
            onClick={() => setActiveMetric('streak')}
            className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
              activeMetric === 'streak' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Streak</span>
          </button>
          <button
            onClick={() => setActiveMetric('days')}
            className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
              activeMetric === 'days' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Learning Days</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Competitor List Rows */}
      <div className="divide-y divide-slate-100">
        {displayList.length === 0 ? (
          <div className="py-12 text-center">
            <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 text-xs font-semibold">No scholars found</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Try widening search queries or categorical filters</p>
          </div>
        ) : (
          displayList.map((entry) => {
            const isMe = entry.userId === 'user_sardor';
            const friendState = friends.find((f) => f.username === entry.username);
            const isAdded = friendState ? friendState.isAdded : false;
            
            // Format metrics details
            let displayMetricValue = '';
            if (activeMetric === 'hours') displayMetricValue = `${entry.weeklyHours.toFixed(1)} hrs`;
            else if (activeMetric === 'streak') displayMetricValue = `${entry.streak} days`;
            else displayMetricValue = `${entry.learningDays} days`;

            return (
              <div 
                key={entry.userId} 
                className={`px-6 py-4 flex items-center justify-between transition-colors ${
                  isMe ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Ranking Circle badge */}
                  <div className="w-6 flex items-center justify-center font-mono text-xs font-bold text-slate-500">
                    {entry.rank === 1 ? (
                      <span className="text-xl">👑</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar and name info */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={entry.photoUrl} 
                        alt={entry.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" 
                        referrerPolicy="no-referrer"
                      />
                      {isMe && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-xs">{entry.name}</span>
                        {isMe && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-md font-mono tracking-wide font-bold">
                            You
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">{entry.country}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">@{entry.username}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Metric Display block value */}
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-slate-800 text-xs tracking-tight block">
                      {displayMetricValue}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block transform scale-95 origin-right">
                      {activeMetric}
                    </span>
                  </div>

                  {/* Add Friend interactive toggle button under Global tab */}
                  {!isMe && (
                    <button
                      onClick={() => onAddFriendToggle(entry.username)}
                      className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isAdded 
                          ? 'border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60' 
                          : 'border-slate-200 hover:border-slate-350 bg-white text-slate-500 hover:text-slate-800 hover:shadow-xs'
                      }`}
                      title={isAdded ? 'Remove friend' : 'Add friend'}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* High impact placement summarizing the active user ranking context below */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-650" />
          <span>Active placement: <strong>Rank #{activeUserRank}</strong> this week for study hours.</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">Next rank threshold: {(displayList[Math.max(0, activeUserRank - 2)]?.weeklyHours || thisWeekHours).toFixed(1)} hrs</span>
      </div>
    </div>
  );
}
