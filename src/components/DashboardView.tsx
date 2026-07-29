import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  TrendingUp, 
  FolderKanban, 
  Users, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight,
  Folder,
  BarChart2,
  CheckCircle2,
  Sparkles
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
  // Chart Segment filter
  const [chartSegment, setChartSegment] = useState<'Week' | 'Month'>('Week');
  
  // Active Task
  const activeTask = tasks.find((t) => t.id === activeTimerTaskId) || tasks[0];
  const [taskInputText, setTaskInputText] = useState(activeTask ? activeTask.title : 'Building the onboarding flow');

  // Format timer string (e.g. 02:14:37)
  const formatTimerString = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const activeSeconds = activeTask ? activeTask.time_spent_seconds : 8077; // 02:14:37

  // Projects in flow mock data merged with real tasks info
  const projectsInFlow = [
    {
      id: 'proj_1',
      name: 'Client Website — Redesign',
      client: 'Northline Design',
      timeSpent: '14h 20m',
      progress: 72,
      status: 'On track',
      isRisk: false,
      color: 'bg-[#2E4CFF]',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'proj_2',
      name: 'Brand Refresh',
      client: 'Northline Design',
      timeSpent: '6h 45m',
      progress: 38,
      status: 'On track',
      isRisk: false,
      color: 'bg-[#1F9D6B]',
      avatars: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'proj_3',
      name: 'Mobile App — Sprint 4',
      client: 'Vela Systems',
      timeSpent: '18h 05m',
      progress: 94,
      status: 'Near budget',
      isRisk: true,
      color: 'bg-[#E8862B]',
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'proj_4',
      name: 'Internal Ops',
      client: 'Flow Track Team',
      timeSpent: '3h 10m',
      progress: 20,
      status: 'On track',
      isRisk: false,
      color: 'bg-[#8A8E97]',
      avatars: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      ]
    }
  ];

  // Daily Chart Bars Data (Height in px, fill height in %)
  const dailyBars = [
    { day: 'MON', heightPx: 105, fillPct: 80 },
    { day: 'TUE', heightPx: 150, fillPct: 60 },
    { day: 'WED', heightPx: 170, fillPct: 92 },
    { day: 'THU', heightPx: 120, fillPct: 50 },
    { day: 'FRI', heightPx: 145, fillPct: 74 },
    { day: 'SAT', heightPx: 70, fillPct: 30 },
    { day: 'SUN', heightPx: 45, fillPct: 14 }
  ];

  const firstName = user.name.split(' ')[0] || 'Sara';

  return (
    <div className="space-y-6 pb-12 text-[#15181D]">
      
      {/* ---------- TOPBAR HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#15181D]">
            Good afternoon, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8E97] mt-0.5 font-normal">
            Here's how your week is flowing so far.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell Circle */}
          <button
            onClick={onOpenAiModal}
            className="w-9 h-9 rounded-full bg-white border border-[#E4E4DF] flex items-center justify-center text-[#4B4F58] hover:bg-slate-50 transition-colors relative cursor-pointer"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#E8862B]" />
          </button>

          {/* AI Insights / Search Button */}
          <button
            onClick={onOpenAiModal}
            className="w-9 h-9 rounded-full bg-white border border-[#E4E4DF] flex items-center justify-center text-[#4B4F58] hover:bg-slate-50 transition-colors cursor-pointer"
            title="AI Insights"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* New Project Button */}
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E4CFF] hover:bg-[#1B2FBF] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New project</span>
          </button>
        </div>
      </div>


      {/* ---------- ACTIVE TIMER BAR ---------- */}
      <div className="bg-[#15181D] text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 relative overflow-hidden shadow-lg shadow-black/10">
        
        {/* Radial Ambient Blue Glow Background */}
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[#2E4CFF]/30 blur-3xl pointer-events-none" />

        {/* Task Input Field */}
        <div className="flex-1 relative z-10">
          <input
            type="text"
            value={taskInputText}
            onChange={(e) => setTaskInputText(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-transparent border-none outline-none text-white font-sans text-base sm:text-lg font-medium placeholder-[#7A7F90] focus:ring-0 p-0"
          />
        </div>

        {/* Tag Pill */}
        <div className="relative z-10 flex items-center gap-2 bg-[#232733] px-3.5 py-2 rounded-full text-xs font-medium text-[#B6BAC9] border border-white/5 shrink-0 self-start md:self-auto">
          <span className="w-2 h-2 rounded-xs bg-[#2E4CFF]" />
          <span>{activeTask ? (activeTask.project_name || 'Client Website — Redesign') : 'Client Website — Redesign'}</span>
        </div>

        {/* Live Timer Clock */}
        <div className="relative z-10 font-mono text-2xl sm:text-3xl font-bold text-white min-w-[130px] text-left md:text-right">
          {formatTimerString(activeSeconds)}
        </div>

        {/* Pause / Play Button */}
        <div className="relative z-10 shrink-0 flex justify-end">
          <button
            onClick={() => activeTask && onToggleTimer(activeTask.id)}
            className="w-11 h-11 rounded-full bg-[#2E4CFF] hover:bg-[#1B2FBF] text-white flex items-center justify-center cursor-pointer shadow-lg shadow-[#2E4CFF]/35 transition-all transform hover:scale-105 active:scale-95"
            title={activeTimerTaskId === activeTask?.id ? "Pause timer" : "Start timer"}
          >
            {activeTimerTaskId === activeTask?.id ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

      </div>


      {/* ---------- STAT CARDS (4 CARDS) ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tracked this week */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#EAEEFF] text-[#2E4CFF] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1F9D6B] bg-[#E6F6EF] px-2.5 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              32h 40m
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Tracked this week
            </span>
          </div>
        </div>

        {/* Card 2: Billable hours */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#E6F6EF] text-[#1F9D6B] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1F9D6B] bg-[#E6F6EF] px-2.5 py-0.5 rounded-full">
              ↑ 4%
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              27h 05m
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Billable hours
            </span>
          </div>
        </div>

        {/* Card 3: Active projects */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#FBEEE1] text-[#E8862B] flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#C0392B] bg-[#FBEBE9] px-2.5 py-0.5 rounded-full">
              ↓ 2%
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              12
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Active projects
            </span>
          </div>
        </div>

        {/* Card 4: Team members in flow */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#EAEEFF] text-[#2E4CFF] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1F9D6B] bg-[#E6F6EF] px-2.5 py-0.5 rounded-full">
              ↑ 3
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              8
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Team members in flow
            </span>
          </div>
        </div>

      </div>


      {/* ---------- GRID: CHART + RECENT ACTIVITY ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Card: Hours by day (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4DF] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#15181D]">Hours by day</h3>
              <span className="font-mono text-[10.5px] text-[#8A8E97] font-semibold uppercase tracking-wider block mt-0.5">
                THIS WEEK · 32H 40M TOTAL
              </span>
            </div>

            {/* Segment Switcher */}
            <div className="flex bg-[#F7F7F4] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setChartSegment('Week')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  chartSegment === 'Week'
                    ? 'bg-white text-[#15181D] shadow-2xs'
                    : 'text-[#8A8E97] hover:text-[#15181D]'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setChartSegment('Month')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  chartSegment === 'Month'
                    ? 'bg-white text-[#15181D] shadow-2xs'
                    : 'text-[#8A8E97] hover:text-[#15181D]'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="flex items-end gap-3 sm:gap-4 h-44 px-1">
              {dailyBars.map((b, idx) => (
                <div
                  key={idx}
                  style={{ height: `${b.heightPx}px` }}
                  className="flex-1 bg-[#EAEEFF] rounded-t-md rounded-b-xs relative group cursor-pointer"
                >
                  {/* Billable inner bar */}
                  <i
                    style={{ height: `${b.fillPct}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-[#2E4CFF] rounded-t-md rounded-b-xs transition-all group-hover:bg-[#1B2FBF]"
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#15181D] text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {Math.round((b.heightPx / 170) * 8)}h
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Day Labels */}
            <div className="flex justify-between gap-3 sm:gap-4 mt-2.5 px-1 font-mono text-[10.5px] text-[#8A8E97]">
              {dailyBars.map((b) => (
                <span key={b.day} className="flex-1 text-center">{b.day}</span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 pt-3 border-t border-[#E4E4DF] text-xs text-[#4B4F58] font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-[#2E4CFF]" />
              <span>Billable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-[#EAEEFF]" />
              <span>Internal</span>
            </div>
          </div>

        </div>


        {/* Right Card: Recent Activity (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4DF] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-semibold text-[#15181D]">Recent activity</h3>
            <span className="font-mono text-[10.5px] text-[#8A8E97] font-semibold uppercase">
              TODAY
            </span>
          </div>

          <div className="space-y-1 divide-y divide-[#F0F0EC]">
            
            {/* Activity 1 */}
            <div className="flex items-center gap-3 py-2.5 first:pt-0">
              <span className="w-2 h-9 rounded-md bg-[#2E4CFF] shrink-0" />
              <div className="flex-1 min-w-0">
                <b className="text-xs font-semibold text-[#15181D] block truncate">Onboarding flow</b>
                <span className="text-[11px] text-[#8A8E97] block truncate">Client Website — Redesign</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-semibold text-[#15181D] block">2:14:37</span>
                <span className="text-[10px] text-[#1F9D6B] font-medium block">Running</span>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center gap-3 py-2.5">
              <span className="w-2 h-9 rounded-md bg-[#1F9D6B] shrink-0" />
              <div className="flex-1 min-w-0">
                <b className="text-xs font-semibold text-[#15181D] block truncate">Discovery call</b>
                <span className="text-[11px] text-[#8A8E97] block truncate">Northline — Brand Refresh</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-[#15181D] block">1:05:12</span>
                <span className="text-[10px] text-[#8A8E97] block">11:20 AM</span>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center gap-3 py-2.5">
              <span className="w-2 h-9 rounded-md bg-[#E8862B] shrink-0" />
              <div className="flex-1 min-w-0">
                <b className="text-xs font-semibold text-[#15181D] block truncate">Wireframes v2</b>
                <span className="text-[11px] text-[#8A8E97] block truncate">Client Website — Redesign</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-[#15181D] block">3:40:08</span>
                <span className="text-[10px] text-[#8A8E97] block">9:00 AM</span>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-center gap-3 py-2.5">
              <span className="w-2 h-9 rounded-md bg-[#8A8E97] shrink-0" />
              <div className="flex-1 min-w-0">
                <b className="text-xs font-semibold text-[#15181D] block truncate">Internal standup</b>
                <span className="text-[11px] text-[#8A8E97] block truncate">Team — General</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-[#15181D] block">0:15:00</span>
                <span className="text-[10px] text-[#8A8E97] block">Yesterday</span>
              </div>
            </div>

          </div>
        </div>

      </div>


      {/* ---------- PROJECT TABLE: PROJECTS IN FLOW ---------- */}
      <div className="bg-white border border-[#E4E4DF] rounded-2xl overflow-hidden shadow-2xs">
        
        {/* Table Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4E4DF]">
          <h3 className="text-sm sm:text-base font-semibold text-[#15181D]">Projects in flow</h3>
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2E4CFF] hover:bg-[#1B2FBF] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New project</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E4DF] bg-[#F7F7F4]/50">
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Project</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Time this week</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Budget used</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EC]">
              {projectsInFlow.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#F7F7F4]/40 transition-colors">
                  
                  {/* Project Name & Client */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-xs shrink-0 ${proj.color}`} />
                      <div>
                        <div className="text-xs font-semibold text-[#15181D]">{proj.name}</div>
                        <div className="text-[11px] text-[#8A8E97] font-normal">{proj.client}</div>
                      </div>
                    </div>
                  </td>

                  {/* Time This Week */}
                  <td className="py-4 px-5 font-mono text-xs font-medium text-[#15181D]">
                    {proj.timeSpent}
                  </td>

                  {/* Budget Progress Bar */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="flex-1 h-1.5 bg-[#F0F0EC] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${proj.progress}%` }}
                          className={`h-full rounded-full ${proj.isRisk ? 'bg-[#E8862B]' : 'bg-[#2E4CFF]'}`}
                        />
                      </div>
                      <span className="font-mono text-xs text-[#4B4F58] min-w-[32px]">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      proj.isRisk 
                        ? 'bg-[#FBEEE1] text-[#E8862B]' 
                        : 'bg-[#E6F6EF] text-[#1F9D6B]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full fill-current bg-current" />
                      <span>{proj.status}</span>
                    </span>
                  </td>

                  {/* Team Avatars */}
                  <td className="py-4 px-5">
                    <div className="flex items-center -space-x-2">
                      {proj.avatars.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Team avatar"
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

