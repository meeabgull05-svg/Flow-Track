import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Wrench, 
  Megaphone, 
  Briefcase, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Download, 
  X, 
  ArrowUpRight, 
  PieChart, 
  FileSpreadsheet, 
  Eye, 
  Sparkles,
  Building2,
  Calendar,
  Check
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface ReportsViewProps {
  tasks: Task[];
  user: UserProfile;
}

interface ReportItem {
  id: string;
  title: string;
  category: 'Sales' | 'Analytics' | 'Operations' | 'Finance' | 'Time Tracking';
  description: string;
  icon: React.ElementType;
  views: number;
  updated: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // List of pre-configured and dynamic reports matching the user's design template
  const reportsList: ReportItem[] = [
    {
      id: 'rep_001',
      title: 'Monthly Sales & Revenue Report',
      category: 'Sales',
      description: 'Sales performance, hourly billing trends, and region-wise revenue',
      icon: BarChart3,
      views: 45,
      updated: 'Updated today',
    },
    {
      id: 'rep_002',
      title: 'Q2 Financial Report',
      category: 'Finance',
      description: 'Revenue, project expenses, and billable profitability analysis',
      icon: TrendingUp,
      views: 32,
      updated: 'Updated 3 days ago',
    },
    {
      id: 'rep_003',
      title: 'Customer & Student Analytics',
      category: 'Analytics',
      description: 'User engagement, workspace retention, and active growth metrics',
      icon: Users,
      views: 28,
      updated: 'Updated 2 days ago',
    },
    {
      id: 'rep_004',
      title: 'Operations & Stopwatch Performance',
      category: 'Operations',
      description: 'Time log efficiency metrics, task audits, and productivity analysis',
      icon: Wrench,
      views: 18,
      updated: 'Updated 1 day ago',
    },
    {
      id: 'rep_005',
      title: 'Marketing & Outreach Campaigns',
      category: 'Sales',
      description: 'Campaign reach, conversion ROI, and channel performance',
      icon: Megaphone,
      views: 22,
      updated: 'Updated 5 days ago',
    },
    {
      id: 'rep_006',
      title: 'Team Performance & Timesheets',
      category: 'Operations',
      description: 'Individual and department KPIs, task logs, and active duration',
      icon: Briefcase,
      views: 15,
      updated: 'Updated 4 days ago',
    },
    {
      id: 'rep_007',
      title: 'Time Log & Audit Summary',
      category: 'Time Tracking',
      description: 'Live stopwatch logs, verified duration entries, and completion status',
      icon: Clock,
      views: 54,
      updated: 'Updated today',
    },
    {
      id: 'rep_008',
      title: 'Project Revenue & Expense Allocation',
      category: 'Analytics',
      description: 'Project-wise hourly distribution and estimated budget utilization',
      icon: PieChart,
      views: 39,
      updated: 'Updated yesterday',
    },
  ];

  const filterCategories = ['All', 'Sales', 'Analytics', 'Operations', 'Finance', 'Time Tracking'];

  // Filtered reports calculation
  const filteredReports = reportsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || item.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations for dynamic data in report detail modal
  const totalLoggedSeconds = tasks.reduce((acc, t) => acc + (t.time_spent_seconds || 0), 0);
  const totalLoggedHours = (totalLoggedSeconds / 3600).toFixed(1);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalRevenueEstimated = (totalLoggedSeconds / 3600) * 85;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner matching the user image style */}
      <div className="bg-gradient-to-r from-[#4A7FDB] to-[#3A6FCC] text-white p-5 sm:p-6 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Reports
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">
              Comprehensive analytics, time audit summaries, and exportable data
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
            {reportsList.length} Available
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 2. Search Bar */}
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A7FDB]/30 focus:border-[#4A7FDB] transition-all shadow-2xs"
            />
          </div>
          <button 
            onClick={() => showToast(`Searching for "${searchQuery || 'all reports'}"...`)}
            className="px-6 py-2.5 bg-[#4A7FDB] hover:bg-[#3A6FCC] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <span>Search</span>
          </button>
        </div>

        {/* 3. Metrics Cards (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Total Reports</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">24</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">This Month</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">8</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Shared</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">12</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 mb-1">Views (30d)</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#4A7FDB] font-mono">342</div>
          </div>
        </div>

        {/* 4. Filter by Type */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-slate-800">Filter by type</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {filterCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#4A7FDB] text-white border-[#4A7FDB] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Popular Reports Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Popular Reports</h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredReports.length} of {reportsList.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 cursor-pointer transition-all hover:border-[#4A7FDB]/60 hover:shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4A7FDB] flex items-center justify-center mb-3 group-hover:bg-[#4A7FDB] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#4A7FDB] transition-colors">
                      {report.title}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Viewed {report.views} times
                    </span>
                    <span>{report.updated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. Interactive Detail Modal for Selected Report */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#4A7FDB] to-[#3A6FCC] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-lg">
                  <selectedReport.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedReport.title}</h3>
                  <p className="text-xs text-blue-100">{selectedReport.category} Report • {selectedReport.updated}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {selectedReport.description}. Below is the generated live data summary based on active tasks and time entries.
              </p>

              {/* Dynamic Stats Grid inside report */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Logged Hours</div>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{totalLoggedHours} hrs</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Completed Tasks</div>
                  <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{completedTasks} / {tasks.length}</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Est. Revenue</div>
                  <div className="text-xl font-bold text-[#4A7FDB] font-mono mt-0.5">${totalRevenueEstimated.toFixed(0)}</div>
                </div>
              </div>

              {/* Table of Tasks matching report query */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Report Detailed Logs</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="p-3">Task Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tasks.slice(0, 5).map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-800">{t.title}</td>
                          <td className="p-3 text-slate-500">{t.category || 'General'}</td>
                          <td className="p-3 font-mono font-bold text-slate-700">{formatDuration(t.time_spent_seconds)}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Printing report summary...')}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => showToast('PDF Export started!')}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#4A7FDB]" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => showToast('CSV Report exported successfully!')}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-[#4A7FDB] hover:bg-[#3A6FCC] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
