export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  country: string;
  level: number;
  referralCode: string;
  referredCount: number;
}

export type ActivityCategory = 'Reading' | 'Exam Preparation' | 'Course Progress' | 'Study Sessions' | 'Skill Learning';

export type ActivityUnit = 'Minutes' | 'Hours' | 'Pages' | 'Chapters' | 'Lessons' | 'Problems';

export interface Activity {
  id: string;
  userId: string;
  title: string;
  category: ActivityCategory;
  unit: ActivityUnit;
  dailyGoal: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  activityId: string;
  userId: string;
  amount: number;
  note: string;
  loggedAt: string; // ISO String or YYYY-MM-DD
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalLearningDays: number;
  lastCheckedInDate: string | null; // YYYY-MM-DD
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'Reading' | 'Finished';
}

export interface Quote {
  id: string;
  bookId: string;
  userId: string;
  quoteText: string;
  pageNumber?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5
  reviewText: string;
  createdAt: string;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  photoUrl: string;
  currentStreak: number;
  weeklyHours: number;
  learningDays: number;
  country: string;
  isAdded: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  photoUrl: string;
  weeklyHours: number;
  learningDays: number;
  streak: number;
  country: string;
  rank?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "7 Days", "1 Week"
  goal: string; // e.g., "Study daily", "100 Pages"
  targetValue: number;
  unit: string;
  progress: number;
  isJoined: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon name
  isEarned: boolean;
  earnedAt?: string;
  category: 'streak' | 'logging' | 'books' | 'referrals';
}

export interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: ActivityCategory;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  username: string;
  name: string;
  photoUrl: string;
  action: string;
  detail: string;
  timestamp: string; // e.g. "2 hours ago", "Just now"
}
