import React, { useState, useEffect } from 'react';
import { View, Scenario, Message, UserProfile, CommunityUser } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Learn } from './components/Learn';
import { InterviewPrep } from './components/InterviewPrep';
import { Tools } from './components/Tools';
import { Community } from './components/Community';
import { Settings } from './components/Settings';
import { Chat } from './components/Chat';
import { Plans } from './components/Plans';
import { Messages } from './components/Messages';
import { generateDailyTip } from './services/geminiService';
import { COURSES, ALL_SCENARIOS, CHALLENGES, INITIAL_COMMUNITY_USERS } from './data';
import { Menu } from 'lucide-react';
import { Logo } from './components/Logo';
import { Login } from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userMode, setUserMode] = useState<'Personal' | 'Work'>('Personal');
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data State
  const [dailyTip, setDailyTip] = useState("Loading insight...");
  const [socialIQ, setSocialIQ] = useState(115);
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>(INITIAL_COMMUNITY_USERS);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    age: '25',
    gender: 'Prefer not to say',
    language: 'English',
    occupation: 'Student',
    goals: 'Improve confidence',
    interests: 'Technology, Art',
    learningStyle: 'Visual',
    socialAnxieties: 'Public Speaking',
    avatar: 'https://i.pravatar.cc/150?u=john_doe'
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (isAuthenticated) {
        generateDailyTip(userProfile).then(setDailyTip);
    }
  }, [isAuthenticated]); 

  const handleLogin = (user: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...user }));
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleScenarioSelect = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentView(View.CHAT);
  };

  const handleStartMockInterview = (role: string) => {
    const mockScenario: Scenario = {
      id: `mock-${Date.now()}`,
      title: `${role} Mock Interview`,
      description: `A simulated interview for a ${role} position.`,
      difficulty: 'Hard',
      category: 'Interview',
      initialPrompt: "Tell me about yourself.",
      aiPersona: 'Hiring Manager'
    };
    handleScenarioSelect(mockScenario);
  };

  const handleFindPartner = () => {
    setTimeout(() => {
        const newFriend: CommunityUser = {
            id: `u${Date.now()}`,
            name: ['Alex M.', 'Jordan K.', 'Taylor R.'][Math.floor(Math.random() * 3)],
            status: 'online',
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            bio: 'New here! Looking to practice.'
        };
        setCommunityUsers(prev => [...prev, newFriend]);
    }, 1500);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            userProfile={userProfile}
            dailyTip={dailyTip}
            allScenarios={ALL_SCENARIOS}
            socialIQ={socialIQ}
            challenges={CHALLENGES}
            onScenarioSelect={handleScenarioSelect}
            onViewChange={setCurrentView}
            userMode={userMode}
            setUserMode={setUserMode}
          />
        );
      case View.LEARN:
        return <Learn courses={COURSES} userProfile={userProfile} />;
      case View.INTERVIEW:
        return <InterviewPrep userProfile={userProfile} onStartMockInterview={handleStartMockInterview} />;
      case View.TOOLS:
        return <Tools userProfile={userProfile} />;
      case View.COMMUNITY:
        return <Community users={communityUsers} onFindPartner={handleFindPartner} />;
      case View.SETTINGS:
        return (
          <Settings 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
            setDailyTip={setDailyTip}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userMode={userMode}
            setUserMode={setUserMode}
          />
        );
      case View.PLANS:
        return <Plans />;
      case View.MESSAGES:
        return <Messages userProfile={userProfile} />;
      case View.CHAT:
        if (!activeScenario) return <Dashboard 
            userProfile={userProfile}
            dailyTip={dailyTip}
            allScenarios={ALL_SCENARIOS}
            socialIQ={socialIQ}
            challenges={CHALLENGES}
            onScenarioSelect={handleScenarioSelect}
            onViewChange={setCurrentView}
            userMode={userMode}
            setUserMode={setUserMode}
          />;
        return (
          <Chat 
            scenario={activeScenario} 
            userProfile={userProfile} 
            onBack={() => setCurrentView(View.DASHBOARD)}
            onUpdateSocialIQ={(inc) => setSocialIQ(prev => Math.min(180, prev + inc))}
          />
        );
      default:
        return <Dashboard 
            userProfile={userProfile}
            dailyTip={dailyTip}
            allScenarios={ALL_SCENARIOS}
            socialIQ={socialIQ}
            challenges={CHALLENGES}
            onScenarioSelect={handleScenarioSelect}
            onViewChange={setCurrentView}
            userMode={userMode}
            setUserMode={setUserMode}
          />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-dark-bg transition-colors duration-300 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
        userProfile={userProfile}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main className="flex-1 flex flex-col h-full relative md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-30 sticky top-0">
           <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
             <Menu className="w-6 h-6" />
           </button>
           <div className="flex items-center gap-2">
             <Logo size={28} />
             <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Socibuild</span>
           </div>
           <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto h-full">
              {renderContent()}
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
