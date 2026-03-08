export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Professional' | 'Social' | 'Romance' | 'Conflict' | 'Interview' | 'Listening';
  initialPrompt: string;
  aiPersona: string;
  isPremium?: boolean;
}

export interface AnalysisResult {
  confidenceScore: number;
  empathyScore: number;
  feedback: string;
  betterAlternative?: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  TOOLS = 'TOOLS',
  COMMUNITY = 'COMMUNITY',
  LEARN = 'LEARN',
  SETTINGS = 'SETTINGS',
  INTERVIEW = 'INTERVIEW',
  PLANS = 'PLANS',
  MESSAGES = 'MESSAGES'
}

export interface UserStats {
  streak: number;
  conversations: number;
  avgConfidence: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface CommunityUser {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  bio: string;
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  language: string;
  occupation: string;
  goals: string;
  interests: string;
  learningStyle: 'Visual' | 'Text-Based' | 'Interactive';
  socialAnxieties: string;
  isPremium?: boolean;
  avatar?: string;
}

export type LessonType = 'Article' | 'Quiz' | 'Project' | 'Challenge';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  type: LessonType;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Personal' | 'Work' | 'Future';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
  progress: number;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

export interface VibeCheckResult {
  vibe: string;
  impression: string;
  tips: string[];
}