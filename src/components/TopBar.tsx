import React from 'react';
import { Search, Bell, HelpCircle, Menu, Sparkles, Plus, CheckCircle2, Pause } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  user: UserProfile;
  onOpenAuthModal: () => void;
  onOpenAddTask: () => void;
  onOpenAiModal: () => void;
  isTimerRunning?: boolean;
  activeTaskRunningTitle?: string;
  activeTaskSeconds?: number;
  onToggleActiveTimer?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileSidebar,
  user,
  onOpenAuthModal,
  onOpenAddTask,
  onOpenAiModal,
  isTimerRunning,
  activeTaskRunningTitle,
  activeTaskSeconds = 0,
  onToggleActiveTimer,
}) => {
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      
      {/* Left side: Mobile menu toggle + Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/70 focus:bg-white border border-transparent focus:border-purple-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Center: Running Timer Indicator if Active */}
      {isTimerRunning && activeTaskRunningTitle && (
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-purple-900 font-semibold max-w-[140px] truncate">
            {activeTaskRunningTitle}
          </span>
          <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-xs">
            {formatTime(activeTaskSeconds)}
          </span>
          {onToggleActiveTimer && (
            <button
              onClick={onToggleActiveTimer}
              className="p-1 hover:bg-purple-200 rounded-full text-purple-700 transition-colors"
              title="Pause timer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Right side: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* AI Assistant Button */}
        <button
          onClick={onOpenAiModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Insights</span>
        </button>

        {/* Quick New Task Button */}
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#635BFF] hover:bg-[#5249ea] text-white shadow-md shadow-[#635BFF]/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Help icon */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile Button */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-all text-left"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-100"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>{user.name}</span>
              <CheckCircle2 className="w-3 h-3 text-[#635BFF]" />
            </div>
            <div className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
              {user.role}
            </div>
          </div>
        </button>

      </div>

    </header>
  );
};
