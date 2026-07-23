import React, { useState, useMemo } from 'react';
import { Calendar, Download, Search, Filter, Clock, CheckCircle2, TrendingUp, Layers, RefreshCw, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { Task, TimeFilter } from '../types';
import { formatDuration, formatDurationCompact, generate365DaysActivity, isTaskInTimeFilter, exportTasksToCSV } from '../utils/timeUtils';

interface YearHistoryViewProps {
  tasks: Task[];
  onSeedData: () => void;
  onClearData: () => void;
}

export const YearHistoryView: React.FC<YearHistoryViewProps> = ({
  tasks,
  onSeedData,
  onClearData,
}) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('year');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Compute 365 days contribution activity map
  const activityData = useMemo(() => generate365DaysActivity(tasks), [tasks]);

  // Extract categories present in tasks
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [tasks]);

  // Filter tasks based on selected timeframe, search query, category, priority
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Time filter
      if (!isTaskInTimeFilter(task, activeFilter)) return false;

      // Search query
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && task.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [tasks, activeFilter, searchQuery, selectedCategory, selectedPriority]);

  // Total time spent in current filter
  const totalSecondsInFilter = useMemo(() => {
    return filteredTasks.reduce((acc, t) => acc + t.time_spent_seconds, 0);
  }, [filteredTasks]);

  const completedCount = useMemo(() => {
    return filteredTasks.filter(t => t.status === 'Completed').length;
  }, [filteredTasks]);

  // Helper to color heatmap squares based on activity intensity
  const getCellColor = (seconds: number, maxSecs: number) => {
    if (seconds === 0) return 'bg-slate-800/60 border-slate-700/30';
    const ratio = seconds / Math.max(maxSecs, 14400); // 4 hours as baseline high
    if (ratio < 0.25) return 'bg-emerald-950 border-emerald-800 text-emerald-400';
    if (ratio < 0.5) return 'bg-emerald-800 border-emerald-700 text-emerald-200';
    if (ratio < 0.75) return 'bg-emerald-600 border-emerald-500 text-white';
    return 'bg-emerald-400 border-emerald-300 text-slate-950 font-bold';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>365-Day Work History Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Productivity Timeline & Archive
          </h1>
          <p className="text-sm text-slate-300 mt-1.5 max-w-2xl">
            Track your work log over a full 1-year history. View daily activity heatmaps, filter by project, and analyze long-term output.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportTasksToCSV(filteredTasks)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onSeedData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all"
            title="Generate 365 days of sample task logs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Seed 1-Year Data</span>
          </button>
        </div>
      </div>

      {/* Time Horizon Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-semibold text-slate-400 px-3 hidden sm:inline">Timeframe:</span>
          
          <button
            onClick={() => setActiveFilter('today')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'today'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setActiveFilter('week')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'week'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => setActiveFilter('month')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'month'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => setActiveFilter('year')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'year'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            1-Year History (365 Days)
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Time
          </button>
        </div>

        <div className="text-xs text-slate-400 px-3 font-mono">
          Showing <span className="text-indigo-400 font-bold">{filteredTasks.length}</span> task logs
        </div>
      </div>

      {/* Summary Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Time Logged</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatDuration(totalSecondsInFilter)}
          </div>
          <p className="text-xs text-indigo-300 mt-1">
            ≈ {formatDurationCompact(totalSecondsInFilter)} total work
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {completedCount} <span className="text-sm font-normal text-slate-400">/ {filteredTasks.length}</span>
          </div>
          <p className="text-xs text-emerald-400 mt-1">
            {filteredTasks.length > 0
              ? `${Math.round((completedCount / filteredTasks.length) * 100)}% Completion Rate`
              : '0% Completion Rate'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>365-Day Work Volume</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {Math.round(activityData.totalYearSeconds / 3600)} hrs
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logged across {activityData.days.filter(d => d.totalSeconds > 0).length} active days
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Daily Focus Average</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatDurationCompact(Math.round(totalSecondsInFilter / (activeFilter === 'today' ? 1 : activeFilter === 'week' ? 7 : activeFilter === 'month' ? 30 : 365)))}
          </div>
          <p className="text-xs text-slate-400 mt-1">Avg focus time per day</p>
        </div>

      </div>

      {/* 365-Day Contribution Activity Heatmap Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>365-Day Activity Matrix (1 Year)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each cell represents 1 day of logged work. Hover over cells to inspect exact hours logged.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-3 h-3 rounded bg-emerald-800 border border-emerald-700" />
            <div className="w-3 h-3 rounded bg-emerald-600 border border-emerald-500" />
            <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container (Scrollable on small screens) */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[760px]">
            <div className="grid grid-rows-7 grid-flow-col gap-1.5">
              {activityData.days.map((day) => {
                const hours = (day.totalSeconds / 3600).toFixed(1);
                return (
                  <div
                    key={day.date}
                    className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 hover:z-10 cursor-pointer ${getCellColor(
                      day.totalSeconds,
                      activityData.maxDailySeconds
                    )}`}
                    title={`${day.date}: ${hours} hrs logged (${day.taskCount} tasks)`}
                  />
                );
              })}
            </div>
            
            {/* Legend info row */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3 px-1">
              <span>365 Days Ago</span>
              <span>180 Days Ago</span>
              <span>90 Days Ago</span>
              <span>Today ({new Date().toISOString().split('T')[0]})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar for Task Archive */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, categories, tags..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category & Priority Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

      </div>

      {/* Task Archive Table / Listing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Work Log Listing ({filteredTasks.length})</span>
          </h3>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Clock className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-base font-medium text-slate-300">No tasks match your filter criteria.</p>
            <p className="text-xs text-slate-500">Try adjusting your timeframe, category filter, or search term.</p>
            <button
              onClick={onSeedData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold mt-2"
            >
              Load 1-Year Sample Data
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time Spent</th>
                  <th className="py-3 px-4">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm text-slate-200">
                {filteredTasks.slice(0, 100).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-100 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-indigo-300 border border-slate-700">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'Urgent'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : t.priority === 'High'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Completed'
                            ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                            : 'text-indigo-300 bg-indigo-950/80 border border-indigo-800/60'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100">
                      {formatDuration(t.time_spent_seconds)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs font-mono">
                      {new Date(t.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTasks.length > 100 && (
              <div className="p-3 text-center text-xs text-slate-400 bg-slate-950/40 border-t border-slate-800">
                Showing top 100 results of {filteredTasks.length}. Export CSV to view full dataset.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
