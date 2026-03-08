import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateDailyTip } from '../services/geminiService';

interface SettingsProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  setDailyTip: (tip: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  userMode: 'Personal' | 'Work';
  setUserMode: (mode: 'Personal' | 'Work') => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  userProfile, 
  setUserProfile, 
  setDailyTip,
  darkMode,
  setDarkMode,
  userMode,
  setUserMode
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const tip = await generateDailyTip(userProfile);
        setDailyTip(tip);
        alert("Profile Updated!");
    } catch (e) {
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Customize your profile to get personalized AI coaching.</p>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-6 mb-10 border-b border-gray-100 dark:border-gray-700 pb-8">
                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl font-bold text-primary-600 dark:text-primary-400 shadow-inner overflow-hidden">
                    {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                        userProfile.name.charAt(0)
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{userProfile.occupation}</p>
                    {userProfile.isPremium && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">Pro Member</span>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                {/* App Preferences */}
                <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">App Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div>
                                <span className="block font-bold text-gray-900 dark:text-white">Dark Mode</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Easier on the eyes</span>
                            </div>
                            <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-primary-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div>
                                <span className="block font-bold text-gray-900 dark:text-white">Premium Status</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Unlock all scenarios</span>
                            </div>
                            <button 
                                onClick={() => setUserProfile({...userProfile, isPremium: !userProfile.isPremium})}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${userProfile.isPremium ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${userProfile.isPremium ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 md:col-span-2">
                            <div>
                                <span className="block font-bold text-gray-900 dark:text-white">Focus Mode</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Tailor scenarios for:</span>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <button 
                                    onClick={() => setUserMode('Personal')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userMode === 'Personal' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
                                >
                                    Personal
                                </button>
                                <button 
                                    onClick={() => setUserMode('Work')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userMode === 'Work' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
                                >
                                    Work
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Avatar URL</label>
                        <input 
                            type="text" 
                            value={userProfile.avatar || ''}
                            onChange={(e) => setUserProfile({...userProfile, avatar: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Name</label>
                        <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Occupation</label>
                        <input 
                            type="text" 
                            value={userProfile.occupation}
                            onChange={(e) => setUserProfile({...userProfile, occupation: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Age</label>
                        <input 
                            type="text" 
                            value={userProfile.age}
                            onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Gender</label>
                        <select 
                            value={userProfile.gender}
                            onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white appearance-none"
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                            <option>Prefer not to say</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Language</label>
                        <select 
                            value={userProfile.language}
                            onChange={(e) => setUserProfile({...userProfile, language: e.target.value})}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white appearance-none"
                        >
                            <option>English</option>
                            <option>Tamil</option>
                            <option>Afrikaans</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Primary Goal</label>
                    <input 
                        type="text" 
                        value={userProfile.goals}
                        onChange={(e) => setUserProfile({...userProfile, goals: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Interests (comma separated)</label>
                    <textarea 
                        value={userProfile.interests}
                        onChange={(e) => setUserProfile({...userProfile, interests: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 h-32 resize-none transition-all font-medium text-gray-900 dark:text-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Social Anxiety / Challenge Areas</label>
                    <textarea 
                        value={userProfile.socialAnxieties}
                        onChange={(e) => setUserProfile({...userProfile, socialAnxieties: e.target.value})}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 h-32 resize-none transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="e.g. Public speaking, Small talk with strangers..."
                    />
                </div>

                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Learning Style</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['Visual', 'Text-Based', 'Interactive'].map(style => (
                            <button
                                key={style}
                                onClick={() => setUserProfile({...userProfile, learningStyle: style as any})}
                                className={`p-4 rounded-xl text-sm font-bold border-2 transition-all ${userProfile.learningStyle === style ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-10 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};
