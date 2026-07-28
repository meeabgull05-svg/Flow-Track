import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Printer, 
  Share2, 
  Folder, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight,
  Send,
  PieChart,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface ReportsViewProps {
  tasks: Task[];
  user: UserProfile;
}

interface ReportRow {
  id: string;
  date: string;
  taskTitle: string;
  project: string;
  category: string;
  durationSeconds: number;
  hourlyRate: number;
  isBillable: boolean;
  status: 'Approved' | 'Pending Review' | 'Billed';
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks, user }) => {
  // Filter States
  const [dateRange, setDateRange] = useState<'thisWeek' | 'lastWeek' | 'thisMonth' | 'custom'>('thisWeek');
  const [selectedProject, setSelectedProject] = useState<string>('All Projects');
  const [groupBy, setGroupBy] = useState<'Date' | 'Project' | 'Category'>('Project');
  const [billableOnly, setBillableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Convert tasks to detailed report rows with mock financial billable data
  const reportRows: ReportRow[] = tasks.map((t, idx) => {
    const defaultRates: { [cat: string]: number } = {
      'UI Design': 85,
      'Development': 95,
      'Full-Stack Web': 100,
      'Meetings': 60,
      'Research': 70,
    };
    const rate = defaultRates[t.category || 'Development'] || 80;
    const isBill = idx % 5 !== 4; // 80% billable

    return {
      id: t.id,
      date: t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 24, 2024',
      taskTitle: t.title,
      project: t.category === 'UI Design' ? 'FlowTrack Website' : t.category === 'Full-Stack Web' ? 'WeVersity Platform' : 'Client Dashboard',
      category: t.category || 'Development',
      durationSeconds: t.time_spent_seconds || 3600,
      hourlyRate: rate,
      isBillable: isBill,
      status: idx % 3 === 0 ? 'Approved' : idx % 3 === 1 ? 'Billed' : 'Pending Review',
    };
  });

  // Filter calculation
  const filteredRows = reportRows.filter((row) => {
    const matchesSearch = row.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === 'All Projects' || row.project === selectedProject;
    const matchesBillable = !billableOnly || row.isBillable;
    return matchesSearch && matchesProject && matchesBillable;
  });

  // Totals calculations
  const totalSeconds = filteredRows.reduce((acc, r) => acc + r.durationSeconds, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const billableRows = filteredRows.filter(r => r.isBillable);
  const totalBillableSeconds = billableRows.reduce((acc, r) => acc + r.durationSeconds, 0);
  const totalBillableHours = (totalBillableSeconds / 3600).toFixed(1);
  const totalRevenue = billableRows.reduce((acc, r) => acc + (r.durationSeconds / 3600) * r.hourlyRate, 0);

  // Grouped project summary calculation
  const projectSummaryMap: { [proj: string]: { hours: number; revenue: number; color: string } } = {
    'FlowTrack Website': { hours: 0, revenue: 0, color: 'bg-[#635BFF]' },
    'WeVersity Platform': { hours: 0, revenue: 0, color: 'bg-emerald-500' },
    'Client Dashboard': { hours: 0, revenue: 0, color: 'bg-blue-500' },
  };

  filteredRows.forEach(r => {
    if (!projectSummaryMap[r.project]) {
      projectSummaryMap[r.project] = { hours: 0, revenue: 0, color: 'bg-purple-500' };
    }
    const hrs = r.durationSeconds / 3600;
    projectSummaryMap[r.project].hours += hrs;
    if (r.isBillable) {
      projectSummaryMap[r.project].revenue += hrs * r.hourlyRate;
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Timesheets
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#635BFF] text-xs font-bold">
              Automated Billing
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Export verified time entries, client billing summaries, and audit logs.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => showToast('Printing summary report...')}
            className="p-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-all shadow-xs"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast('PDF Report downloaded to downloads folder!')}
            className="px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#635BFF]" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => showToast('CSV Timesheet exported successfully!')}
            className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#635BFF]/25 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-200" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimated Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            88% billable efficiency
          </p>
        </div>

        {/* KPI 2: Total Hours */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Logged Time
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-[#635BFF]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalHours} hrs
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Across {filteredRows.length} logged entries
          </p>
        </div>

        {/* KPI 3: Billable Hours */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Billable Hours
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalBillableHours} hrs
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              (${ (totalRevenue / (Math.max(1, Number(totalBillableHours)))).toFixed(0) }/hr avg)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Ready for client invoicing
          </p>
        </div>

        {/* KPI 4: Approved Timesheets */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Audit Status
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              100%
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Zero timer conflicts detected
          </p>
        </div>

      </div>

      {/* 3. Filters Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by task name, project..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
            />
          </div>

          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
          >
            <option value="All Projects">All Projects</option>
            <option value="FlowTrack Website">FlowTrack Website</option>
            <option value="WeVersity Platform">WeVersity Platform</option>
            <option value="Client Dashboard">Client Dashboard</option>
          </select>

          {/* Group By */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <span className="px-2 text-slate-400 uppercase text-[10px]">Group:</span>
            {(['Project', 'Date', 'Category'] as const).map((group) => (
              <button
                key={group}
                onClick={() => setGroupBy(group)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  groupBy === group
                    ? 'bg-white text-[#635BFF] shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

        </div>

        {/* Right Billable Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={billableOnly}
              onChange={(e) => setBillableOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#635BFF] focus:ring-[#635BFF]"
            />
            <span>Billable Only</span>
          </label>
        </div>

      </div>

      {/* 4. Client Breakdown Cards & Main Timesheet Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Detailed Timesheet Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Timesheet Entries</h3>
              <p className="text-xs text-slate-400">Detailed breakdown of time logs ready for approval.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#635BFF]">
              {filteredRows.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Task Name</th>
                  <th className="pb-3 font-semibold">Project</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Rate</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => {
                  const hours = row.durationSeconds / 3600;
                  const rowTotal = hours * row.hourlyRate;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-medium text-slate-500 whitespace-nowrap">{row.date}</td>
                      <td className="py-3 font-bold text-slate-900">
                        {row.taskTitle}
                        {!row.isBillable && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold">
                            Non-Billable
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-semibold text-slate-600">{row.project}</td>
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {formatDuration(row.durationSeconds)}
                      </td>
                      <td className="py-3 font-mono text-slate-600">${row.hourlyRate}/h</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">
                        {row.isBillable ? `$${rowTotal.toFixed(2)}` : '$0.00'}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.status === 'Billed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 text-xs font-extrabold">
                  <td colSpan={3} className="pt-3 text-slate-800">Total Filtered</td>
                  <td className="pt-3 font-mono text-[#635BFF]">{formatDuration(totalSeconds)}</td>
                  <td className="pt-3 text-slate-400">—</td>
                  <td className="pt-3 font-mono text-emerald-700 text-sm">
                    ${totalRevenue.toFixed(2)}
                  </td>
                  <td className="pt-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column: Project Revenue Allocation */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Project Revenue Split</h3>
            
            <div className="space-y-4">
              {Object.entries(projectSummaryMap).map(([projName, summary]) => {
                const totalRev = totalRevenue || 1;
                const percent = Math.min(100, Math.round((summary.revenue / totalRev) * 100));

                return (
                  <div key={projName} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${summary.color}`} />
                        {projName}
                      </span>
                      <span className="font-mono text-emerald-700 font-extrabold">
                        ${summary.revenue.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>{summary.hours.toFixed(1)} hrs logged</span>
                      <span>{percent}% of total</span>
                    </div>

                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div className={`${summary.color} h-1.5 rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Automatic Client Invoice Card */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg space-y-3 relative overflow-hidden">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h4 className="text-sm font-extrabold">Generate Client Invoice</h4>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              Instantly transform these timesheets into a professional Stripe or PDF invoice.
            </p>
            <button
              onClick={() => showToast('Client Invoice created in draft mode!')}
              className="w-full mt-2 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create Invoice Draft</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
