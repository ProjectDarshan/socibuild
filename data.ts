import { Course, Scenario, Challenge, CommunityUser } from './types';

export const COURSES: Course[] = [
  {
    id: 'c_dynamics',
    title: 'Social Dynamics & Influence',
    description: 'Understand the hidden rules of human interaction.',
    category: 'Personal',
    level: 'Beginner',
    progress: 40,
    lessons: [
      { id: 'l1', title: 'The 7-38-55 Rule', duration: '5 min', isCompleted: true, type: 'Article' },
      { id: 'l2', title: 'Decoding Micro-Expressions', duration: '8 min', isCompleted: true, type: 'Article' },
      { id: 'l3', title: 'Quiz: Non-Verbal Cues', duration: '3 min', isCompleted: false, type: 'Quiz' },
      { id: 'l4', title: 'Project: The Eye Contact Game', duration: '1 day', isCompleted: false, type: 'Project' },
    ]
  },
  {
    id: 'c_corp',
    title: 'Executive Presence',
    description: 'Command the room and navigate high-stakes politics.',
    category: 'Work',
    level: 'Advanced',
    progress: 10,
    lessons: [
      { id: 'l5', title: 'Assertiveness without Aggression', duration: '10 min', isCompleted: true, type: 'Article' },
      { id: 'l6', title: 'Project: The Strategic Silence', duration: '2 days', isCompleted: false, type: 'Project' },
      { id: 'l7', title: 'Negotiating Value', duration: '12 min', isCompleted: false, type: 'Article' },
    ]
  },
  {
    id: 'c_future',
    title: 'Digital Charisma',
    description: 'Building rapport through screens and AI interfaces.',
    category: 'Future',
    level: 'Intermediate',
    progress: 0,
    lessons: [
      { id: 'l8', title: 'The Psychology of Texting', duration: '7 min', isCompleted: false, type: 'Article' },
      { id: 'l9', title: 'Video Call Presence', duration: '5 min', isCompleted: false, type: 'Article' },
      { id: 'l10', title: 'Challenge: The Empathetic Email', duration: '15 min', isCompleted: false, type: 'Challenge' },
    ]
  }
];

export const ALL_SCENARIOS: Scenario[] = [
  { id: '1', title: 'Networking Event Intro', description: 'Break the ice with a stranger.', difficulty: 'Easy', category: 'Professional', initialPrompt: "Hi there! I don't think we've met yet...", aiPersona: 'Alex (Industry Pro)', isPremium: false },
  { id: '2', title: 'Asking for a Raise', description: 'Negotiate a salary increase.', difficulty: 'Hard', category: 'Conflict', initialPrompt: "Hi, do you have a moment?", aiPersona: 'Sarah (Manager)', isPremium: false },
  { id: '3', title: 'First Date Small Talk', description: 'Keep the conversation flowing.', difficulty: 'Medium', category: 'Romance', initialPrompt: "So, what do you like to do on weekends?", aiPersona: 'Jordan (Date)', isPremium: false },
  { id: '4', title: 'Job Interview', description: 'Answer common behavioral questions.', difficulty: 'Hard', category: 'Interview', initialPrompt: "Tell me about yourself.", aiPersona: 'Mr. Vance (Recruiter)', isPremium: false },
  { id: '5', title: 'Active Listening Test', description: 'Listen to a story and recall details.', difficulty: 'Medium', category: 'Listening', initialPrompt: "I'm ready to listen.", aiPersona: 'Grandpa Joe (Storyteller)', isPremium: false },
  { id: '6', title: 'Giving a Presentation', description: 'Practice delivering a short speech.', difficulty: 'Medium', category: 'Professional', initialPrompt: "The stage is yours. I'm ready to listen to your presentation.", aiPersona: 'Audience Member', isPremium: false },
  
  // Premium Scenarios
  { id: 'p1', title: 'Crisis Management', description: 'Handle a PR crisis with a journalist.', difficulty: 'Hard', category: 'Professional', initialPrompt: "We need a statement on the incident immediately.", aiPersona: 'Reporter', isPremium: true },
  { id: 'p2', title: 'Advanced Negotiation', description: 'Close a high-stakes business deal.', difficulty: 'Hard', category: 'Conflict', initialPrompt: "Your price is too high. What can you do?", aiPersona: 'Client', isPremium: true },
  { id: 'p3', title: 'Keynote Speech Q&A', description: 'Handle tough questions after a speech.', difficulty: 'Hard', category: 'Professional', initialPrompt: "Why should we trust your data?", aiPersona: 'Skeptic Audience', isPremium: true },
  { id: 'p4', title: 'Family Conflict Resolution', description: 'Navigate a tense family dinner.', difficulty: 'Medium', category: 'Social', initialPrompt: "I can't believe you said that.", aiPersona: 'Aunt Karen', isPremium: true },
  { id: 'p5', title: 'VIP Networking', description: 'Connect with a high-profile CEO.', difficulty: 'Hard', category: 'Professional', initialPrompt: "I only have a minute.", aiPersona: 'Elon (CEO)', isPremium: true },
];

export const CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Compliment a Stranger', description: 'Find something genuine to praise.', xp: 50, completed: false },
  { id: 'c2', title: 'Ask an Open Question', description: 'Avoid yes/no answers in a chat.', xp: 30, completed: true },
  { id: 'c3', title: 'Maintain Eye Contact', description: 'Simulated via camera check (mock).', xp: 100, completed: false },
];

export const INITIAL_COMMUNITY_USERS: CommunityUser[] = [
  { id: 'u1', name: 'Sarah J.', status: 'online', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Improving public speaking.' },
  { id: 'u2', name: 'Mike T.', status: 'busy', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'Here for interview prep.' },
  { id: 'u3', name: 'Emma W.', status: 'online', avatar: 'https://i.pravatar.cc/150?u=3', bio: 'Learning to be more assertive.' },
];
