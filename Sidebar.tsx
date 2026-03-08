import React from 'react';
import { 
  Home, 
  BookOpen, 
  Briefcase, 
  PenTool, 
  LogOut, 
  Settings,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { View, UserProfile } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  userProfile: UserProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  userProfile,
  onLogout
}) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: Home },
    { id: View.LEARN, label: 'Learn', icon: BookOpen },
    { id: View.INTERVIEW, label: 'Interview Prep', icon: Briefcase },
    { id: View.TOOLS, label: 'Tools', icon: PenTool },
    { id: View.MESSAGES, label: 'SociFriends', icon: MessageCircle },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-center border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                Socibuild
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className={`transition-colors ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </button>
              );
            })}
            
            <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group mt-4"
            >
                <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                <span>Log Out</span>
            </button>
          </nav>

          {/* User Profile / Settings (Bottom) */}
          <div className="p-4 border-t border-gray-50 dark:border-gray-800">
            <button 
              onClick={() => {
                setCurrentView(View.SETTINGS);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${currentView === View.SETTINGS ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <div 
              className="mt-4 flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors"
              onClick={() => {
                setCurrentView(View.PLANS);
                setMobileMenuOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                    userProfile.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userProfile.name}</p>
                <p className="text-xs text-gray-400 truncate">{userProfile.isPremium ? 'Pro Plan' : 'Free Plan'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
