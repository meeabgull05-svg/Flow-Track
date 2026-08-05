import React from 'react';
import { Play, Pause, Clock, Calendar, Code, Sparkles, Plus, BarChart3, UserCheck, ShieldCheck, Database, LogOut, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: 'dashboard' | 'yearHistory' | 'codeGuide' | 'landing';
  setCurrentTab: (tab: 'dashboard' | 'yearHistory' | 'codeGuide' | 'landing') => void;
  activeTaskRunningTitle?: string;
  activeTaskSeconds?: number;
  isTimerRunning: boolean;
  onToggleActiveTimer?: () => void;
  user: UserProfile;
  onOpenAuthModal: () => void;
  onOpenProfile?: () => void;
  onOpenAddTask: () => void;
  onOpenAiModal: () => void;
  onSeedData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeTaskRunningTitle,
  activeTaskSeconds = 0,
  isTimerRunning,
  onToggleActiveTimer,
  user,
  onOpenAuthModal,
  onOpenProfile,
  onOpenAddTask,
  onOpenAiModal,
  onSeedData,
}) => {
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  FlowTrack
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Task & 1-Year Time Tracker
              </p>
            </div>
          </button>
        </div>

        {/* Active Timer Pill Indicator (If running) */}
        {isTimerRunning && activeTaskRunningTitle && (
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-xs shadow-inner animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-indigo-200 font-medium max-w-[140px] truncate">
              {activeTaskRunningTitle}
            </span>
            <span className="font-mono font-bold text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded">
              {formatTime(activeTaskSeconds)}
            </span>
            {onToggleActiveTimer && (
              <button
                onClick={onToggleActiveTimer}
                className="p-1 hover:bg-indigo-800 rounded-full text-indigo-300 transition-colors"
                title="Pause active timer"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('yearHistory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'yearHistory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1-Year History</span>
            <span className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-bold">
              365d
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('codeGuide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'codeGuide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Next.js, Supabase SQL, Clerk & Env Code Docs"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">SQL & Code</span>
          </button>
        </nav>

        {/* Right Controls & User Profile */}
        <div className="flex items-center gap-2">
          
          {/* Quick AI Insights Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm transition-all"
            title="AI Task Breakdown & Productivity Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Insights</span>
          </button>

          {/* Quick Add Task Button */}
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md hover:shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Task</span>
          </button>

          {/* Auth / Profile button */}
          <button
            onClick={() => onOpenProfile ? onOpenProfile() : onOpenAuthModal()}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all cursor-pointer"
            title={user.isSignedIn ? `View Profile (${user.email})` : "Sign In / Account"}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full ring-1 ring-indigo-400 object-cover"
            />
            <span className="font-medium hidden md:inline max-w-[90px] truncate">
              {user.name}
            </span>
            {user.isSignedIn ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded font-mono">
                Guest
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
