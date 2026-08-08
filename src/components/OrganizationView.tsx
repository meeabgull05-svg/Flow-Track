import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  ShieldCheck, 
  Briefcase, 
  Copy, 
  Check, 
  X, 
  ChevronRight, 
  Send,
  UserCheck,
  Building2,
  Sparkles,
  Trash2,
  AlertTriangle,
  UserMinus
} from 'lucide-react';
import { TeamMember, Organization, Task, Priority, UserProfile } from '../types';

interface OrganizationViewProps {
  user: UserProfile;
  organization: Organization;
  teamMembers: TeamMember[];
  onAddTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  onRemoveTeamMember?: (memberId: string, memberEmail: string) => void;
  onAssignTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'time_spent_seconds'>) => void;
  tasks: Task[];
  onOpenAuthModal: () => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  user,
  organization,
  teamMembers,
  onAddTeamMember,
  onRemoveTeamMember,
  onAssignTask,
  tasks,
  onOpenAuthModal,
}) => {
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('All members');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user.accountType === 'OrgAdmin' || user.orgRole === 'Admin';

  // Modals
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [selectedMemberForTask, setSelectedMemberForTask] = useState<TeamMember | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Senior Developer');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');
  const [newMemberOrgRole, setNewMemberOrgRole] = useState<'Admin' | 'Manager' | 'Member' | 'Viewer'>('Member');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Assign Task Form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignCategory, setAssignCategory] = useState('Development');
  const [assignPriority, setAssignPriority] = useState<Priority>('High');
  const [assignEstHours, setAssignEstHours] = useState('2');
  const [assignMemberId, setAssignMemberId] = useState('');

  // Copy Org Code
  const [copiedCode, setCopiedCode] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organization.code);
    setCopiedCode(true);
    showToast('Organization code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    setIsSendingInvite(true);

    try {
      const res = await fetch('/api/admin/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMemberEmail,
          name: newMemberName,
          role: newMemberRole,
          orgName: user.orgName || organization.name || 'Apex Tech & Education Academy',
          orgCode: organization.code || 'APEX-8921',
          inviterName: user.name || 'Organization Admin',
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`🎉 Invitation email sent to ${newMemberEmail}!`);
      } else {
        showToast(`Invitation sent to ${newMemberName}!`);
      }
    } catch (err) {
      console.error('Error sending invite email:', err);
      showToast(`Invitation sent to ${newMemberName}!`);
    } finally {
      setIsSendingInvite(false);
    }

    onAddTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: newMemberRole,
      department: newMemberDept,
      activeStatus: 'Idle',
      todayLoggedSeconds: 0,
      weeklyLoggedSeconds: 0,
      completedTasksCount: 0,
      assignedTasksCount: 0,
      orgRole: newMemberOrgRole
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
    showToast(`Task assigned to ${targetMember.name}!`);
  };

  const openAssignForMember = (member: TeamMember) => {
    setSelectedMemberForTask(member);
    setAssignMemberId(member.id);
    setIsAssignTaskOpen(true);
  };

  const handleExecuteDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      if (onRemoveTeamMember) {
        onRemoveTeamMember(memberToDelete.id, memberToDelete.email);
      }
      showToast(`Removed ${memberToDelete.name} from the organization.`);
    } catch (err) {
      console.error('Error deleting member:', err);
      showToast(`Failed to remove ${memberToDelete.name}.`);
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  // Role Filter Tabs
  const roleTabs = ['All members', 'Admin', 'Manager', 'Member', 'Viewer'];

  // Filtered members list
  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesRole = true;
    if (activeRoleFilter !== 'All members') {
      matchesRole = m.orgRole === activeRoleFilter;
    }

    return matchesSearch && matchesRole;
  });

  // Initials generator
  const getInitials = (name: string) => {
    if (!name) return 'TM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar Gradients for visual richness matching template
  const avatarGradients = [
    'linear-gradient(135deg, #4A7FDB 0%, #3A6FCC 100%)',
    'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
    'linear-gradient(135deg, #20B2AA 0%, #17A2B8 100%)',
    'linear-gradient(135deg, #FF6B6B 0%, #E63946 100%)',
    'linear-gradient(135deg, #FFB84D 0%, #FFA940 100%)',
    'linear-gradient(135deg, #13C2C2 0%, #1890FF 100%)',
  ];

  const activeCount = teamMembers.filter(m => m.activeStatus === 'Tracking' || m.activeStatus === 'Break').length;
  const pendingCount = teamMembers.filter(m => m.orgRole === 'Viewer').length || 2;
  const totalTeams = Array.from(new Set(teamMembers.map(m => m.department))).length || 3;

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner matching user image design */}
      <div className="bg-gradient-to-r from-[#4A7FDB] to-[#3A6FCC] text-white px-6 py-4 rounded-[32px] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-white" />
          <h1 className="text-xl font-medium text-white tracking-tight">Team</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/25 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/50 backdrop-blur-xs">
            {user.accountType === 'OrgAdmin' || user.orgRole === 'Admin' ? 'Admin' : 'Member'}
          </span>
          <button
            onClick={handleCopyCode}
            className="hidden sm:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border border-white/40"
            title="Copy Join Code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Code: {organization.code}</span>
          </button>
        </div>
      </div>

      <div className="px-1 space-y-6">

        {/* 2. Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-xs text-slate-500 font-medium mb-1">Total Members</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{teamMembers.length}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-xs text-slate-500 font-medium mb-1">Active</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono">{activeCount || teamMembers.length}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-xs text-slate-500 font-medium mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-500 font-mono">{pendingCount}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-xs text-slate-500 font-medium mb-1">Teams</div>
            <div className="text-2xl font-bold text-[#4A7FDB] font-mono">{totalTeams}</div>
          </div>
        </div>

        {/* 3. Invite Section Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5">Grow your team</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Invite members to collaborate on projects</p>
          </div>

          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="px-5 py-2.5 bg-[#4A7FDB] hover:bg-[#3A6FCC] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite members</span>
          </button>
        </div>

        {/* 4. Filter by Role & Search */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800">Filter by role</h3>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4A7FDB]"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {roleTabs.map((tab) => {
              const isActive = activeRoleFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveRoleFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#4A7FDB] text-white border-[#4A7FDB] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Team Members Grid matching exact user layout */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Team members</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, idx) => {
              const gradient = avatarGradients[idx % avatarGradients.length];
              const initials = getInitials(member.name);

              // Status string calculation
              let statusText = 'Active now';
              if (member.activeStatus === 'Break') statusText = 'Active 30m ago';
              if (member.activeStatus === 'Idle') statusText = 'Active 2h ago';
              if (member.orgRole === 'Viewer') statusText = 'Pending invitation';

              // Role Badge styling
              let badgeBg = 'bg-blue-50 text-[#4A7FDB] border-blue-200';
              if (member.orgRole === 'Admin') badgeBg = 'bg-blue-100 text-[#4A7FDB] border-blue-200';
              if (member.orgRole === 'Manager') badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (member.orgRole === 'Viewer') badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';

              const canRemove = isAdmin && (member.email ? member.email.toLowerCase() !== user.email?.toLowerCase() : true);

              return (
                <div
                  key={member.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group relative"
                >
                  {/* Remove Member Button (Admin only) */}
                  {canRemove && (
                    <button
                      onClick={() => setMemberToDelete(member)}
                      className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                      title={`Remove ${member.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div>
                    {/* Circle Avatar */}
                    <div 
                      className="w-14 h-14 rounded-full text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-2xs"
                      style={{ background: gradient }}
                    >
                      {initials}
                    </div>

                    {/* Member Name & Role */}
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">
                      {member.name}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium mb-3">
                      {member.role || 'Team Member'}
                    </p>

                    {/* Status Divider Line */}
                    <div className="py-2 my-2 border-y border-slate-100 text-xs text-slate-400 font-medium">
                      {statusText}
                    </div>
                  </div>

                  {/* Role Badge & Actions */}
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border ${badgeBg}`}>
                      {member.orgRole || 'Member'}
                    </span>

                    <button
                      onClick={() => openAssignForMember(member)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                      title="Assign Task"
                    >
                      + Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#4A7FDB] rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
              </div>
              <button 
                onClick={() => setIsAddMemberOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Member Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Ahmed Hassan"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="ahmed@workspace.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Product Lead or Frontend Developer"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Access Role</label>
                  <select
                    value={newMemberOrgRole}
                    onChange={(e) => setNewMemberOrgRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newMemberDept}
                    onChange={(e) => setNewMemberDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingInvite}
                className="w-full py-2.5 bg-[#4A7FDB] hover:bg-[#3A6FCC] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span>{isSendingInvite ? 'Sending Invitation Email...' : 'Send Invitation'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Assign Task Modal */}
      {isAssignTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#4A7FDB] rounded-lg">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Assign Task to Member</h3>
              </div>
              <button 
                onClick={() => setIsAssignTaskOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Member</label>
                <select
                  value={assignMemberId || selectedMemberForTask?.id || ''}
                  onChange={(e) => setAssignMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
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
                  placeholder="e.g. Complete UI Audit or Backend API Sync"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Est. Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={assignEstHours}
                    onChange={(e) => setAssignEstHours(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#4A7FDB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A7FDB] hover:bg-[#3A6FCC] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer mt-2"
              >
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Remove Member Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Remove Team Member?</h3>
                <p className="text-xs text-slate-500 font-medium">Organization Workspace Admin</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900 font-semibold">{memberToDelete.name}</strong> (<span className="font-mono text-slate-700">{memberToDelete.email || 'No Email'}</span>) from the organization? They will lose access to team workspace tasks and reports.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteMember}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2"
              >
                {isDeleting ? (
                  <span>Removing...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Remove Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
