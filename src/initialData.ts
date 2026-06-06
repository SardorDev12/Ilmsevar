import { 
  UserProfile, 
  Activity, 
  ActivityLog, 
  StreakState, 
  Book, 
  Quote, 
  Review, 
  Friend, 
  Challenge, 
  Achievement, 
  Goal, 
  FeedItem 
} from './types';

// Helper to get relative ISO dates
const daysAgo = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'user_sardor',
  name: 'Sardor',
  username: 'sardor_learns',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  country: 'Uzbekistan 🇺🇿',
  level: 4,
  referralCode: 'ILM-SARDOR-77',
  referredCount: 2
};

export const INITIAL_STREAK: StreakState = {
  currentStreak: 7,
  longestStreak: 43,
  totalLearningDays: 200,
  lastCheckedInDate: daysAgo(1) // Checked in yesterday, waiting for today!
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    userId: 'user_sardor',
    title: 'Atomic Habits Book',
    category: 'Reading',
    unit: 'Pages',
    dailyGoal: 20,
    createdAt: daysAgo(50)
  },
  {
    id: 'act_2',
    userId: 'user_sardor',
    title: 'IELTS Academic Study',
    category: 'Exam Preparation',
    unit: 'Minutes',
    dailyGoal: 60,
    createdAt: daysAgo(42)
  },
  {
    id: 'act_3',
    userId: 'user_sardor',
    title: 'React Professional Course',
    category: 'Course Progress',
    unit: 'Lessons',
    dailyGoal: 1,
    createdAt: daysAgo(20)
  },
  {
    id: 'act_4',
    userId: 'user_sardor',
    title: 'Solving Math Olympiad Problems',
    category: 'Skill Learning',
    unit: 'Problems',
    dailyGoal: 10,
    createdAt: daysAgo(15)
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  // Today's logs (to sum up to e.g., 2 hours / corresponding units)
  {
    id: 'log_t1',
    activityId: 'act_2', // IELTS
    userId: 'user_sardor',
    amount: 75, // 75 mins (~1.25 hours)
    note: 'Completed writing task 2 template practice',
    loggedAt: daysAgo(0)
  },
  {
    id: 'log_t2',
    activityId: 'act_1', // Atomic Habits Reading
    userId: 'user_sardor',
    amount: 25, // 25 pages
    note: 'Chapter 4: The 1st Law - Make it obvious',
    loggedAt: daysAgo(0)
  },
  {
    id: 'log_t3',
    activityId: 'act_3', // React Lessons
    userId: 'user_sardor',
    amount: 1,
    note: 'Deep dive into useTransition hook',
    loggedAt: daysAgo(0)
  },
  
  // Yesterday's logs
  {
    id: 'log_y1',
    activityId: 'act_2',
    userId: 'user_sardor',
    amount: 60,
    note: 'Listening trial test 8.0 score',
    loggedAt: daysAgo(1)
  },
  {
    id: 'log_y2',
    activityId: 'act_1',
    userId: 'user_sardor',
    amount: 20,
    note: 'Read about implementation intentions',
    loggedAt: daysAgo(1)
  },

  // This Week's logs (Days 2 to 6)
  {
    id: 'log_w1',
    activityId: 'act_2',
    userId: 'user_sardor',
    amount: 90,
    note: 'Speaking practice with simulation partner',
    loggedAt: daysAgo(2)
  },
  {
    id: 'log_w2',
    activityId: 'act_3',
    userId: 'user_sardor',
    amount: 2,
    note: 'Finished custom hook architecture patterns',
    loggedAt: daysAgo(3)
  },
  {
    id: 'log_w3',
    activityId: 'act_4',
    userId: 'user_sardor',
    amount: 15,
    note: 'Geometry proofing techniques',
    loggedAt: daysAgo(4)
  },
  {
    id: 'log_w4',
    activityId: 'act_1',
    userId: 'user_sardor',
    amount: 30,
    note: 'Loved the identity-based habit loops segment',
    loggedAt: daysAgo(5)
  },

  // Earlier this month logs (Days 8 to 25 to sum to e.g., 43 hours/equivalent)
  {
    id: 'log_m1',
    activityId: 'act_2',
    userId: 'user_sardor',
    amount: 420, // 7 hours
    note: 'Weekly mock exam collection',
    loggedAt: daysAgo(8)
  },
  {
    id: 'log_m2',
    activityId: 'act_3',
    userId: 'user_sardor',
    amount: 10, // 10 lessons
    note: 'Redux and Zustand state solutions module',
    loggedAt: daysAgo(12)
  },
  {
    id: 'log_m3',
    activityId: 'act_4',
    userId: 'user_sardor',
    amount: 120, // 120 problems
    note: 'Algebra and graph algorithms workouts',
    loggedAt: daysAgo(18)
  },
  {
    id: 'log_m4',
    activityId: 'act_2',
    userId: 'user_sardor',
    amount: 600, // 10 hours
    note: 'Reading section strategies speed coaching',
    loggedAt: daysAgo(22)
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_1',
    userId: 'user_sardor',
    title: 'Atomic Habits',
    author: 'James Clear',
    totalPages: 320,
    currentPage: 145,
    status: 'Reading'
  },
  {
    id: 'book_2',
    userId: 'user_sardor',
    title: 'Deep Work',
    author: 'Cal Newport',
    totalPages: 304,
    currentPage: 304,
    status: 'Finished'
  },
  {
    id: 'book_3',
    userId: 'user_sardor',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    totalPages: 464,
    currentPage: 88,
    status: 'Reading'
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q_1',
    bookId: 'book_1',
    userId: 'user_sardor',
    quoteText: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    pageNumber: 27,
    createdAt: daysAgo(10)
  },
  {
    id: 'q_2',
    bookId: 'book_2',
    userId: 'user_sardor',
    quoteText: 'To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.',
    pageNumber: 44,
    createdAt: daysAgo(15)
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r_1',
    bookId: 'book_2',
    userId: 'user_sardor',
    rating: 5,
    reviewText: 'This book fundamentally changed my working ethics and scheduling style. Implementing time blocks was a game-changer.',
    createdAt: daysAgo(14)
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'fr_1',
    name: 'Dilshod',
    username: 'dilshod_codes',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    currentStreak: 12,
    weeklyHours: 14.5,
    learningDays: 180,
    country: 'Uzbekistan 🇺🇿',
    isAdded: true
  },
  {
    id: 'fr_2',
    name: 'Madina',
    username: 'madina_reads',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    currentStreak: 25,
    weeklyHours: 18.2,
    learningDays: 210,
    country: 'Uzbekistan 🇺🇿',
    isAdded: true
  },
  {
    id: 'fr_3',
    name: 'Alisher',
    username: 'ali_prep',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    currentStreak: 5,
    weeklyHours: 7.8,
    learningDays: 95,
    country: 'Uzbekistan 🇺🇿',
    isAdded: true
  },
  {
    id: 'fr_4',
    name: 'Sora',
    username: 'sora_chan',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    currentStreak: 41,
    weeklyHours: 22.4,
    learningDays: 320,
    country: 'Japan 🇯🇵',
    isAdded: false
  },
  {
    id: 'fr_5',
    name: 'Alex',
    username: 'alex_growth',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    currentStreak: 18,
    weeklyHours: 11.2,
    learningDays: 145,
    country: 'United States 🇺🇸',
    isAdded: false
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    title: '7-Day Consistency Spark',
    description: 'Log any learning study session daily for 7 days in a row to establish your starting momentum.',
    duration: '7 Days',
    goal: 'Log daily',
    targetValue: 7,
    unit: 'Days',
    progress: 6, // 6 out of 7 days progress!
    isJoined: true
  },
  {
    id: 'ch_2',
    title: 'Reading Sprint champion',
    description: 'Read a cumulative total of 100 pages of any registered book this week.',
    duration: '1 Week',
    goal: 'Read 100 Pages',
    targetValue: 100,
    unit: 'Pages',
    progress: 45, // 45 out of 100 pages
    isJoined: true
  },
  {
    id: 'ch_3',
    title: 'Deep Work marathon',
    description: 'Dedicate a massive 15 hours (900 minutes) to ultimate focused learning sessions within a week.',
    duration: '1 Week',
    goal: 'Dedicate 15 hours',
    targetValue: 900,
    unit: 'Minutes',
    progress: 0,
    isJoined: false
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    name: 'First Session Spark',
    description: 'Successfully complete and record your first learning log.',
    iconName: 'Flame',
    isEarned: true,
    earnedAt: daysAgo(50),
    category: 'logging'
  },
  {
    id: 'ach_2',
    name: 'Steady Week Streaker',
    description: 'Keep your learning active for a continuous streak of 7 days.',
    iconName: 'Award',
    isEarned: true,
    earnedAt: daysAgo(7),
    category: 'streak'
  },
  {
    id: 'ach_3',
    name: 'Centurion Scholar',
    description: 'Surpass 100 hours of cumulative logged learning.',
    iconName: 'BookOpen',
    isEarned: true,
    earnedAt: daysAgo(12),
    category: 'logging'
  },
  {
    id: 'ach_4',
    name: 'The Polymath Reader',
    description: 'Complete 10 books on your bookshelves.',
    iconName: 'Library',
    isEarned: false,
    category: 'books'
  },
  {
    id: 'ach_5',
    name: 'Network Ambassador',
    description: 'Successfuly invite premium friends using your code to unlock custom badge status.',
    iconName: 'Users',
    isEarned: true,
    earnedAt: daysAgo(2),
    category: 'referrals'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'IELTS Band Score upgrade',
    currentValue: 4.5,
    targetValue: 7.0,
    unit: 'Score',
    category: 'Exam Preparation',
    createdAt: daysAgo(30)
  },
  {
    id: 'goal_2',
    title: 'React Skills Completion',
    currentValue: 20,
    targetValue: 100,
    unit: '% finished',
    category: 'Course Progress',
    createdAt: daysAgo(15)
  }
];

export const INITIAL_FEED: FeedItem[] = [
  {
    id: 'feed_1',
    username: 'dilshod_codes',
    name: 'Dilshod',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    action: 'completed',
    detail: '45 mins IELTS Speaking Practice',
    timestamp: '25 minutes ago'
  },
  {
    id: 'feed_2',
    username: 'madina_reads',
    name: 'Madina',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    action: 'reached a milestone streak',
    detail: '25-day learning streak!',
    timestamp: '2 hours ago'
  },
  {
    id: 'feed_3',
    username: 'ali_prep',
    name: 'Alisher',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    action: 'logged progress',
    detail: '1 React custom hook lesson',
    timestamp: '5 hours ago'
  }
];
