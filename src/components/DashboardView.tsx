import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FolderPlus, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Filter,
  RefreshCw,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { Task, TimeFilter, Category, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface DashboardViewProps {
  tasks: Task[];
  activeTimerTaskId: string | null;
  onToggleTimer: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenEditTask: (task: Task) => void;
  onOpenAiModal: () => void;
  onSeedData: () => void;
  user: UserProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  activeTimerTaskId,
  onToggleTimer,
  onToggleComplete,
  onDeleteTask,
  onOpenAddTask,
  onOpenEditTask,
  onOpenAiModal,
  onSeedData,
  user,
}) => {
  // Local states
  const [timeOverviewFilter, setTimeOverviewFilter] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(15);

  // Active task details for the Current Task widget
  const currentRunningTask = tasks.find((t) => t.id === activeTimerTaskId) || tasks[0];

  // Helper to format timer into HH : MM : SS
  const formatTimerDigits = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s),
    };
  };

  const timerDigits = formatTimerDigits(currentRunningTask ? currentRunningTask.time_spent_seconds : 0);

  // Projects summary
  const projects = [
    { name: 'FlowTrack', time: '32h', tasks: 14, color: 'bg-purple-500', progress: 75 },
    { name: 'WeVersity', time: '58h', tasks: 27, color: 'bg-emerald-500', progress: 85 },
    { name: 'Client Dashboard', time: '18h', tasks: 9, color: 'bg-blue-500', progress: 60 },
    { name: 'Mobile App', time: '24h', tasks: 12, color: 'bg-amber-500', progress: 40 },
  ];

  // Upcoming Schedule items
  const upcomingSchedule = [
    {
      time: '10:30 AM',
      title: 'Design Review',
      project: 'FlowTrack Project',
      bgColor: 'bg-purple-50 border-purple-100 text-purple-900',
      tagColor: 'bg-purple-200 text-purple-800',
    },
    {
      time: '02:00 PM',
      title: 'Team Meeting',
      project: 'Weekly Sync',
      bgColor: 'bg-emerald-50 border-emerald-100 text-emerald-900',
      tagColor: 'bg-emerald-200 text-emerald-800',
    },
    {
      time: '04:00 PM',
      title: 'Client Call',
      project: 'Client Dashboard',
      bgColor: 'bg-amber-50 border-amber-100 text-amber-900',
      tagColor: 'bg-amber-200 text-amber-800',
    },
  ];

  // Calendar dates generation (May 2024 / current month)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Greeting Banner Section */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Abstract Background Accents */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Today, May 15 • Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Track your work. Achieve more. You have <span className="font-bold text-white">4 focus tasks</span> scheduled for today.
          </p>
        </div>

        {/* Right Banner Quick Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={onSeedData}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-semibold transition-all flex items-center gap-2"
            title="Populate 1 year sample data for charts"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
            <span>Seed 1-Year Data</span>
          </button>

          <button
            onClick={onOpenAddTask}
            className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#635BFF]/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
        </div>

      </div>

      {/* 2. Top 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Hours Today */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hours Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#635BFF] flex items-center justify-center font-bold text-xs">
              78%
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              6.2 h
            </span>
            <span className="text-xs text-slate-400 font-medium">of 8h goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-[#635BFF] h-2 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* Card 2: Hours This Week */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hours This Week
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              81%
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              32.5 h
            </span>
            <span className="text-xs text-slate-400 font-medium">of 40h goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '81%' }} />
          </div>
        </div>

        {/* Card 3: Hours This Month */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hours This Month
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              80%
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              128 h
            </span>
            <span className="text-xs text-slate-400 font-medium">of 160h goal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Card 4: Productivity */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Productivity
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +6%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              94%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Excellent</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '94%' }} />
          </div>
        </div>

      </div>

      {/* 3. Middle Grid: Current Task Stopwatch + Today's Activity + Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget A: Current Task (Giant Stopwatch) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                <span>Current Task</span>
              </h3>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Pastel Box */}
            <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-5 text-center space-y-4">
              
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] animate-ping" />
                <span className="text-xs font-bold text-slate-800">
                  {currentRunningTask ? currentRunningTask.title : 'FlowTrack Website'}
                </span>
                <span className="px-2 py-0.5 bg-purple-200/80 text-purple-900 rounded-full text-[10px] font-bold">
                  {currentRunningTask ? currentRunningTask.category : 'UI Design'}
                </span>
              </div>

              {/* Giant Stopwatch Digital Display */}
              <div className="py-2">
                <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900 tracking-wider">
                  {timerDigits.hours} : {timerDigits.minutes} : {timerDigits.seconds}
                </div>
                <div className="flex justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <span>Hours</span>
                  <span>Minutes</span>
                  <span>Seconds</span>
                </div>
              </div>

            </div>
          </div>

          {/* Stopwatch Controls */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <button
              onClick={() => currentRunningTask && onToggleTimer(currentRunningTask.id)}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                activeTimerTaskId === currentRunningTask?.id
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-[#635BFF] hover:bg-[#5249ea] text-white'
              }`}
            >
              {activeTimerTaskId === currentRunningTask?.id ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={() => activeTimerTaskId && onToggleTimer(activeTimerTaskId)}
              className="py-3 px-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>

            <button
              onClick={() => {
                if (currentRunningTask) {
                  onToggleComplete(currentRunningTask.id);
                }
              }}
              className="py-3 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        </div>

        {/* Widget B: Today's Activity */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Today's Activity</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> UI Design
                  </span>
                  <span className="text-slate-900 font-mono">2h 30m</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Development
                  </span>
                  <span className="text-slate-900 font-mono">1h 15m</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Meeting
                  </span>
                  <span className="text-slate-900 font-mono">45m</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Research
                  </span>
                  <span className="text-slate-900 font-mono">30m</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Tracked Today</span>
            <span className="font-mono font-bold text-slate-900">5h 00m</span>
          </div>
        </div>

        {/* Widget C: Upcoming Schedule */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Upcoming Schedule</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline">View all</button>
            </div>

            <div className="space-y-3">
              {upcomingSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${item.bgColor} transition-transform hover:-translate-y-0.5`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                      {item.time}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.tagColor}`}>
                      Upcoming
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold">{item.title}</h4>
                  <p className="text-[11px] opacity-75 mt-0.5">{item.project}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenAddTask}
            className="w-full mt-4 py-2.5 border border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule New Entry
          </button>
        </div>

      </div>

      {/* 4. Lower Grid: Projects List + Recent Tasks Table + Right Column (Calendar & Goals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Projects & Recent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Projects Overview */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Projects</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline">View all</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${proj.color}`} />
                      <span className="text-sm font-bold text-slate-900">{proj.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">{proj.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{proj.tasks} Tasks</span>
                    <span>{proj.progress}% completed</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                    <div className={`${proj.color} h-1.5 rounded-full`} style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks Table */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Tasks</h3>
              <button onClick={onOpenAddTask} className="text-xs font-bold text-[#635BFF] flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Task</th>
                    <th className="pb-3 font-semibold">Project</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className="text-slate-400 hover:text-emerald-600"
                        >
                          {task.status === 'Completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span className={task.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                          {task.title}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 font-medium">{task.category}</td>
                      <td className="py-3 font-mono text-slate-700">{formatDuration(task.time_spent_seconds)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : activeTimerTaskId === task.id
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500'
                                : activeTimerTaskId === task.id
                                ? 'bg-[#635BFF] animate-ping'
                                : 'bg-slate-400'
                            }`}
                          />
                          {task.status === 'Completed' ? 'Completed' : activeTimerTaskId === task.id ? 'Running' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onToggleTimer(task.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#635BFF] hover:bg-purple-50 transition-colors"
                        >
                          {activeTimerTaskId === task.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Calendar & Today's Goal */}
        <div className="space-y-6">
          
          {/* Mini Calendar Widget */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">May 2024</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
              {calendarDays.map((day) => {
                const isSelected = selectedCalendarDate === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDate(day)}
                    className={`h-8 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/25'
                        : day === 15
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Goals Widget */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Today's Goal</h3>
              <span className="text-xs font-mono font-extrabold text-[#635BFF]">87%</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Target Time Log</div>
                <div className="text-lg font-black font-mono text-[#635BFF] mt-0.5">7 / 8 Hours</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#635BFF] shadow-xs font-bold text-xs">
                7h
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#635BFF] h-2 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>

          {/* Quick Quote Widget */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
            <Sparkles className="w-5 h-5 text-amber-300 mb-2" />
            <p className="text-xs italic font-medium leading-relaxed opacity-90">
              "Focus on progress, not perfection."
            </p>
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mt-3">
              Daily Motivation
            </div>
          </div>

        </div>

      </div>

      {/* 5. Bottom Time Overview SVG Chart */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Time Overview</h3>
            <p className="text-xs text-slate-400">Track your daily focus activity over time</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Day', 'Week', 'Month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimeOverviewFilter(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeOverviewFilter === mode
                    ? 'bg-[#635BFF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="w-full h-48 pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#635BFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="#e2e8f0" />

            {/* Area fill */}
            <path
              d="M0 140 L0 80 Q100 30 200 60 T400 30 T600 90 L700 40 L700 140 Z"
              fill="url(#chartGradient)"
            />

            {/* Curve line */}
            <path
              d="M0 80 Q100 30 200 60 T400 30 T600 90 L700 40"
              fill="none"
              stroke="#635BFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data points */}
            <circle cx="0" cy="80" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="116" cy="45" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="233" cy="60" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="350" cy="30" r="6" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="466" cy="70" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="583" cy="90" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
            <circle cx="700" cy="40" r="5" fill="#635BFF" stroke="#fff" strokeWidth="2" />
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

      </div>

    </div>
  );
};
