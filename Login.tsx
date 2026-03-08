import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: Partial<UserProfile>) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.success) {
            onLogin({
                name: data.user.name,
                avatar: data.user.avatar,
                isPremium: false
            });
        } else {
            setError(data.message || 'Login failed');
            setIsLoading(false);
        }
    } catch (err) {
        setError('Network error');
        setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'microsoft' | 'yahoo') => {
    setIsLoading(true);
    setError('');

    try {
        const origin = window.location.origin;
        const response = await fetch(`/api/auth/url?provider=${provider}&origin=${encodeURIComponent(origin)}`);
        const data = await response.json();

        if (data.error) {
            setError(`Configuration missing for ${provider}. Please check .env settings.`);
            setIsLoading(false);
            return;
        }

        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const authWindow = window.open(
            data.url,
            'oauth_popup',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!authWindow) {
            setError('Popup blocked. Please allow popups for this site.');
            setIsLoading(false);
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
                window.removeEventListener('message', handleMessage);
                authWindow.close();
                
                if (event.data.user) {
                    onLogin({
                        name: event.data.user.name,
                        avatar: event.data.user.picture,
                        isPremium: false
                    });
                } else {
                    // Fallback if user data is missing
                    onLogin({
                        name: 'Google User',
                        avatar: `https://lh3.googleusercontent.com/a/default-user`,
                        isPremium: false
                    });
                }
            } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
                window.removeEventListener('message', handleMessage);
                authWindow.close();
                setError(event.data.error || 'Authentication failed');
                setIsLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);

    } catch (err) {
        console.error(err);
        setError('Failed to initiate login');
        setIsLoading(false);
    }
  };

  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                    {error}
                </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
              )}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Sign in with Google"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
            </button>
          </div>
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-300 mb-2 font-medium">
              Configure this Redirect URI in your Google Cloud Console:
            </p>
            <code className="block p-2 bg-white dark:bg-gray-900 rounded border border-blue-200 dark:border-blue-800 text-xs text-gray-600 dark:text-gray-400 break-all select-all">
              {redirectUri}
            </code>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account? <button className="text-primary-600 font-bold hover:underline">Sign up</button>
            </p>
        </div>
      </div>
    </div>
  );
};
