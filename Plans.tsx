import React from 'react';
import { Check, X, Star, Zap } from 'lucide-react';

export const Plans: React.FC = () => {
  return (
    <div className="h-full flex flex-col animate-fade-in max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upgrade Your Social Skills</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Unlock the full potential of Socibuild and accelerate your personal growth with our premium features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Free Plan</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Perfect for getting started.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Check size={16} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">2 Limited Courses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Check size={16} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">3 Interview Prep Uses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Check size={16} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">5 Tool Uses per tool</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">
                <X size={16} />
              </div>
              <span className="text-gray-500 dark:text-gray-400">Unlimited Scenarios</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">
                <X size={16} />
              </div>
              <span className="text-gray-500 dark:text-gray-400">New Monthly Content</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-primary-500 shadow-xl shadow-primary-500/10 relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">
            Most Popular
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary-500 uppercase tracking-wide flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" /> Premium
            </h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">$14.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">For serious growth and mastery.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Check size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Unlimited Uses of Tools</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Check size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Unlimited Interview Prep</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Check size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Unlimited Courses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Check size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Unlimited & New Scenarios</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <Zap size={16} />
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Priority AI Processing</span>
            </div>
          </div>

          <button 
            onClick={() => alert("Redirecting to payment gateway...")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1"
          >
            Upgrade to Premium
          </button>
          
          <p className="mt-4 text-xs text-center text-gray-400">
            Cancel anytime. Secure payment via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};
