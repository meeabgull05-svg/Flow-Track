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
  Zap,
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
  
  // Note input state - initialized empty or per-user saved notes
  const [noteInput, setNoteInput] = useState<string>('');
  const [notesList, setNotesList] = useState<NoteItem[]>(() => {
    try {
      if (user?.email) {
        const saved = localStorage.getItem(`flowtrack_notes_${user.email.toLowerCase().trim()}`);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Save notes per user email
  React.useEffect(() => {
    if (!user?.email) return;
    try {
      localStorage.setItem(`flowtrack_notes_${user.email.toLowerCase().trim()}`, JSON.stringify(notesList));
    } catch (e) {
      console.error(e);
    }
  }, [notesList, user?.email]);

  // Break tracker state
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakSeconds, setBreakSeconds] = useState<number>(0);

  // Active or top task for current timer display
  const currentTask = tasks.find(t => t.id === activeTimerTaskId) || tasks[0] || null;
  const isRunning = currentTask ? activeTimerTaskId === currentTask.id : false;

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

  const timerDigits = formatTimerDigits(currentTask ? currentTask.time_spent_seconds || 0 : 0);

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

  // Derive unique projects dynamically from user tasks
  const uniqueProjectNames = Array.from(new Set(tasks.map(t => t.project_name || t.category_id || 'General Task').filter(Boolean)));

  const projectsData = uniqueProjectNames.map((pName, idx) => {
    const projTasks = tasks.filter(t => (t.project_name || t.category_id || 'General Task') === pName);
    const secs = projTasks.reduce((acc, t) => acc + (t.time_spent_seconds || 0), 0);
    const colors = ['bg-[#635BFF]', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-600'];
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const totalSecsAll = tasks.reduce((acc, t) => acc + (t.time_spent_seconds || 0), 0) || 1;
    const percent = Math.min(100, Math.round((secs / totalSecsAll) * 100));
    return {
      name: pName,
      time: `${h}h ${m.toString().padStart(2, '0')}m`,
      color: colors[idx % colors.length],
      percent: percent || 10
    };
  });

  // Calculate total logged time across all user tasks
  const totalLoggedSecs = tasks.reduce((sum, t) => sum + (t.time_spent_seconds || 0), 0);
  const totalLoggedTimeFormatted = formatDuration(totalLoggedSecs);

  // Time entries list for table mapped directly from real user tasks
  const timeEntries = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    project: t.project_name || t.category_id || 'General Task',
    tags: t.tags || ['Task'],
    tagColor: t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700',
    duration: formatDuration(t.time_spent_seconds || 0),
    timeRange: t.updated_at ? new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
    isRunning: activeTimerTaskId === t.id,
  }));

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

      {/* 2. Top Section: Current Active Task Hero Card (Sleek Modern Light Aesthetic) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                isRunning 
                  ? 'bg-purple-100 text-[#635BFF] border border-purple-200/60' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#635BFF] animate-ping' : 'bg-slate-400'}`} />
                {isRunning ? 'Timer Active' : 'Timer Paused'}
              </span>
              <span className="text-xs font-medium text-slate-300">•</span>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>{currentTask ? (currentTask.category || 'General Task') : 'Workspace'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentTask ? currentTask.title : 'No Task Created Yet'}
              </h2>
              {currentTask && (
                <button 
                  onClick={() => onOpenEditTask(currentTask)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-[#635BFF] hover:bg-purple-50 transition-all cursor-pointer"
                  title="Edit task title"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Badges & Options */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
              FlowTrack Project
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Design
            </span>
            <div className="flex items-center gap-1 text-slate-400 pl-2 border-l border-slate-100">
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Attachments">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Expand view">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Options">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stopwatch Main Hero Display & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Digital Clock Display (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Stopwatch
                </span>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-600 border border-slate-200/80">
                Target: 03:30:00
              </span>
            </div>

            {/* Segmented Clock with Light Background Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="flex flex-col items-center">
                  <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-3xl sm:text-5xl font-mono font-black tracking-tight text-slate-900 shadow-xs">
                    {timerDigits.hours}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Hours</span>
                </div>

                <span className="text-2xl sm:text-4xl font-black text-[#635BFF] mb-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-3xl sm:text-5xl font-mono font-black tracking-tight text-slate-900 shadow-xs">
                    {timerDigits.minutes}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Minutes</span>
                </div>

                <span className="text-2xl sm:text-4xl font-black text-[#635BFF] mb-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl bg-white border border-purple-200 text-3xl sm:text-5xl font-mono font-black tracking-tight text-[#635BFF] shadow-xs">
                    {timerDigits.seconds}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Seconds</span>
                </div>
              </div>

              {/* Target Progress Bar */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Progress toward target</span>
                  <span className="font-bold text-[#635BFF]">38% Completed</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#635BFF] h-2.5 rounded-full transition-all duration-500 shadow-2xs" style={{ width: '38%' }} />
                </div>
              </div>
            </div>

            {/* Quick Session Note trigger inside timer card */}
            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">Auto-syncs with task history</span>
              <button 
                onClick={() => {
                  const noteBox = document.getElementById('note-textarea');
                  if (noteBox) noteBox.focus();
                }}
                className="text-xs font-bold text-[#635BFF] hover:bg-purple-100/60 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Add Session Note</span>
              </button>
            </div>

          </div>

          {/* Right Column: Timer Control Actions (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#635BFF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Timer Controls
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                isRunning ? 'bg-purple-100 text-[#635BFF]' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {isRunning ? 'Tracking Live' : 'Ready'}
              </span>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 my-auto">
              <button
                onClick={() => currentTask ? onToggleTimer(currentTask.id) : onOpenAddTask()}
                className={`w-full py-4 px-6 rounded-2xl text-base font-extrabold shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer ${
                  isRunning
                    ? 'bg-[#635BFF] hover:bg-[#5249ea] text-white shadow-[#635BFF]/30 active:scale-[0.99]'
                    : 'bg-[#635BFF] hover:bg-[#5249ea] text-white shadow-[#635BFF]/20 active:scale-[0.99]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => currentTask && onToggleComplete(currentTask.id)}
                  className="py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Square className="w-4 h-4 fill-slate-700 text-slate-700" />
                  <span>Complete</span>
                </button>

                <button
                  onClick={() => setIsOnBreak(!isOnBreak)}
                  className={`py-3.5 px-4 border rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                    isOnBreak
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>{isOnBreak ? 'End Break' : 'Take Break'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Row inside Controls Card matching left card's bottom row height */}
            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Session State:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#635BFF] animate-pulse' : 'bg-slate-400'}`} />
                {isRunning ? 'Actively Logging' : 'Paused'}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Time Entries Table (Prominently full width on top) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Time Entries</h3>
            <p className="text-xs text-slate-500">Track and review detailed logs for today's activities</p>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 self-start sm:self-auto">
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
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 cursor-pointer"
          >
            <option value="All">All Projects</option>
            <option value="FlowTrack Website">FlowTrack Website</option>
            <option value="WeVersity Platform">WeVersity Platform</option>
            <option value="Client Dashboard">Client Dashboard</option>
          </select>

          <select
            value={selectedTaskFilter}
            onChange={(e) => setSelectedTaskFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 cursor-pointer"
          >
            <option value="All">All Tasks</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>

          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer">
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
              {timeEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No time entries logged yet. Create a task or start a timer to begin tracking!
                  </td>
                </tr>
              ) : (
                timeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Task Title with Play icon */}
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <button
                        onClick={() => onToggleTimer(entry.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
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
                    <td className="py-3.5 text-slate-600 font-medium">{entry.project}</td>

                    {/* Tags */}
                    <td className="py-3.5">
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
                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      {entry.duration}
                    </td>

                    {/* Time Range */}
                    <td className="py-3.5 text-slate-500 font-medium">
                      {entry.timeRange}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 text-xs font-bold">
                <td colSpan={3} className="pt-3 text-slate-700">Total Logged Time</td>
                <td className="pt-3 font-mono text-[#635BFF] font-black text-sm">{totalLoggedTimeFormatted}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

      {/* 4. Bottom Row: Notes / Breaks / Screenshots (Left 2 cols) + Projects (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Notes / Breaks / Screenshots */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
            {(['Notes', 'Breaks', 'Screenshots'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-extrabold transition-all relative cursor-pointer ${
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
            <div className="space-y-4">
              <textarea
                id="note-textarea"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write a note about your work session..."
                rows={3}
                className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddNote}
                  className="px-5 py-2 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs font-bold shadow-md shadow-[#635BFF]/20 transition-all cursor-pointer"
                >
                  Save Note
                </button>
              </div>

              {/* Saved Notes List directly inside Notes tab */}
              {notesList.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Saved Session Notes</span>
                  <div className="space-y-2">
                    {notesList.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                          <span>{note.text}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{note.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                Taking regular breaks improves focus and prevents burnout. Click "Take Break" in the timer widget above to record your break time.
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

        {/* Right Column: Projects (Moved down from above) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Projects Overview</h3>
              <button className="text-xs font-semibold text-[#635BFF] hover:underline cursor-pointer">View All</button>
            </div>

            <div className="space-y-3">
              {projectsData.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs font-medium">
                  No active projects yet
                </div>
              ) : (
                projectsData.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-2xs transition-all">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-slate-900">{p.name}</span>
                      <span className="font-mono text-slate-700">{p.time}</span>
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${p.percent}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950">{projectsData.length} Active Projects</span>
            <span className="text-[11px] font-bold text-[#635BFF] font-mono">{totalLoggedTimeFormatted} Total</span>
          </div>
        </div>

      </div>

    </div>
  );
};
