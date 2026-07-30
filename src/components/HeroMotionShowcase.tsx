import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Activity, 
  Zap, 
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export const HeroMotionShowcase: React.FC = () => {
  const [seconds, setSeconds] = useState(6258); // 01:44:18
  const [isRunning, setIsRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<'timer' | 'analytics' | 'team'>('timer');

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyData = [
    { day: 'Mon', hours: 4.5, percent: 65 },
    { day: 'Tue', hours: 6.2, percent: 85 },
    { day: 'Wed', hours: 7.8, percent: 100 },
    { day: 'Thu', hours: 5.4, percent: 75 },
    { day: 'Fri', hours: 6.9, percent: 90 },
    { day: 'Sat', hours: 3.1, percent: 45 },
    { day: 'Sun', hours: 2.0, percent: 30 },
  ];

  const teamMembers = [
    { name: 'Alex Rivera', role: 'Math Faculty', task: 'Algebra II Quiz Sync', time: '01:44:18', active: true, avatarBg: 'bg-blue-500' },
    { name: 'Chloe Wu', role: 'Student Eng.', task: 'Physics Lab Simulation', time: '02:10:45', active: true, avatarBg: 'bg-emerald-500' },
    { name: 'David L.', role: 'Lead Instructor', task: 'Curriculum Planning', time: '00:45:12', active: false, avatarBg: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs h-full flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Top Bar Header with Motion Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          </div>
          <span className="text-[10.5px] font-bold text-slate-500 font-mono ml-1.5 hidden sm:inline">
            flowtrack.app/live-engine
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
          <motion.span 
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
          />
          <span>Live Syncing</span>
        </div>
      </div>

      {/* Motion Mode Selector Tabs */}
      <div className="my-2.5 p-1 bg-slate-100/80 rounded-xl flex items-center gap-1 text-xs shrink-0">
        {[
          { id: 'timer', label: 'Live Stopwatch', icon: Clock },
          { id: 'analytics', label: 'Focus Stats', icon: BarChart3 },
          { id: 'team', label: 'Team Activity', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer z-10 ${
                isActive ? 'text-[#3C83F6]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10 border border-slate-200/60"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Body Content according to activeTab */}
      <div className="flex-1 flex flex-col justify-center py-1 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Live Interactive Stopwatch */}
          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Main Stopwatch Showcase Box */}
              <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 text-slate-900 rounded-xl p-3.5 sm:p-4 shadow-2xs border border-blue-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Active Stopwatch
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-[#3C83F6] border border-blue-200/80 px-2 py-0.5 rounded-md font-mono font-bold">
                    Classroom #104
                  </span>
                </div>

                {/* Digital Clock Display */}
                <div className="flex items-center justify-between my-1">
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-slate-900 flex items-center gap-1">
                      <span>{formatTime(seconds)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      Task: Advanced Physics Homework Sync
                    </p>
                  </div>

                  {/* Interactive Timer Control Buttons */}
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsRunning(!isRunning)}
                      className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
                        isRunning 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs' 
                          : 'bg-[#3C83F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      }`}
                    >
                      {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSeconds(0)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-200/90"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                  <div className="flex justify-between text-[9.5px] text-slate-500 font-mono mb-1 font-semibold">
                    <span>Progress: 75% Goal</span>
                    <span>Target: 02:00:00</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#3C83F6] to-blue-500 rounded-full"
                      animate={{ width: `${Math.min(100, (seconds / 7200) * 100)}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Feature Chips */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-800 truncate">Auto Cloud Save</div>
                    <div className="text-[9px] text-slate-500 truncate">Zero data loss</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-800 truncate">Instant Sync</div>
                    <div className="text-[9px] text-slate-500 truncate">Multi-device live</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Animated Focus Stats / Bar Chart */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#3C83F6]" />
                      <span>Weekly Focus Breakdown</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Total: 35.6 Hours Tracked</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +18% vs Last Week
                  </span>
                </div>

                {/* Animated Bars */}
                <div className="flex items-end justify-between h-28 pt-4 px-2">
                  {weeklyData.map((item, index) => (
                    <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                      <div className="text-[9px] font-bold text-slate-500 group-hover:text-[#3C83F6] transition-colors">
                        {item.hours}h
                      </div>
                      <div className="w-6 sm:w-7 bg-slate-200 rounded-t-lg h-20 flex items-end overflow-hidden p-0.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${item.percent}%` }}
                          transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                          className={`w-full rounded-t-md ${
                            item.percent === 100 
                              ? 'bg-gradient-to-t from-[#3C83F6] to-blue-400' 
                              : 'bg-slate-400 group-hover:bg-[#3C83F6] transition-colors'
                          }`}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-slate-600">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Team Activity Feed */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#3C83F6]" />
                  <span>Active Team Members</span>
                </span>
                <span className="text-[10px] font-extrabold text-[#3C83F6]">3 Online</span>
              </div>

              <div className="space-y-2">
                {teamMembers.map((m, idx) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full ${m.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {m.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{m.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{m.task}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div className="text-xs font-mono font-bold text-[#3C83F6]">{m.time}</div>
                      <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
