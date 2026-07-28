import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Target, 
  Calendar, 
  Download, 
  Sparkles, 
  Zap, 
  Brain, 
  PieChart, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  Filter, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface AnalyticsViewProps {
  tasks: Task[];
  user: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, user }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'year'>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Calculated analytics from tasks
  const totalSecondsLogged = tasks.reduce((acc, t) => acc + (t.time_spent_seconds || 0), 0);
  const totalHoursLogged = (totalSecondsLogged / 3600).toFixed(1);
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const totalTasksCount = tasks.length || 1;
  const completionRate = Math.round((completedTasks.length / totalTasksCount) * 100);

  // Group by categories
  const categoryStats: { [cat: string]: { seconds: number; count: number; color: string } } = {
    'Development': { seconds: 0, count: 0, color: 'bg-[#635BFF]' },
    'UI/UX Design': { seconds: 0, count: 0, color: 'bg-emerald-500' },
    'Meetings': { seconds: 0, count: 0, color: 'bg-amber-500' },
    'Research': { seconds: 0, count: 0, color: 'bg-blue-500' },
    'Planning': { seconds: 0, count: 0, color: 'bg-purple-500' },
  };

  tasks.forEach(t => {
    const cat = t.category || 'Development';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { seconds: 0, count: 0, color: 'bg-slate-600' };
    }
    categoryStats[cat].seconds += t.time_spent_seconds || 0;
    categoryStats[cat].count += 1;
  });

  // Weekly mockup trend data
  const weeklyTrend = [
    { day: 'Mon', focusHours: 6.5, target: 7.0, deepWork: 4.8, meetings: 1.7 },
    { day: 'Tue', focusHours: 7.8, target: 7.0, deepWork: 6.0, meetings: 1.8 },
    { day: 'Wed', focusHours: 8.4, target: 7.0, deepWork: 7.1, meetings: 1.3 },
    { day: 'Thu', focusHours: 5.2, target: 7.0, deepWork: 3.5, meetings: 1.7 },
    { day: 'Fri', focusHours: 7.1, target: 7.0, deepWork: 5.9, meetings: 1.2 },
    { day: 'Sat', focusHours: 3.2, target: 4.0, deepWork: 3.0, meetings: 0.2 },
    { day: 'Sun', focusHours: 2.5, target: 4.0, deepWork: 2.5, meetings: 0.0 },
  ];

  const maxWeeklyHours = Math.max(...weeklyTrend.map(w => w.focusHours), 9);

  // Heatmap hourly productivity mockup data
  const hoursOfDay = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const heatmapData: { [key: string]: number } = {
    'Mon-8 AM': 60, 'Mon-10 AM': 95, 'Mon-12 PM': 70, 'Mon-2 PM': 85, 'Mon-4 PM': 65, 'Mon-6 PM': 30, 'Mon-8 PM': 10,
    'Tue-8 AM': 70, 'Tue-10 AM': 90, 'Tue-12 PM': 60, 'Tue-2 PM': 95, 'Tue-4 PM': 80, 'Tue-6 PM': 40, 'Tue-8 PM': 20,
    'Wed-8 AM': 80, 'Wed-10 AM': 100, 'Wed-12 PM': 75, 'Wed-2 PM': 90, 'Wed-4 PM': 85, 'Wed-6 PM': 50, 'Wed-8 PM': 15,
    'Thu-8 AM': 50, 'Thu-10 AM': 75, 'Thu-12 PM': 80, 'Thu-2 PM': 60, 'Thu-4 PM': 70, 'Thu-6 PM': 35, 'Thu-8 PM': 10,
    'Fri-8 AM': 65, 'Fri-10 AM': 85, 'Fri-12 PM': 65, 'Fri-2 PM': 75, 'Fri-4 PM': 50, 'Fri-6 PM': 20, 'Fri-8 PM': 5,
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 85) return 'bg-[#635BFF] text-white';
    if (value >= 65) return 'bg-purple-300 text-purple-950';
    if (value >= 40) return 'bg-purple-100 text-purple-900';
    return 'bg-slate-100 text-slate-400';
  };

  const handleExportReport = () => {
    setExportNotice('Analytics report generated successfully as CSV!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analytics & Insights
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              ● Live Data
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Deep performance metrics, focus velocity, and time allocation distribution.
          </p>
        </div>

        {/* Time Filters & Export */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-1 shadow-xs flex items-center gap-1">
            {(['7d', '30d', '90d', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === range
                    ? 'bg-[#635BFF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? '30 Days' : range === '90d' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-purple-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Focus Time
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-[#635BFF]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalHoursLogged}h
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            vs 35.4h in previous period
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daily Average
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              6.1h
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              88% Target
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Daily goal: 7.0 hours focus
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Task Velocity
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              ({completedTasks.length}/{totalTasksCount})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Completed tasks ratio
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Productivity Score
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              94 / 100
            </span>
            <span className="text-xs text-amber-600 font-bold">
              ★ Peak State
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Calculated from deep focus hours
          </p>
        </div>

      </div>

      {/* 3. Main Chart & Category Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Focus Hours Bar Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#635BFF]" />
                  Weekly Focus Hours Trend
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between total focus hours, deep work, and target daily goals.
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#635BFF]" />
                  <span className="text-slate-600">Deep Work</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-purple-200" />
                  <span className="text-slate-600">Meetings</span>
                </div>
              </div>
            </div>

            {/* Custom SVG / CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 relative">
              
              {/* Target Line Guide */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-dashed border-amber-300 pointer-events-none flex items-center justify-end pr-2"
                style={{ bottom: `${(7.0 / maxWeeklyHours) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shadow-2xs">
                  Daily Target (7.0h)
                </span>
              </div>

              {weeklyTrend.map((item, idx) => {
                const totalHeightPct = (item.focusHours / maxWeeklyHours) * 100;
                const deepWorkPct = (item.deepWork / item.focusHours) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-lg pointer-events-none z-10 whitespace-nowrap">
                      {item.day}: {item.focusHours}h ({item.deepWork}h deep)
                    </div>

                    {/* Bar container */}
                    <div 
                      className="w-full max-w-[42px] bg-purple-100 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:scale-105"
                      style={{ height: `${totalHeightPct}%` }}
                    >
                      {/* Deep Work Stacked portion */}
                      <div 
                        className="bg-[#635BFF] w-full rounded-t-xl transition-all"
                        style={{ height: `${deepWorkPct}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="mt-3 text-xs font-bold text-slate-600 group-hover:text-[#635BFF] transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footnote Summary */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <TrendingUp className="w-4 h-4" />
              Peak focus achieved on Wednesday (8.4 hrs)
            </span>
            <span>Total logged this week: <strong className="text-slate-800">40.5 hrs</strong></span>
          </div>

        </div>

        {/* Category Allocation Distribution (1 column) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-500" />
                Category Distribution
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Time split across primary project categories.
            </p>

            {/* Category Progress Bars */}
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([catName, stat]) => {
                const hours = (stat.seconds / 3600).toFixed(1);
                const percent = totalSecondsLogged > 0 
                  ? Math.round((stat.seconds / totalSecondsLogged) * 100) 
                  : 20;

                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
                        {catName}
                      </span>
                      <span className="text-slate-900 font-mono">
                        {hours}h ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${stat.color} transition-all duration-500`}
                        style={{ width: `${Math.max(percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Insight pill */}
          <div className="mt-6 p-3.5 bg-purple-50/80 border border-purple-100 rounded-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#635BFF] shrink-0" />
            <p className="text-xs text-purple-950 font-semibold leading-tight">
              Development & UI Design make up <strong>68%</strong> of your total focus hours.
            </p>
          </div>

        </div>

      </div>

      {/* 4. Peak Focus Heatmap & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Concentration Heatmap (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" />
                Hourly Concentration Heatmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Focus density by hour of day. Dark purple represents peak flow state intensity.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span>Less</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-md bg-slate-100" />
                <span className="w-3 h-3 rounded-md bg-purple-100" />
                <span className="w-3 h-3 rounded-md bg-purple-300" />
                <span className="w-3 h-3 rounded-md bg-[#635BFF]" />
              </div>
              <span>Peak</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-left text-xs font-bold text-slate-400">Day</th>
                  {hoursOfDay.map(h => (
                    <th key={h} className="py-2 px-1 text-xs font-bold text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map(day => (
                  <tr key={day}>
                    <td className="py-2 px-2 text-left text-xs font-extrabold text-slate-700">
                      {day}
                    </td>
                    {hoursOfDay.map(hour => {
                      const key = `${day}-${hour}`;
                      const score = heatmapData[key] || 30;
                      return (
                        <td key={hour} className="py-1 px-1">
                          <div
                            className={`py-2 rounded-xl text-[10px] font-extrabold transition-all hover:scale-105 cursor-pointer shadow-2xs ${getHeatmapColor(score)}`}
                            title={`${day} ${hour}: ${score}% Focus Rating`}
                          >
                            {score}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 font-medium mt-4 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#635BFF]" />
            Your golden concentration window occurs between <strong>10:00 AM – 12:00 PM</strong> on weekdays.
          </p>

        </div>

        {/* AI Performance Recommendations */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold tracking-tight">
                AI Performance Engine
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  ✓ Flow State Efficiency
                </span>
                <p className="text-slate-300 font-medium leading-relaxed">
                  You complete complex coding & design tasks 22% faster when working in 45-minute uninterrupted sprints.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ⚠️ Meeting Load Alert
                </span>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Thursday afternoons show a 35% drop in focus efficiency due to back-to-back client calls.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  💡 Optimization Tip
                </span>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Schedule deep architecture reviews on Wednesday morning to capitalize on your peak energy cycle.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={handleExportReport}
            className="mt-6 w-full py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-[#635BFF]/30 flex items-center justify-center gap-2"
          >
            <span>Download Deep Analytics PDF</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
