import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Settings, 
  Award, 
  Users, 
  CheckCircle, 
  Calendar, 
  Plus, 
  Share2, 
  Volume2, 
  Award as BadgeIcon, 
  BookOpenCheck,
  Zap,
  Target
} from 'lucide-react';

// Data model definitions
import { 
  UserProfile, 
  StreakState, 
  Activity, 
  ActivityLog, 
  Book, 
  Quote, 
  Review, 
  Friend, 
  Challenge, 
  Achievement, 
  Goal, 
  FeedItem 
} from './types';

// Baseline mock statistics
import { 
  INITIAL_PROFILE, 
  INITIAL_STREAK, 
  INITIAL_ACTIVITIES, 
  INITIAL_LOGS, 
  INITIAL_BOOKS, 
  INITIAL_QUOTES, 
  INITIAL_REVIEWS, 
  INITIAL_FRIENDS, 
  INITIAL_CHALLENGES, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_GOALS, 
  INITIAL_FEED 
} from './initialData';

// Modular layouts 
import StreakCard from './components/StreakCard';
import MonthlyReport from './components/MonthlyReport';
import BookShelf from './components/BookShelf';
import Leaderboard from './components/Leaderboard';
import Challenges from './components/Challenges';
import ActivityLogger from './components/ActivityLogger';
import GoalsTracker from './components/GoalsTracker';

export default function App() {
  // --- Persistent State Setup ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ilm_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [streak, setStreak] = useState<StreakState>(() => {
    const saved = localStorage.getItem('ilm_streak');
    return saved ? JSON.parse(saved) : INITIAL_STREAK;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('ilm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ilm_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('ilm_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('ilm_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ilm_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('ilm_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('ilm_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ilm_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('ilm_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [feed, setFeed] = useState<FeedItem[]>(() => {
    const saved = localStorage.getItem('ilm_feed');
    return saved ? JSON.parse(saved) : INITIAL_FEED;
  });

  // Theme support & Mobile view controls
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reading' | 'leaderboard' | 'challenges' | 'viral'>('dashboard');
  const [notif, setNotif] = useState<{ type: 'streak' | 'log' | 'referral' | null; text: string }>({ type: null, text: '' });

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('ilm_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('ilm_streak', JSON.stringify(streak));
  }, [streak]);
  useEffect(() => {
    localStorage.setItem('ilm_activities', JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem('ilm_logs', JSON.stringify(logs));
  }, [logs]);
  useEffect(() => {
    localStorage.setItem('ilm_books', JSON.stringify(books));
  }, [books]);
  useEffect(() => {
    localStorage.setItem('ilm_quotes', JSON.stringify(quotes));
  }, [quotes]);
  useEffect(() => {
    localStorage.setItem('ilm_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('ilm_friends', JSON.stringify(friends));
  }, [friends]);
  useEffect(() => {
    localStorage.setItem('ilm_challenges', JSON.stringify(challenges));
  }, [challenges]);
  useEffect(() => {
    localStorage.setItem('ilm_achievements', JSON.stringify(achievements));
  }, [achievements]);
  useEffect(() => {
    localStorage.setItem('ilm_goals', JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem('ilm_feed', JSON.stringify(feed));
  }, [feed]);

  // Identify today's date formatted as YYYY-MM-DD
  const todayDateStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Determine if checked in today
  const isCheckedInToday = useMemo(() => {
    return streak.lastCheckedInDate === todayDateStr;
  }, [streak.lastCheckedInDate, todayDateStr]);

  // --- Dynamic Stats Calculations (Today, Week, Month, Year equivalents) ---
  const calculatedStats = useMemo(() => {
    // Current week thresholds (last 7 days inclusive)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Current month threshold (current calendar month base starting with "YYYY-MM")
    const currentMonthCode = new Date().toISOString().substring(0, 7);

    // Summing cumulative study equivalent hours from logs
    let totalTodayMins = 0;
    let totalWeekMins = 0;
    let totalMonthMins = 0;

    logs.forEach((log) => {
      // Approximate minutes based on units
      // IELTS act_2 is in minutes
      // Atomic Habits act_1 is in pages: assume ~3 mins per page
      // React Course act_3 is in lessons: assume ~45 mins per lesson
      // Solving Math act_4 is in problems: assume ~10 mins per problem
      let equivalentMins = 10;
      if (log.activityId === 'act_2') equivalentMins = log.amount;
      else if (log.activityId === 'act_1') equivalentMins = log.amount * 3;
      else if (log.activityId === 'act_3') equivalentMins = log.amount * 45;
      else if (log.activityId === 'act_4') equivalentMins = log.amount * 10;

      // Grouping by date
      if (log.loggedAt === todayDateStr) {
        totalTodayMins += equivalentMins;
      }

      const logDate = new Date(log.loggedAt);
      if (logDate >= sevenDaysAgo) {
        totalWeekMins += equivalentMins;
      }

      if (log.loggedAt.startsWith(currentMonthCode)) {
        totalMonthMins += equivalentMins;
      }
    });

    return {
      todayHours: Math.round((totalTodayMins / 60) * 10) / 10,
      weekHours: Math.round((totalWeekMins / 60) * 10) / 10,
      monthHours: Math.round((totalMonthMins / 60) * 10) / 10,
    };
  }, [logs, todayDateStr]);

  // --- Core Habit & Study Callbacks ---
  
  // 1. One-tap Daily Habit Check-In
  const handleDailyCheckIn = () => {
    if (isCheckedInToday) return;

    const newStreakVal = streak.currentStreak + 1;
    const pathLongestStreak = Math.max(streak.longestStreak, newStreakVal);

    setStreak(prev => ({
      ...prev,
      currentStreak: newStreakVal,
      longestStreak: pathLongestStreak,
      totalLearningDays: prev.totalLearningDays + 1,
      lastCheckedInDate: todayDateStr
    }));

    // Trigger celebration toast notification
    setNotif({
      type: 'streak',
      text: `🔥 Habit Secure! Checked in for today. Your learning streak is now ${newStreakVal} days!`
    });

    // Feed updates
    const logId = `feed_user_checked_${Date.now()}`;
    const personalFeedItem: FeedItem = {
      id: logId,
      username: profile.username,
      name: profile.name,
      photoUrl: profile.avatarUrl,
      action: 'reached a milestone streak',
      detail: `${newStreakVal}-day learning streak checked! 🔥`,
      timestamp: 'Just now'
    };
    setFeed(prev => [personalFeedItem, ...prev]);

    // Check streak achievements
    if (newStreakVal >= 7) {
      unlockAchievement('ach_2'); // Steady Week Streaker
    }

    setTimeout(() => {
      setNotif({ type: null, text: '' });
    }, 4500);
  };

  // 2. Log Study Session Effort
  const handleLogStudySession = (activityId: string, amount: number, note: string, date: string) => {
    const act = activities.find(a => a.id === activityId);
    if (!act) return;

    const logId = `log_${Date.now()}`;
    const newLog: ActivityLog = {
      id: logId,
      activityId,
      userId: profile.id,
      amount,
      note: note.trim() || `Study practice session`,
      loggedAt: date
    };

    setLogs(prev => [newLog, ...prev]);

    // Auto trigger check-in if logged for today, to automatically keep the user safe!
    if (date === todayDateStr && !isCheckedInToday) {
      handleDailyCheckIn();
    }

    // Unlocking First Session Spark achievement
    unlockAchievement('ach_1');

    // Update active challenges progress
    // Reading challenge
    if (act.category === 'Reading' && act.unit === 'Pages') {
      updateChallengeProgress('ch_2', amount);
    }
    // Deep work challenge
    if (act.unit === 'Minutes') {
      updateChallengeProgress('ch_3', amount);
    }

    // Add study log info directly to Friends Activity Feed
    const feedId = `feed_log_${Date.now()}`;
    const userFeed: FeedItem = {
      id: feedId,
      username: profile.username,
      name: profile.name,
      photoUrl: profile.avatarUrl,
      action: 'completed',
      detail: `${amount} ${act.unit} of ${act.title}. Notes: ${note || 'Excellent focused study!'}`,
      timestamp: 'Just now'
    };

    setFeed(prev => [userFeed, ...prev]);
  };

  // 3. Create Habit Activity Plan
  const handleAddActivity = (newActData: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => {
    const newId = `act_${Date.now()}`;
    const newAct: Activity = {
      ...newActData,
      id: newId,
      userId: profile.id,
      createdAt: todayDateStr
    };
    setActivities(prev => [...prev, newAct]);
  };

  // 4. Delete Habit Activity Plan
  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    // Filter corresponding logs
    setLogs(prev => prev.filter(l => l.activityId !== id));
  };

  // 5. Goals Milestones Management 
  const handleAddGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newId = `goal_${Date.now()}`;
    const entry: Goal = {
      ...newGoalData,
      id: newId,
      createdAt: todayDateStr
    };
    setGoals(prev => [entry, ...prev]);
  };

  const handleUpdateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentValue: newValue };
      }
      return g;
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  // --- Reading Module Helpers ---
  const handleAddBook = (bookMeta: Omit<Book, 'id' | 'userId'>) => {
    const newId = `book_${Date.now()}`;
    const entry: Book = {
      ...bookMeta,
      id: newId,
      userId: profile.id,
    };
    setBooks(prev => [entry, ...prev]);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
    // Filter quotes and reviews
    setQuotes(prev => prev.filter(q => q.bookId !== bookId));
    setReviews(prev => prev.filter(r => r.bookId !== bookId));
  };

  const handleUpdateBookProgress = (bookId: string, newPage: number) => {
    setBooks(prev => prev.map((b) => {
      if (b.id === bookId) {
        const isFinishedNow = newPage >= b.totalPages;
        return {
          ...b,
          currentPage: newPage,
          status: isFinishedNow ? 'Finished' : 'Reading'
        };
      }
      return b;
    }));

    // Unlock "Polymath Reader" achievement badge if total finished books hits 5
    const alreadyCompleted = books.filter(b => b.status === 'Finished').length;
    if (alreadyCompleted + 1 >= 5) {
      unlockAchievement('ach_4');
    }
  };

  const handleAddBookQuote = (bookId: string, quoteText: string, pageNumber?: number) => {
    const newId = `q_${Date.now()}`;
    const entry: Quote = {
      id: newId,
      bookId,
      userId: profile.id,
      quoteText,
      pageNumber,
      createdAt: todayDateStr
    };
    setQuotes(prev => [entry, ...prev]);
  };

  const handleAddBookReview = (bookId: string, rating: number, reviewText: string) => {
    const newId = `rev_${Date.now()}`;
    const entry: Review = {
      id: newId,
      bookId,
      rating,
      reviewText,
      userId: profile.id,
      createdAt: todayDateStr
    };
    setReviews(prev => [entry, ...prev]);
  };

  // --- Weekly Leaderboards Action & Referrals ---
  const handleAddFriendToggle = (username: string) => {
    setFriends(prev => prev.map((f) => {
      if (f.username === username) {
        return { ...f, isAdded: !f.isAdded };
      }
      return f;
    }));
  };

  const handleRedeemReferralCode = (code: string): boolean => {
    // Basic evaluation: format matches "ILM-*"
    if (!code.startsWith('ILM-') || code.length < 5) return false;

    // Mutate referral count
    setProfile(prev => ({
      ...prev,
      referredCount: prev.referredCount + 1,
      level: prev.referredCount + 1 >= 3 ? 5 : prev.level
    }));

    // Unlock "Network Ambassador" badge if referred 3 times
    if (profile.referredCount + 1 >= 3) {
      unlockAchievement('ach_5');
    }

    setNotif({
      type: 'referral',
      text: `🎉 Ambassador Status updated! Your classmate's referral of code ${code} was catalogued. Invites: ${profile.referredCount + 1}/3!`
    });

    setTimeout(() => {
      setNotif({ type: null, text: '' });
    }, 4500);

    return true;
  };

  const onChangeJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map((ch) => {
      if (ch.id === challengeId) {
        return { ...ch, isJoined: true };
      }
      return ch;
    }));
  };

  // --- Achievements & Challenges logic ---
  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map((ach) => {
      if (ach.id === id && !ach.isEarned) {
        return {
          ...ach,
          isEarned: true,
          earnedAt: todayDateStr
        };
      }
      return ach;
    }));
  };

  const updateChallengeProgress = (id: string, amount: number) => {
    setChallenges(prev => prev.map((ch) => {
      if (ch.id === id && ch.isJoined) {
        return {
          ...ch,
          progress: Math.min(ch.targetValue, ch.progress + amount)
        };
      }
      return ch;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans pb-16">
      
      {/* Dynamic Celebration / Toast Notification Bar */}
      {notif.text && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-slate-900 text-white p-4.5 rounded-2xl shadow-xl border border-slate-700/60 transition-all flex items-start gap-3.5 animate-bounce">
          <div className="p-2 bg-emerald-500 rounded-xl text-slate-900 self-start">
            <Sparkles className="w-5 h-5 fill-slate-900" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-bold font-mono tracking-wide uppercase">Assistant Notification Hub</p>
            <p className="text-xs text-white/95 mt-1 font-semibold leading-relaxed">{notif.text}</p>
          </div>
        </div>
      )}

      {/* --- Main Application Header / Navbar --- */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Elegant brand typography */}
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1">
                  Ilmsevar
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-100/60 font-mono py-0.5 px-2 rounded-full uppercase scale-90">
                    LearnFlow
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 hidden sm:block">Stay consistent in learning through friendly competition</p>
              </div>
            </div>

            {/* Active profile widget */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="font-bold text-slate-800 text-xs block leading-tight">{profile.name}</span>
                <span className="text-[10px] font-mono text-slate-400">@{profile.username} • LVL {profile.level}</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-600/20 overflow-hidden shadow-inner bg-slate-100">
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- Responsive Sub-Tabs Navigation for Mobile Screens --- */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex justify-start md:justify-center space-x-1.5 py-3 whitespace-nowrap scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Dashboard Hub', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'reading', label: 'Reading Journal', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <Users className="w-4 h-4" /> },
              { id: 'challenges', label: 'Challenges & Badges', icon: <Award className="w-4 h-4" /> },
              { id: 'viral', label: 'Share Achievements', icon: <Share2 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-150'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* --- Main Contents Area Container --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* --- High Impact Stats Banner Row at the top of active learning --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-2xs relative overflow-hidden">
            <div className="absolute right-3.5 top-3 text-emerald-500 opacity-20">
              <Flame className="w-10 h-10 fill-emerald-500" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Current Streak</p>
            <p className="font-extrabold text-2xl text-slate-850 mt-1.5 font-mono">{streak.currentStreak} Days</p>
            <div className="text-[10px] text-emerald-600 font-bold font-mono mt-1 flex items-center gap-1.5">
              <span>🔥 Safe today</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-2xs relative overflow-hidden">
            <div className="absolute right-3.5 top-3 text-emerald-600 opacity-25">
              <Clock className="w-10 h-10" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Hours Studied (Weekly)</p>
            <p className="font-extrabold text-2xl text-slate-850 mt-1.5 font-mono">{calculatedStats.weekHours} hrs</p>
            <p className="text-[10px] text-indigo-600 font-medium font-mono mt-1">Goal: 10 hrs limit</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-2xs relative overflow-hidden">
            <div className="absolute right-3.5 top-3 text-indigo-500 opacity-25">
              <BookOpen className="w-10 h-10" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Hours Studied (Monthly)</p>
            <p className="font-extrabold text-2xl text-slate-850 mt-1.5 font-mono">{calculatedStats.monthHours} hrs</p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Across {activities.length} habits</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-2xs relative overflow-hidden">
            <div className="absolute right-3.5 top-3 text-amber-500 opacity-25">
              <Award className="w-10 h-10" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Longest Active streak</p>
            <p className="font-extrabold text-2xl text-slate-850 mt-1.5 font-mono">{streak.longestStreak} Days</p>
            <p className="text-[10px] text-amber-600 font-bold font-mono mt-1">Personal Best</p>
          </div>

        </div>

        {/* --- View Switching Logic --- */}

        {/* 1. Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Section: Check-In & Logger Form Column (8cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Daily check-in box */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-950 rounded-2xl text-white p-6 shadow-md relative overflow-hidden border border-slate-800">
                {/* Visual glows */}
                <div className="absolute right-0 bottom-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono tracking-wider font-semibold py-1 px-2.5 rounded-full uppercase inline-block">
                      Daily habit loop
                    </span>
                    <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight mt-2.5">
                      Secured your consistency index today?
                    </h2>
                    <p className="text-slate-350 text-xs mt-1 max-w-md leading-relaxed">
                      Simply tap the Check-InStudied badge statement below immediately after concluding daily learning sessions to cement streak indicators.
                    </p>
                  </div>

                  <div className="self-start md:self-center">
                    {isCheckedInToday ? (
                      <div className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs font-bold font-mono shadow-inner">
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-600 bg-emerald-950/20" />
                        <div className="text-left">
                          <p>TODAY SECURED ✅</p>
                          <p className="text-[10px] text-emerald-500 font-normal mt-0.5">{streak.currentStreak} day streak status active</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleDailyCheckIn}
                        className="bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 text-slate-950 font-extrabold text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-550/20 transition-all cursor-pointer flex items-center gap-2 tracking-wide uppercase"
                      >
                        <Flame className="w-4 h-4 fill-slate-950" />
                        <span>I Studied Today ✅</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Combined activity planning and session logging components */}
              <ActivityLogger 
                activities={activities}
                logs={logs}
                onAddActivity={handleAddActivity}
                onLogSession={handleLogStudySession}
                onDeleteActivity={handleDeleteActivity}
              />

              {/* Milestones and Goal tracking module */}
              <GoalsTracker 
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoalProgress={handleUpdateGoalProgress}
                onDeleteGoal={handleDeleteGoal}
              />

            </div>

            {/* Right Section: Sidebar Activity Feed & Quick Leaderboard snippets (4cols) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Dynamic activity feed widget */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-800 text-sm tracking-tight mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Real-time Accountability Feed</span>
                  </span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                </h3>

                <div className="space-y-4">
                  {feed.map((feedItem) => (
                    <div key={feedItem.id} className="flex gap-3 start items-start border-l-2 border-slate-100 pl-3 pt-0.5">
                      <img 
                        src={feedItem.photoUrl} 
                        alt={feedItem.username} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          <strong>{feedItem.name}</strong>{' '}
                          <span className="text-slate-400 text-[10px]">{feedItem.action}</span>{' '}
                          <span className="text-slate-700 font-semibold">{feedItem.detail}</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-450 block mt-1">
                          {feedItem.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Leaderboards widget */}
              <Leaderboard 
                profile={profile}
                friends={friends}
                currentStreak={streak.currentStreak}
                totalLearningDays={streak.totalLearningDays}
                thisWeekHours={calculatedStats.weekHours}
                onAddFriendToggle={handleAddFriendToggle}
              />

            </div>

          </div>
        )}

        {/* 2. Reading Desk / Module View */}
        {activeTab === 'reading' && (
          <div className="space-y-8 animate-fade-in">
            <BookShelf 
              books={books}
              quotes={quotes}
              reviews={reviews}
              onAddBook={handleAddBook}
              onUpdateProgress={handleUpdateBookProgress}
              onAddQuote={handleAddBookQuote}
              onAddReview={handleAddBookReview}
              onDeleteBook={handleDeleteBook}
            />
          </div>
        )}

        {/* 3. Leaderboard View */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <Leaderboard 
              profile={profile}
              friends={friends}
              currentStreak={streak.currentStreak}
              totalLearningDays={streak.totalLearningDays}
              thisWeekHours={calculatedStats.weekHours}
              onAddFriendToggle={handleAddFriendToggle}
            />
          </div>
        )}

        {/* 4. Challenges & Badges View */}
        {activeTab === 'challenges' && (
          <div className="space-y-8">
            <Challenges 
              challenges={challenges}
              achievements={achievements}
              profile={profile}
              onChangeJoinChallenge={onChangeJoinChallenge}
              onRedeemReferralCode={handleRedeemReferralCode}
            />
          </div>
        )}

        {/* 5. Viral Sharing and insights page */}
        {activeTab === 'viral' && (
          <div className="space-y-8">
            {/* Streak Card widget */}
            <StreakCard 
              profile={profile}
              streak={streak}
            />

            {/* Monthly comprehensive analytical review card */}
            <MonthlyReport 
              profile={profile}
              logs={logs}
              books={books}
              streak={streak}
            />
          </div>
        )}

      </main>

      {/* Humble Footer info details */}
      <footer className="text-center py-12 text-xs text-slate-400 border-t border-slate-100 mt-16">
        <p className="font-semibold text-slate-500">Ilmsevar Learning Consistency Tracker Hub</p>
        <p className="text-[10px] mt-1 text-slate-450">&copy; {new Date().getFullYear()} Ilmsevar. Built for modern lifelong scholars and active students globally.</p>
      </footer>

    </div>
  );
}
