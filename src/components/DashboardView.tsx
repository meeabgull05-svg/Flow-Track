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

  // Calculate total logged seconds & billable seconds from real tasks
  const totalLoggedSecs = tasks.reduce((sum, t) => sum + (t.time_spent_seconds || 0), 0);
  const billableLoggedSecs = tasks.filter((t) => t.billable !== false).reduce((sum, t) => sum + (t.time_spent_seconds || 0), 0);

  const formatHoursMins = (secs: number) => {
    if (!secs || secs <= 0) return '0h 00m';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  };

  // Derive projects dynamically from user tasks
  const uniqueProjectNames = Array.from(
    new Set(tasks.map((t) => t.project_name || t.category_id || 'General Task').filter(Boolean))
  );

  const dynamicProjects = uniqueProjectNames.map((projName, idx) => {
    const projTasks = tasks.filter((t) => (t.project_name || t.category_id || 'General Task') === projName);
    const projSecs = projTasks.reduce((s, t) => s + (t.time_spent_seconds || 0), 0);
    const completedCount = projTasks.filter((t) => t.status === 'Completed').length;
    const progress = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
    const colors = ['bg-[#2E4CFF]', 'bg-[#1F9D6B]', 'bg-[#E8862B]', 'bg-[#8A8E97]', 'bg-[#635BFF]'];

    return {
      id: `proj_dyn_${idx}`,
      name: projName,
      client: user.orgName || 'Organization Workspace',
      timeSpent: formatHoursMins(projSecs),
      progress,
      status: progress === 100 ? 'Completed' : 'On track',
      isRisk: false,
      color: colors[idx % colors.length],
      avatars: [user.avatar]
    };
  });

  // Calculate daily chart bars dynamically from tasks
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const dailySecondsMap: Record<string, { total: number; billable: number }> = {
    MON: { total: 0, billable: 0 },
    TUE: { total: 0, billable: 0 },
    WED: { total: 0, billable: 0 },
    THU: { total: 0, billable: 0 },
    FRI: { total: 0, billable: 0 },
    SAT: { total: 0, billable: 0 },
    SUN: { total: 0, billable: 0 },
  };

  tasks.forEach((t) => {
    if (t.created_at || t.updated_at) {
      const d = new Date(t.created_at || t.updated_at || Date.now());
      const dayIdx = (d.getDay() + 6) % 7;
      const dayKey = daysOfWeek[dayIdx];
      if (dailySecondsMap[dayKey]) {
        dailySecondsMap[dayKey].total += t.time_spent_seconds || 0;
        if (t.billable !== false) {
          dailySecondsMap[dayKey].billable += t.time_spent_seconds || 0;
        }
      }
    }
  });

  const maxDaySecs = Math.max(...Object.values(dailySecondsMap).map((d) => d.total), 3600);
  const dailyBars = daysOfWeek.map((dayKey) => {
    const { total, billable } = dailySecondsMap[dayKey];
    const heightPx = total > 0 ? Math.min(Math.round((total / maxDaySecs) * 150) + 15, 160) : 12;
    const fillPct = total > 0 ? Math.min(Math.round((billable / total) * 100), 100) : 0;
    return { day: dayKey, heightPx, fillPct, hoursLogged: (total / 3600).toFixed(1) };
  });

  const firstName = user.name.split(' ')[0] || 'Member';

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



      {/* ---------- STAT CARDS (4 CARDS) ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tracked this week */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#EAEEFF] text-[#2E4CFF] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1F9D6B] bg-[#E6F6EF] px-2.5 py-0.5 rounded-full">
              {totalLoggedSecs > 0 ? 'Live' : '0%'}
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              {formatHoursMins(totalLoggedSecs)}
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
              {billableLoggedSecs > 0 ? 'Live' : '0%'}
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              {formatHoursMins(billableLoggedSecs)}
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
            <span className="font-mono text-xs font-bold text-[#2E4CFF] bg-[#EAEEFF] px-2.5 py-0.5 rounded-full">
              {uniqueProjectNames.length} Total
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              {uniqueProjectNames.length}
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Active projects
            </span>
          </div>
        </div>

        {/* Card 4: Tasks count */}
        <div className="bg-white border border-[#E4E4DF] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#EAEEFF] text-[#2E4CFF] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs font-bold text-[#1F9D6B] bg-[#E6F6EF] px-2.5 py-0.5 rounded-full">
              {tasks.length} Tasks
            </span>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-[#15181D] tracking-tight block">
              {tasks.length}
            </span>
            <span className="text-xs text-[#8A8E97] font-medium block mt-1">
              Total user tasks
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
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A8E97] space-y-2">
                <Clock className="w-8 h-8 text-[#C4C4BD] mx-auto" />
                <p className="font-medium text-[#15181D]">No activity logged yet</p>
                <p>Start a timer or create a task to log your time!</p>
              </div>
            ) : (
              tasks.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                  <span className={`w-2 h-9 rounded-md shrink-0 ${t.is_timer_running ? 'bg-[#1F9D6B]' : 'bg-[#2E4CFF]'}`} />
                  <div className="flex-1 min-w-0">
                    <b className="text-xs font-semibold text-[#15181D] block truncate">{t.title}</b>
                    <span className="text-[11px] text-[#8A8E97] block truncate">{t.project_name || t.category_id || 'General'}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-semibold text-[#15181D] block">
                      {formatTimerString(t.time_spent_seconds || 0)}
                    </span>
                    <span className={`text-[10px] font-medium block ${t.is_timer_running ? 'text-[#1F9D6B]' : 'text-[#8A8E97]'}`}>
                      {t.is_timer_running ? 'Running' : t.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
          {dynamicProjects.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8A8E97] space-y-3">
              <FolderKanban className="w-10 h-10 text-[#C4C4BD] mx-auto" />
              <p className="font-semibold text-[#15181D] text-sm">No active projects yet</p>
              <p>Your workspace is clean and ready. Click "New project" above to get started!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E4DF] bg-[#F7F7F4]/50">
                  <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Project</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Time logged</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Completion</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-5 text-[11px] font-semibold text-[#8A8E97] uppercase tracking-wider">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EC]">
                {dynamicProjects.map((proj) => (
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

                    {/* Time Logged */}
                    <td className="py-4 px-5 font-mono text-xs font-medium text-[#15181D]">
                      {proj.timeSpent}
                    </td>

                    {/* Completion Progress Bar */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="flex-1 h-1.5 bg-[#F0F0EC] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${proj.progress}%` }}
                            className="h-full rounded-full bg-[#2E4CFF]"
                          />
                        </div>
                        <span className="font-mono text-xs text-[#4B4F58] min-w-[32px]">
                          {proj.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F6EF] text-[#1F9D6B]">
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
          )}
        </div>

      </div>

    </div>
  );
};

