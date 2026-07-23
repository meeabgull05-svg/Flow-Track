import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Edit3, 
  Plus, 
  Paperclip, 
  Maximize2, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  FileText, 
  Clock, 
  Sparkles,
  Check,
  Folder,
  Tag as TagIcon
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface TrackerViewProps {
  tasks: Task[];
  activeTimerTaskId: string | null;
  onToggleTimer: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenEditTask: (task: Task) => void;
  user: UserProfile;
}

interface NoteItem {
  id: string;
  text: string;
  timestamp: string;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  tasks,
  activeTimerTaskId,
  onToggleTimer,
  onToggleComplete,
  onDeleteTask,
  onOpenAddTask,
  onOpenEditTask,
  user
}) => {
  // State for selected project & task filter
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'Notes' | 'Breaks' | 'Screenshots'>('Notes');
  
  // Note input state
  const [noteInput, setNoteInput] = useState<string>('');
  const [notesList, setNotesList] = useState<NoteItem[]>([
    {
      id: 'note_1',
      text: 'Working on the new dashboard UI. Designing charts and stats section.',
      timestamp: '10:30 AM'
    },
    {
      id: 'note_2',
      text: 'Completed primary wireframes for mobile responsiveness and sidebar tabs.',
      timestamp: '08:45 AM'
    }
  ]);

  // Break tracker state
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakSeconds, setBreakSeconds] = useState<number>(0);

  // Active or top task for current timer display
  const currentTask = tasks.find(t => t.id === activeTimerTaskId) || tasks[0] || {
    id: 'default_task',
    title: 'UI Design',
    category: 'FlowTrack Website Redesign',
    tags: ['FlowTrack Project', 'Design'],
    time_spent_seconds: 8325, // 02:18:45
    status: 'In Progress'
  };

  const isRunning = activeTimerTaskId === currentTask.id;

  // Time conversion
  const formatTimerDigits = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s)
    };
  };

  const timerDigits = formatTimerDigits(currentTask ? currentTask.time_spent_seconds : 0);

  // Calculate circular stroke progress
  const maxGoalSeconds = 8 * 3600; // 8 hours goal
  const totalSecondsLoggedToday = tasks.reduce((sum, t) => sum + t.time_spent_seconds, 0) || 22500; // ~6h 15m
  const progressPercent = Math.min(100, Math.round((totalSecondsLoggedToday / maxGoalSeconds) * 100));

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotesList(prev => [
      { id: `note_${Date.now()}`, text: noteInput.trim(), timestamp: timeStr },
      ...prev
    ]);
    setNoteInput('');
  };

  // Projects data mock
  const projectsData = [
    { name: 'FlowTrack Website', time: '32h 45m', color: 'bg-[#635BFF]', percent: 75 },
    { name: 'WeVersity Platform', time: '18h 20m', color: 'bg-emerald-500', percent: 55 },
    { name: 'Client Dashboard', time: '12h 10m', color: 'bg-amber-500', percent: 38 },
    { name: 'Mobile App Design', time: '8h 30m', color: 'bg-blue-500', percent: 25 },
  ];

  // Time entries list for table
  const timeEntries = [
    {
      id: tasks[0]?.id || '1',
      title: tasks[0]?.title || 'UI Design',
      project: 'FlowTrack Website',
      tags: ['Design'],
      tagColor: 'bg-purple-100 text-purple-700',
      duration: formatDuration(tasks[0]?.time_spent_seconds || 8325), // 02:18:45
      timeRange: '9:00 AM – 11:18 AM',
      isRunning: activeTimerTaskId === tasks[0]?.id,
    },
    {
      id: tasks[1]?.id || '2',
      title: tasks[1]?.title || 'Wireframing',
      project: 'FlowTrack Website',
      tags: ['Design'],
      tagColor: 'bg-purple-100 text-purple-700',
      duration: '01:45:20',
      timeRange: '7:00 AM – 8:45 AM',
      isRunning: activeTimerTaskId === tasks[1]?.id,
    },
    {
      id: tasks[2]?.id || '3',
      title: tasks[2]?.title || 'Team Meeting',
      project: 'Internal',
      tags: ['Meeting'],
      tagColor: 'bg-amber-100 text-amber-700',
      duration: '00:45:00',
      timeRange: '5:45 AM – 6:30 AM',
      isRunning: activeTimerTaskId === tasks[2]?.id,
    },
    {
      id: tasks[3]?.id || '4',
      title: tasks[3]?.title || 'Research',
      project: 'FlowTrack Website',
      tags: ['Research'],
      tagColor: 'bg-blue-100 text-blue-700',
      duration: '01:10:15',
      timeRange: '4:30 AM – 5:40 AM',
      isRunning: activeTimerTaskId === tasks[3]?.id,
    },
    {
      id: tasks[4]?.id || '5',
      title: tasks[4]?.title || 'Home Page Design',
      project: 'FlowTrack Website',
      tags: ['Design'],
      tagColor: 'bg-purple-100 text-purple-700',
      duration: '01:20:30',
      timeRange: '2:30 AM – 3:50 AM',
      isRunning: activeTimerTaskId === tasks[4]?.id,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Time Tracker
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Track time, stay productive and achieve more.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddTask}
            className="px-4 py-2 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#635BFF]/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Top Row: Current Task Stopwatch Arc (70%) + Today Overview Gauge (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Current Task & Circular Timer */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Task
              </span>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentTask.title}
                </h2>
                <button 
                  onClick={() => onOpenEditTask(currentTask as Task)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Edit task title"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>{currentTask.category || 'FlowTrack Website Redesign'}</span>
              </div>
            </div>

            {/* Top Right Quick Icons */}
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Circular Timer Arc & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-2">
            
            {/* Left side tags */}
            <div className="hidden md:flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Task Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                  FlowTrack Project
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Design
                </span>
                <button className="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Tag
                </button>
              </div>
            </div>

            {/* Center Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center relative">
              
              {/* SVG Ring */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-slate-100"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Active Gradient Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-[#635BFF] transition-all duration-500"
                    strokeWidth="6"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * (isRunning ? 75 : 45)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Ring Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  
                  {/* Status Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                    isRunning 
                      ? 'bg-purple-100 text-[#635BFF] ring-2 ring-purple-300/30' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#635BFF] animate-ping' : 'bg-slate-400'}`} />
                    {isRunning ? 'Tracking' : 'Paused'}
                  </span>

                  {/* Digital Clock */}
                  <div className="text-3xl font-mono font-black text-slate-900 tracking-wider">
                    {timerDigits.hours}:{timerDigits.minutes}:{timerDigits.seconds}
                  </div>

                  {/* Sub labels */}
                  <div className="flex gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                  </div>

                  {/* Add note inner button */}
                  <button 
                    onClick={() => {
                      const noteBox = document.getElementById('note-textarea');
                      if (noteBox) noteBox.focus();
                    }}
                    className="mt-2 text-[11px] font-bold text-[#635BFF] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Add Note
                  </button>

                </div>
              </div>

            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col gap-2.5 w-full md:w-auto">
              <button
                onClick={() => onToggleTimer(currentTask.id)}
                className={`w-full py-3 px-5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                  isRunning
                    ? 'bg-[#635BFF] hover:bg-[#5249ea] text-white shadow-[#635BFF]/30'
                    : 'bg-[#635BFF] hover:bg-[#5249ea] text-white shadow-[#635BFF]/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleComplete(currentTask.id)}
                className="w-full py-2.5 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Square className="w-3.5 h-3.5 fill-slate-700" />
                <span>Stop</span>
              </button>

              <button
                onClick={() => setIsOnBreak(!isOnBreak)}
                className={`w-full py-2.5 px-5 border rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isOnBreak
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>{isOnBreak ? 'End Break' : 'Add Break'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Card: Today Overview */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Today Overview</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline">View Report</button>
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-[#635BFF]"
                    strokeWidth="8"
                    strokeDasharray={251}
                    strokeDashoffset={251 - (251 * progressPercent) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black font-mono text-slate-900">6.2</span>
                  <span className="text-[10px] font-bold text-slate-400">/ 8 hrs</span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-xs font-extrabold text-slate-900">{progressPercent}%</span>
                <span className="text-xs text-slate-500 font-medium ml-1">of daily goal</span>
              </div>
            </div>

            {/* Time logged & remaining stats */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Time Logged</span>
                <span className="text-slate-900 font-mono font-bold">6h 15m</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Remaining</span>
                <span className="text-purple-600 font-mono font-bold">1h 45m</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Middle Row: Time Entries Table (70%) + Projects & Productivity Trend (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Time Entries Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">Time Entries</h3>

            {/* Date Navigator */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1">
              <button className="p-1 hover:bg-white rounded-lg text-slate-500 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-800">Today, May 24</span>
              <button className="p-1 hover:bg-white rounded-lg text-slate-500 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
            >
              <option value="All">All Projects</option>
              <option value="FlowTrack Website">FlowTrack Website</option>
              <option value="WeVersity Platform">WeVersity Platform</option>
              <option value="Client Dashboard">Client Dashboard</option>
            </select>

            <select
              value={selectedTaskFilter}
              onChange={(e) => setSelectedTaskFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
            >
              <option value="All">All Tasks</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
            </select>

            <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">TASK</th>
                  <th className="pb-3 font-semibold">PROJECT</th>
                  <th className="pb-3 font-semibold">TAGS</th>
                  <th className="pb-3 font-semibold">DURATION</th>
                  <th className="pb-3 font-semibold">TIME</th>
                  <th className="pb-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Task Title with Play icon */}
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <button
                        onClick={() => onToggleTimer(entry.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          entry.isRunning
                            ? 'bg-[#635BFF] text-white shadow-sm'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {entry.isRunning ? (
                          <Pause className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        )}
                      </button>
                      <span className={entry.isRunning ? 'text-[#635BFF]' : 'text-slate-900'}>
                        {entry.title}
                      </span>
                    </td>

                    {/* Project */}
                    <td className="py-3 text-slate-600 font-medium">{entry.project}</td>

                    {/* Tags */}
                    <td className="py-3">
                      <div className="flex gap-1">
                        {entry.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.tagColor}`}
                          >
                            ● {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {entry.duration}
                    </td>

                    {/* Time Range */}
                    <td className="py-3 text-slate-500 font-medium">
                      {entry.timeRange}
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 text-xs font-bold">
                  <td colSpan={3} className="pt-3 text-slate-700">Total</td>
                  <td className="pt-3 font-mono text-[#635BFF] font-black text-sm">07:19:50</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

        </div>

        {/* Right Column: Projects & Productivity Trend */}
        <div className="space-y-6">
          
          {/* Projects Summary */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Projects</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {projectsData.map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-900">{p.name}</span>
                    <span className="font-mono text-slate-700">{p.time}</span>
                  </div>
                  <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                    <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Trend Chart */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Productivity Trend</h3>
              <select className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Smooth area chart */}
            <div className="w-full h-36 pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid line */}
                <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" />

                {/* Area path */}
                <path
                  d="M0 70 Q50 50 100 60 T200 40 T300 20 L300 100 L0 100 Z"
                  fill="url(#trendGradient)"
                />

                {/* Stroke line */}
                <path
                  d="M0 70 Q50 50 100 60 T200 40 T300 20"
                  fill="none"
                  stroke="#635BFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Points */}
                <circle cx="0" cy="70" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="50" cy="55" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="100" cy="60" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="150" cy="45" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="200" cy="40" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="250" cy="75" r="3.5" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
                <circle cx="300" cy="20" r="4" fill="#635BFF" stroke="#fff" strokeWidth="1.5" />
              </svg>

              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
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

      </div>

      {/* 4. Bottom Row: Notes / Breaks / Screenshots & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Notes / Breaks input box */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
            {(['Notes', 'Breaks', 'Screenshots'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-extrabold transition-all relative ${
                  activeTab === tab
                    ? 'text-[#635BFF]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#635BFF] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Notes Input Tab Content */}
          {activeTab === 'Notes' && (
            <div className="space-y-3">
              <textarea
                id="note-textarea"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write a note about your work..."
                rows={3}
                className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddNote}
                  className="px-5 py-2 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs font-bold shadow-md shadow-[#635BFF]/20 transition-all"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Breaks Tab Content */}
          {activeTab === 'Breaks' && (
            <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600" />
                <span>Break Management</span>
              </div>
              <p>
                Taking regular breaks improves focus and prevents burnout. Click "Add Break" in the timer widget above to record your break time.
              </p>
            </div>
          )}

          {/* Screenshots Tab Content */}
          {activeTab === 'Screenshots' && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 text-center space-y-2">
              <p className="font-semibold">Automated Activity Capture</p>
              <p className="text-slate-400">No screenshots captured in this session.</p>
            </div>
          )}

        </div>

        {/* Right Column: Recent Notes */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Notes</h3>
            <button className="text-xs font-semibold text-[#635BFF] hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-medium">
                  <FileText className="w-4 h-4 text-[#635BFF] shrink-0 mt-0.5" />
                  <span>{note.text}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 text-right">
                  {note.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
