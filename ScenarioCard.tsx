import React from 'react';
import { Scenario } from '../types';
import { MessageCircle, Zap, Shield, Heart, Lock } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: (scenario: Scenario) => void;
  isLocked?: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick, isLocked }) => {
  const getIcon = () => {
    switch (scenario.category) {
      case 'Professional': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'Romance': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Conflict': return <Zap className="w-5 h-5 text-yellow-500" />;
      default: return <MessageCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getDifficultyColor = () => {
    switch (scenario.difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  return (
    <div 
      onClick={() => !isLocked && onClick(scenario)}
      className={`group bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 p-5 rounded-2xl shadow-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${isLocked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'}`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-gray-700 transition-colors">
            {getIcon()}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`}>
            {scenario.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {scenario.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {scenario.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500">
        <div>
           AI Persona: <span className="text-gray-600 dark:text-gray-300 ml-1">{scenario.aiPersona}</span>
        </div>
        {scenario.isPremium && (
            <span className="text-amber-500 font-bold flex items-center gap-1">
                Premium
            </span>
        )}
      </div>
    </div>
  );
};