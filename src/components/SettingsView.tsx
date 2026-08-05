import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Clock, 
  Volume2, 
  Sliders, 
  Globe, 
  Save, 
  Check, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BellOff,
  VolumeX,
  Calendar,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  themeMode?: 'light' | 'dark' | 'sunset' | 'system';
  setThemeMode?: (mode: 'light' | 'dark' | 'sunset' | 'system') => void;
  accentColor?: string;
  setAccentColor?: (color: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  user,
  themeMode: propThemeMode,
  setThemeMode: propSetThemeMode,
  accentColor: propAccentColor,
  setAccentColor: propSetAccentColor
}) => {
  // Theme Mode local or lifted state
  const [localThemeMode, setLocalThemeMode] = useState<'light' | 'dark' | 'sunset' | 'system'>(() => {
    return (localStorage.getItem('flowtrack_theme_mode') as any) || 'light';
  });

  const themeMode = propThemeMode ?? localThemeMode;
  const handleThemeChange = (mode: 'light' | 'dark' | 'sunset' | 'system') => {
    if (propSetThemeMode) {
      propSetThemeMode(mode);
    }
    setLocalThemeMode(mode);
  };

  // Accent Color local or lifted state
  const [localAccentColor, setLocalAccentColor] = useState<string>(() => {
    return localStorage.getItem('flowtrack_accent_color') || '#3C83F6';
  });

  const accentColor = propAccentColor ?? localAccentColor;
  const handleAccentChange = (col: string) => {
    if (propSetAccentColor) {
      propSetAccentColor(col);
    }
    setLocalAccentColor(col);
  };

  // UI Density
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>(() => {
    return (localStorage.getItem('flowtrack_ui_density') as any) || 'comfortable';
  });

  // Timer Preferences
  const [defaultEstimateMinutes, setDefaultEstimateMinutes] = useState<number>(30);
  const [autoPauseIdle, setAutoPauseIdle] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [startOfWeek, setStartOfWeek] = useState<'monday' | 'sunday'>('monday');

  // Notification Toggles
  const [dailyGoalAlerts, setDailyGoalAlerts] = useState<boolean>(true);
  const [desktopReminders, setDesktopReminders] = useState<boolean>(false);
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true);

  // Toast Feedback State
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Apply theme class to document html element when changed
  useEffect(() => {
    try {
      localStorage.setItem('flowtrack_theme_mode', themeMode);
      localStorage.setItem('flowtrack_accent_color', accentColor);
      localStorage.setItem('flowtrack_ui_density', density);

      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'sunset');

      if (themeMode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(themeMode);
      }
    } catch (e) {
      console.error(e);
    }
  }, [themeMode, density]);

  const handleSaveSettings = () => {
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };

  const handleResetDefaults = () => {
    handleThemeChange('light');
    handleAccentChange('#3C83F6');
    setDensity('comfortable');
    setDefaultEstimateMinutes(30);
    setAutoPauseIdle(true);
    setSoundEnabled(true);
    setTimeFormat('12h');
    setStartOfWeek('monday');
    setDailyGoalAlerts(true);
    setDesktopReminders(false);
    setWeeklyDigest(true);

    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };

  const ACCENT_COLORS = [
    { name: 'Flow Blue', hex: '#3C83F6', bgClass: 'bg-[#3C83F6]' },
    { name: 'Emerald', hex: '#10B981', bgClass: 'bg-emerald-500' },
    { name: 'Violet', hex: '#8B5CF6', bgClass: 'bg-violet-500' },
    { name: 'Indigo', hex: '#6366F1', bgClass: 'bg-indigo-500' },
    { name: 'Rose', hex: '#F43F5E', bgClass: 'bg-rose-500' },
    { name: 'Amber', hex: '#F59E0B', bgClass: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Toast Saved Notification */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold">Settings Saved!</p>
            <p className="text-[11px] text-slate-300 font-medium">Your preferences have been updated successfully.</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#3C83F6] rounded-2xl border border-blue-100">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Preferences & Settings</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Customize app appearance, theme color, timer defaults, and notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 bg-[#3C83F6] hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 1: THEME & VISUAL APPEARANCE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#3C83F6]" />
              <span>Theme & Appearance</span>
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Customizer</span>
          </div>

          {/* Theme Modes */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Color Theme Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  themeMode === 'light'
                    ? 'border-[#3C83F6] bg-blue-50/70 text-[#3C83F6] shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-4 h-4" />
                  {themeMode === 'light' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Light Mode</span>
                  <span className="text-[10px] opacity-75">Clean & Bright</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  themeMode === 'dark'
                    ? 'border-indigo-500 bg-slate-900 text-white shadow-xs ring-2 ring-indigo-500/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className="w-4 h-4" />
                  {themeMode === 'dark' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Midnight</span>
                  <span className="text-[10px] opacity-75">Dark Canvas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('sunset')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  themeMode === 'sunset'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-900 shadow-xs ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {themeMode === 'sunset' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Sunset</span>
                  <span className="text-[10px] opacity-75">Soft Warm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  themeMode === 'system'
                    ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-xs ring-2 ring-slate-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="w-4 h-4" />
                  {themeMode === 'system' && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">System</span>
                  <span className="text-[10px] opacity-75">Auto Sync</span>
                </div>
              </button>

            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Primary Accent Theme Color</label>
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_COLORS.map((col) => {
                const isSelected = accentColor === col.hex;
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleAccentChange(col.hex)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass} inline-block ring-1 ring-black/10`} />
                    <span>{col.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* UI Layout Density */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Interface Layout Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer text-center ${
                    density === d
                      ? 'border-[#3C83F6] bg-blue-50 text-[#3C83F6]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 2: TIMER & TRACKING PREFERENCES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Timer & Tracking Defaults</span>
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stopwatch Config</span>
          </div>

          {/* Default Task Time Estimate */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Default Task Target Estimate</span>
              <span className="text-[#3C83F6] font-extrabold">{defaultEstimateMinutes} minutes</span>
            </label>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDefaultEstimateMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    defaultEstimateMinutes === mins
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Auto Pause Idle Timer */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-slate-900 block">Auto-Pause Inactive Timer</span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Pause stopwatch after 15 mins of mouse inactivity
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoPauseIdle(!autoPauseIdle)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                autoPauseIdle ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Audio Sound Effect */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>Timer Chime Audio Alert</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Play soft chime audio when reaching target timer estimate
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                soundEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Time & Regional Format */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Time Display Format</label>
              <select
                value={timeFormat}
                onChange={(e: any) => setTimeFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
              >
                <option value="12h">12-Hour (AM / PM)</option>
                <option value="24h">24-Hour (14:30)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">First Day of Week</label>
              <select
                value={startOfWeek}
                onChange={(e: any) => setStartOfWeek(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
              >
                <option value="monday">Monday (Standard)</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>

        </div>

        {/* SECTION 3: NOTIFICATION ALERTS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>Notifications & Reminders</span>
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alerts</span>
          </div>

          <div className="space-y-3">
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-900 block">Daily Work Hours Target Alert</span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Alert me when reaching 8 hours logged for the day
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDailyGoalAlerts(!dailyGoalAlerts)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                  dailyGoalAlerts ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-900 block">Desktop Notification Popups</span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Show browser toast when active timer completes
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDesktopReminders(!desktopReminders)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                  desktopReminders ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-900 block">Weekly Performance Digest</span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Receive weekly summary report of completed tasks
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                  weeklyDigest ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 4: SYSTEM & PREFERENCES SUMMARY */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>Active Profile Context</span>
              </h2>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold rounded-full border border-indigo-200">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Account Role</span>
                <span className="font-extrabold text-slate-900">{user.role}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Active Organization</span>
                <span className="font-extrabold text-slate-900">{user.orgName || 'Workspace'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Storage Sync Status</span>
                <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Local & Storage Active
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">FlowTrack v2.4.0 • Build 2026</span>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
            >
              Apply All Changes
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
