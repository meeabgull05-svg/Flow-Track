import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  TrendingUp, 
  Calendar, 
  BarChart2, 
  Plus, 
  FolderPlus, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ArrowRight,
  Folder,
  Sparkles,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';
import { NavTab } from './Sidebar';

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
  onNavigateTab?: (tab: NavTab) => void;
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
  onNavigateTab,
  user,
}) => {
  // Local States
  const [timeOverviewFilter, setTimeOverviewFilter] = useState<'This Week' | 'This Month' | 'Today'>('This Week');
  const [newTaskInput, setNewTaskInput] = useState('');

  // Active or Default Running Task
  const activeTask = tasks.find((t) => t.id === activeTimerTaskId) || tasks[0];

  // Helper for digital timer formatting
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

  const timerDigits = formatTimerDigits(activeTask ? activeTask.time_spent_seconds : 8305); // Default 02:18:25 if 8305s

  // Quick inline add task handler
  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onOpenAddTask();
    setNewTaskInput('');
  };

  // Static Projects Overview Data
  const projectsOverview = [
    { name: 'FlowTrack Website', spent: '32h', goal: '40h', progress: 80, color: 'bg-[#635BFF]', bgLight: 'bg-purple-50' },
    { name: 'Client Dashboard', spent: '18h', goal: '25h', progress: 72, color: 'bg-emerald-500', bgLight: 'bg-emerald-50' },
    { name: 'Mobile App', spent: '24h', goal: '30h', progress: 80, color: 'bg-amber-500', bgLight: 'bg-amber-50' },
    { name: 'Marketing Site', spent: '10h', goal: '15h', progress: 66, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
  ];

  // Upcoming Schedule Items
  const upcomingSchedule = [
    {
      time: '10:30 AM',
      title: 'Design Review',
      project: 'FlowTrack Project',
      iconBg: 'bg-purple-100 text-[#635BFF]',
      cardBg: 'bg-purple-50/60 border-purple-100/80',
    },
    {
      time: '02:00 PM',
      title: 'Team Meeting',
      project: 'Weekly Sync',
      iconBg: 'bg-emerald-100 text-emerald-600',
      cardBg: 'bg-emerald-50/60 border-emerald-100/80',
    },
    {
      time: '04:00 PM',
      title: 'Client Call',
      project: 'Client Dashboard Project',
      iconBg: 'bg-amber-100 text-amber-600',
      cardBg: 'bg-amber-50/60 border-amber-100/80',
    },
  ];

  // Chart Coordinates for Line Chart (Mon to Sun)
  const chartPoints = [
    { day: 'Mon', val: 2.2, x: 50, y: 150 },
    { day: 'Tue', val: 4.8, x: 120, y: 100 },
    { day: 'Wed', val: 3.5, x: 190, y: 125 },
    { day: 'Thu', val: 6.2, x: 260, y: 70 },
    { day: 'Fri', val: 4.5, x: 330, y: 105 },
    { day: 'Sat', val: 7.2, x: 400, y: 50 },
    { day: 'Sun', val: 5.8, x: 470, y: 80 },
  ];

  // Build smooth SVG curve path string
  const svgPathD = `M ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const svgAreaD = `M 50,190 L ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')} L 470,190 Z`;

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* 1. Header Row (Greeting + Date Selector) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good Morning, Everyone! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Stay focused and track your progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Picker Button */}
          <button className="px-4 py-2 bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl text-xs font-bold text-slate-700 shadow-xs transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#635BFF]" />
            <span>May 9, 2024</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Time Today */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-[#635BFF]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Time Today
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">
                6h 24m
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">of 8h goal</p>
            </div>
            <span className="text-xs font-extrabold text-[#635BFF]">80%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
            <div className="bg-[#635BFF] h-2 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Card 2: Time This Week */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Time This Week
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">
                32h 15m
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">of 40h goal</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600">80%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Card 3: Time This Month */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Time This Month
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">
                128h 45m
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">of 160h goal</p>
            </div>
            <span className="text-xs font-extrabold text-blue-600">80%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Card 4: Productivity */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Productivity
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">
                94%
              </span>
              <p className="text-[11px] text-amber-600 font-bold mt-0.5">Excellent</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '94%' }} />
          </div>
        </div>

      </div>

      {/* 3. Middle Section: Current Task + Today's Tasks + Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Box 1: Current Task (Solid Indigo Card) - 5 Cols */}
        <div className="lg:col-span-5 bg-[#635BFF] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
          
          {/* Subtle Accent Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block mb-3">
              Current Task
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {activeTask ? activeTask.title : 'UI/UX Design'}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-xs text-purple-100/90 font-medium">
              <Folder className="w-4 h-4 text-purple-200" />
              <span>FlowTrack Website Redesign</span>
            </div>
          </div>

          {/* Digital Timer Clock Display + Floating Control Button */}
          <div className="relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5">
            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider text-white">
                {timerDigits.hours}:{timerDigits.minutes}:{timerDigits.seconds}
              </div>
              <div className="flex gap-6 text-[10px] font-bold text-purple-200 uppercase tracking-widest mt-1">
                <span>hr</span>
                <span>min</span>
                <span>sec</span>
              </div>
            </div>

            {/* Glowing Pause/Play Button */}
            {activeTask && (
              <button
                onClick={() => onToggleTimer(activeTask.id)}
                className="w-12 h-12 rounded-2xl bg-white text-[#635BFF] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center shrink-0"
              >
                {activeTimerTaskId === activeTask.id ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            )}
          </div>

          {/* Bottom Row */}
          <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-purple-100 pt-2 border-t border-white/10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tracking time
            </span>

            <button 
              onClick={() => activeTask && onOpenEditTask(activeTask)}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Box 2: Today's Tasks - 4 Cols */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Today's Tasks</h3>
              <button 
                onClick={() => onNavigateTab ? onNavigateTab('tracker') : onOpenAddTask()}
                className="text-xs font-bold text-[#635BFF] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 4).map((task, idx) => {
                const colors = ['bg-[#635BFF]', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500'];
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <span className={`w-3 h-3 rounded-full ${colors[idx % colors.length]} shrink-0 inline-block`} />
                        )}
                      </button>

                      <span className={`text-xs font-bold truncate ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-500 shrink-0 ml-2">
                      {formatDuration(task.time_spent_seconds)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add a new task quick button */}
          <form onSubmit={handleQuickAddTask} className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button type="submit" className="p-1 text-slate-400 hover:text-[#635BFF]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

        {/* Box 3: Upcoming Schedule - 3 Cols */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Upcoming Schedule</h3>
              <button 
                onClick={() => onNavigateTab ? onNavigateTab('tracker') : null}
                className="text-xs font-bold text-[#635BFF] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {upcomingSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${item.cardBg} transition-transform hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-lg ${item.iconBg}`}>
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">
                      {item.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.project}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Lower Section Grid: Projects Overview + Time Overview (Chart) + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Projects Overview - 4 Cols */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Projects Overview</h3>
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('projects') : null}
              className="text-xs font-bold text-[#635BFF] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {projectsOverview.map((proj, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-lg ${proj.color} flex items-center justify-center text-white text-[9px]`}>
                      ■
                    </span>
                    <span className="text-slate-800">{proj.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">
                    {proj.spent} / <span className="text-slate-400">{proj.goal}</span>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${proj.color}`} style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Time Overview (Line Chart) - 5 Cols */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Time Overview</h3>
            
            <button className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1">
              <span>{timeOverviewFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-48 pt-2">
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-slate-300 pointer-events-none">
              <div className="border-b border-slate-100 w-full flex justify-between"><span>8h</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>6h</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>4h</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>2h</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>0h</span></div>
            </div>

            <svg viewBox="0 0 520 200" className="w-full h-full overflow-visible relative z-10">
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#635BFF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={svgAreaD} fill="url(#purpleGradient)" />

              {/* Line path */}
              <path
                d={svgPathD}
                fill="none"
                stroke="#635BFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Dots */}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-[#635BFF] stroke-white stroke-2 group-hover:r-7 transition-all"
                  />
                  {/* Tooltip on hover */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-[#635BFF] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {pt.val}h
                  </text>
                </g>
              ))}
            </svg>

            {/* X-Axis Days */}
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-2">
              {chartPoints.map(p => (
                <span key={p.day}>{p.day}</span>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Today's Goal + Quick Actions + Quote - 3 Cols */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Today's Goal */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">Today's Goal</h3>
              <span className="text-xs font-mono font-bold text-slate-500">7 / 8 Hours</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#635BFF] h-2 rounded-full" style={{ width: '87%' }} />
            </div>

            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span>You're doing great! Keep it up!</span>
              <span>🚀</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Quick Actions</h3>

            <div className="grid grid-cols-3 gap-2">
              
              <button
                onClick={onOpenAddTask}
                className="p-3 bg-purple-50 hover:bg-purple-100/80 rounded-2xl text-center space-y-1.5 transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-xl bg-purple-100 text-[#635BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">New Task</span>
              </button>

              <button
                onClick={onOpenAddTask}
                className="p-3 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl text-center space-y-1.5 transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">New Project</span>
              </button>

              <button
                onClick={() => activeTask && onToggleTimer(activeTask.id)}
                className="p-3 bg-indigo-50 hover:bg-indigo-100/80 rounded-2xl text-center space-y-1.5 transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">Start Timer</span>
              </button>

            </div>
          </div>

          {/* Quote Banner */}
          <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-100/80 relative overflow-hidden space-y-2">
            <span className="text-2xl font-serif text-[#635BFF] block leading-none">“</span>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed italic -mt-2">
              Focus on progress, not perfection.
            </p>
            <span className="text-[10px] font-bold text-slate-400 block">— Unknown</span>
          </div>

        </div>

      </div>

    </div>
  );
};
