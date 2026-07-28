import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase, 
  Filter, 
  Copy, 
  Check, 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  MoreHorizontal,
  Send,
  Sparkles,
  School,
  AlertCircle
} from 'lucide-react';
import { TeamMember, Organization, Task, Priority, UserProfile } from '../types';

interface OrganizationViewProps {
  user: UserProfile;
  organization: Organization;
  teamMembers: TeamMember[];
  onAddTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  onAssignTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'time_spent_seconds'>) => void;
  tasks: Task[];
  onOpenAuthModal: () => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  user,
  organization,
  teamMembers,
  onAddTeamMember,
  onAssignTask,
  tasks,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [selectedMemberForTask, setSelectedMemberForTask] = useState<TeamMember | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<TeamMember | null>(null);

  // Add Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Senior Developer');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');

  // Assign Task Form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignCategory, setAssignCategory] = useState('Development');
  const [assignPriority, setAssignPriority] = useState<Priority>('High');
  const [assignEstHours, setAssignEstHours] = useState('2');
  const [assignMemberId, setAssignMemberId] = useState('');

  // Copy Org Code
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organization.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    onAddTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 10000000)}?w=150&auto=format&fit=crop&q=80`,
      role: newMemberRole,
      department: newMemberDept,
      activeStatus: 'Idle',
      todayLoggedSeconds: 0,
      weeklyLoggedSeconds: 0,
      completedTasksCount: 0,
      assignedTasksCount: 0,
      orgRole: 'Member'
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddMemberOpen(false);
  };

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = teamMembers.find(m => m.id === (assignMemberId || selectedMemberForTask?.id));
    if (!assignTitle || !targetMember) return;

    onAssignTask({
      user_id: targetMember.id,
      title: assignTitle,
      category: assignCategory,
      priority: assignPriority,
      status: 'Pending',
      estimated_seconds: (parseFloat(assignEstHours) || 2) * 3600,
      assigned_to_id: targetMember.id,
      assigned_to_name: targetMember.name,
      assigned_by_name: user.name,
      tags: ['Organization', targetMember.department]
    });

    setAssignTitle('');
    setIsAssignTaskOpen(false);
    setSelectedMemberForTask(null);
  };

  const openAssignForMember = (member: TeamMember) => {
    setSelectedMemberForTask(member);
    setAssignMemberId(member.id);
    setIsAssignTaskOpen(true);
  };

  // Filtered members list
  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'all' || m.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || m.activeStatus === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeTrackingCount = teamMembers.filter(m => m.activeStatus === 'Tracking').length;
  const totalLoggedTodaySecs = teamMembers.reduce((acc, m) => acc + m.todayLoggedSeconds, 0);

  const formatHoursMinutes = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const isAdmin = user.accountType === 'OrgAdmin' || user.orgRole === 'Admin';

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Subtle Background Lighting Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#635BFF]" />
                {organization.type} Workspace
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {isAdmin ? 'Admin Mode Active' : 'Team Member View'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {organization.name}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              Track real-time work, manage assigned tasks, and monitor active hours for your school, company, or team members.
            </p>
          </div>

          {/* Right Header Actions & Join Code Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Org Invitation Code Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  Organization Join Code
                </div>
                <div className="text-sm font-mono font-black text-white tracking-widest mt-0.5">
                  {organization.code}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="Copy Organization Join Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="py-3.5 px-5 bg-[#635BFF] hover:bg-[#5249ea] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#635BFF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Team Member</span>
              </button>
            )}

          </div>

        </div>

        {/* Stats Strip Inside Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 mt-6 border-t border-white/10 relative z-10">
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <span className="text-[11px] font-medium text-slate-300 block">Total Team Members</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
              <span>{teamMembers.length}</span>
              <span className="text-xs font-normal text-indigo-300">Active</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <span className="text-[11px] font-medium text-slate-300 block">Currently Tracking Live</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 flex items-center gap-2">
              <span>{activeTrackingCount}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <span className="text-[11px] font-medium text-slate-300 block">Team Logged Today</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
              {formatHoursMinutes(totalLoggedTodaySecs)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <span className="text-[11px] font-medium text-slate-300 block">Assigned Active Tasks</span>
            <div className="text-xl sm:text-2xl font-black text-purple-200 mt-1">
              {tasks.length}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Admin Command Toolbar (Search, Filter, Quick Assign) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, role, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#635BFF] transition-all"
          />
        </div>

        {/* Filter Dropdowns & Assign Task Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Tracking">🟢 Live Tracking</option>
              <option value="Break">🟡 On Break</option>
              <option value="Idle">⚪ Idle</option>
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAssignTaskOpen(true)}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Task to Member</span>
            </button>
          )}

        </div>

      </div>

      {/* 3. Team Members Grid / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#635BFF]" />
            <span>Organization Team Overview</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#635BFF] text-xs font-bold">
              {filteredMembers.length} Members
            </span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Real-time status synced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isTracking = member.activeStatus === 'Tracking';
            const isOnBreak = member.activeStatus === 'Break';

            return (
              <div 
                key={member.id}
                className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                
                {/* Top Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isTracking ? 'bg-emerald-500 animate-pulse' : isOnBreak ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.orgRole === 'Admin' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-100 text-[#635BFF] font-bold">
                            Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{member.department}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 ${
                    isTracking 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : isOnBreak 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isTracking ? 'bg-emerald-500 animate-ping' : isOnBreak ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    {isTracking ? 'Tracking' : isOnBreak ? 'Break' : 'Idle'}
                  </span>
                </div>

                {/* Current Active Task Box */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isTracking ? 'Active Live Task' : 'Last Assigned Task'}
                  </span>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {member.currentTaskTitle || 'No active task working'}
                  </div>
                </div>

                {/* Performance Stats Row */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Today Logged</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {formatHoursMinutes(member.todayLoggedSeconds)}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block">Assigned Tasks</span>
                    <span className="text-xs font-bold text-[#635BFF]">
                      {member.assignedTasksCount} tasks
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => openAssignForMember(member)}
                      className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-[#635BFF] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Task</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedMemberDetail(member)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="View Member Activity"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-[#635BFF] rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">Invite Team Member</h3>
              </div>
              <button 
                onClick={() => setIsAddMemberOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Member Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Professor Ali or Jane Smith"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="teacher@school.edu or dev@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Mathematics Teacher or Lead UI Designer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Department / Class</label>
                <select
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                >
                  <option value="Engineering">Engineering / Development</option>
                  <option value="Design & Product">Design & Product</option>
                  <option value="Academic Faculty">Academic Faculty / School Dept</option>
                  <option value="Management">Management & Ops</option>
                  <option value="Students">Student Class Group</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5249ea] text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-[#635BFF]/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Send Invitation to Member</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Assign Task Modal */}
      {isAssignTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-[#635BFF] rounded-xl">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">Assign Task to Team Member</h3>
              </div>
              <button 
                onClick={() => setIsAssignTaskOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Member</label>
                <select
                  value={assignMemberId || selectedMemberForTask?.id || ''}
                  onChange={(e) => setAssignMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                >
                  <option value="">-- Choose Team Member --</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Grade Class 10 Physics Midterm or Design Login Screen"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={assignCategory}
                    onChange={(e) => setAssignCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Academics">Academics</option>
                    <option value="Research">Research</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Estimated Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={assignEstHours}
                  onChange={(e) => setAssignEstHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5249ea] text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-[#635BFF]/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Assign Task & Notify Member</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Member Detail Drawer / Modal */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMemberDetail.avatar}
                  alt={selectedMemberDetail.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedMemberDetail.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedMemberDetail.role} • {selectedMemberDetail.department}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMemberDetail(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Today Logged</span>
                  <div className="text-lg font-mono font-black text-slate-900 mt-0.5">
                    {formatHoursMinutes(selectedMemberDetail.todayLoggedSeconds)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Hours</span>
                  <div className="text-lg font-mono font-black text-[#635BFF] mt-0.5">
                    {formatHoursMinutes(selectedMemberDetail.weeklyLoggedSeconds)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 mb-2">Assigned Tasks for this Member:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {tasks.filter(t => t.assigned_to_id === selectedMemberDetail.id || t.user_id === selectedMemberDetail.id).length === 0 ? (
                    <div className="p-4 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                      No tasks assigned yet.
                    </div>
                  ) : (
                    tasks
                      .filter(t => t.assigned_to_id === selectedMemberDetail.id || t.user_id === selectedMemberDetail.id)
                      .map(t => (
                        <div key={t.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 block">{t.title}</span>
                            <span className="text-[10px] text-slate-400">{t.category} • Priority: {t.priority}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-[#635BFF]'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const m = selectedMemberDetail;
                  setSelectedMemberDetail(null);
                  openAssignForMember(m);
                }}
                className="w-full py-3 bg-[#635BFF] hover:bg-[#5249ea] text-white font-extrabold text-xs rounded-2xl shadow-xs"
              >
                Assign New Task
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
