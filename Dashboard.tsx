import React, { useState } from 'react';
import { Sparkles, CheckCircle, Brain, Activity, ArrowRight } from 'lucide-react';
import { ScenarioCard } from './ScenarioCard';
import { Scenario, Challenge, UserProfile, View } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  dailyTip: string;
  allScenarios: Scenario[];
  socialIQ: number;
  challenges: Challenge[];
  onScenarioSelect: (scenario: Scenario) => void;
  onViewChange: (view: View) => void;
  userMode: 'Personal' | 'Work';
  setUserMode: (mode: 'Personal' | 'Work') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  dailyTip,
  allScenarios,
  socialIQ,
  challenges,
  onScenarioSelect,
  onViewChange,
  userMode,
  setUserMode
}) => {
  const filteredScenarios = allScenarios.filter(s => {
    if (userMode === 'Work') return ['Professional', 'Conflict', 'Interview'].includes(s.category);
    return ['Social', 'Romance', 'Listening'].includes(s.category);
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello, <span className="text-primary-500">{userProfile.name}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Targeting: {userProfile.goals}</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button 
            onClick={() => setUserMode('Personal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${userMode === 'Personal' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Personal
          </button>
          <button 
            onClick={() => setUserMode('Work')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${userMode === 'Work' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Work
          </button>
        </div>
      </header>

      {/* Hero Tip */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 text-white shadow-lg shadow-primary-500/20">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-white/80">
            <Sparkles className="w-4 h-4" /> Daily Insight
          </h2>
          <p className="text-2xl md:text-3xl font-medium leading-tight">"{dailyTip}"</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         {/* Main Content - Scenarios */}
         <div className="md:col-span-2 space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Scenarios</h2>
                <button 
                  onClick={() => onViewChange(View.TOOLS)} 
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
             </div>
             <div className="grid gap-4 sm:grid-cols-2">
                {filteredScenarios.map(scenario => (
                  <ScenarioCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onClick={onScenarioSelect} 
                    isLocked={scenario.isPremium && !userProfile.isPremium}
                  />
                ))}
             </div>
         </div>

         {/* Sidebar - Stats & Challenges */}
         <div className="space-y-6">
             {/* Social IQ Card */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                     <div>
                         <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Social IQ</h3>
                         <div className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{socialIQ}</div>
                         <p className="text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
                           <Activity className="w-3 h-3" /> Top 15%
                         </p>
                     </div>
                     <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * (socialIQ / 180))} className="text-primary-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary-500" />
                        </div>
                     </div>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(socialIQ / 180) * 100}%` }}></div>
                 </div>
             </div>
             
             {/* Challenges */}
             <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Challenges</h2>
                 <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-2 space-y-1">
                    {challenges.map(challenge => (
                    <div key={challenge.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer group">
                        <div className={`p-2 rounded-full flex-shrink-0 ${challenge.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">{challenge.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{challenge.description}</p>
                        </div>
                        <span className="text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">+{challenge.xp} XP</span>
                    </div>
                    ))}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};
