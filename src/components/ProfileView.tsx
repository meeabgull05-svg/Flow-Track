import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Key, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Calendar, 
  Users, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Lock, 
  ArrowLeft, 
  BarChart3, 
  Flame, 
  Bell, 
  Award, 
  Zap, 
  Briefcase, 
  Plus, 
  CheckSquare, 
  ShieldAlert, 
  Smartphone, 
  Globe, 
  FileText,
  UserPlus,
  RefreshCw,
  LogOut,
  Upload
} from 'lucide-react';
import { UserProfile, Organization, TeamMember, Task } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
  organization: Organization;
  teamMembers: TeamMember[];
  tasks: Task[];
  onNavigateTab: (tab: any) => void;
  onToggleTimer?: (taskId: string) => void;
  activeTimerTaskId?: string | null;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  organization,
  teamMembers,
  tasks,
  onNavigateTab,
  onToggleTimer,
  activeTimerTaskId,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'security' | 'organization'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State for editing user details
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editRole, setEditRole] = useState(user.role);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editOrgName, setEditOrgName] = useState(user.orgName || organization.name);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Password edit state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Preset Avatars for quick selection
  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ];

  const isAdmin = user.accountType === 'OrgAdmin' || user.orgRole === 'Admin';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organization.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: editName,
      email: editEmail,
      role: editRole,
      avatar: editAvatar,
      orgName: editOrgName
    };
    onUpdateUser(updated);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setPassError('Please enter your current password');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Passwords do not match');
      return;
    }
    setPassError('');
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  // Quick Role Switcher for live testing both Admin & Team Member views
  const handleRoleSwitch = (roleType: 'Admin' | 'Member' | 'Student') => {
    if (roleType === 'Admin') {
      const updated: UserProfile = {
        ...user,
        name: user.name.includes('(Admin)') ? user.name : `${user.name.replace(/\(.*?\)/g, '').trim()} (Admin)`,
        role: 'School & Organization Admin',
        accountType: 'OrgAdmin',
        orgRole: 'Admin'
      };
      onUpdateUser(updated);
      setEditRole(updated.role);
      setEditName(updated.name);
    } else if (roleType === 'Member') {
      const updated: UserProfile = {
        ...user,
        name: user.name.replace('(Admin)', '').trim(),
        role: 'Senior Faculty & UI/UX Designer',
        accountType: 'TeamMember',
        orgRole: 'Member'
      };
      onUpdateUser(updated);
      setEditRole(updated.role);
      setEditName(updated.name);
    } else {
      const updated: UserProfile = {
        ...user,
        name: user.name.replace('(Admin)', '').trim(),
        role: 'Research Student & Scholar',
        accountType: 'TeamMember',
        orgRole: 'Member'
      };
      onUpdateUser(updated);
      setEditRole(updated.role);
      setEditName(updated.name);
    }
  };

  // Compute User Specific Task Stats
  const userTasks = tasks.filter(t => t.user_id === user.id || t.assigned_to_id === user.id);
  const completedCount = userTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = userTasks.filter(t => t.status === 'In Progress').length;
  const totalLoggedSeconds = userTasks.reduce((acc, curr) => acc + curr.time_spent_seconds, 0);

  const formatHoursMinutes = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#3C83F6]" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Profile Header Card (Exact match to User Image request!) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Background Radial Lights */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* User Badge Section (Avatar + Name + Role pill) */}
          <div className="flex items-center gap-4 sm:gap-5">
            
            {/* Avatar with Online Pulse */}
            <div className="relative">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-400 shadow-lg">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-800"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            {/* Profile Info Text */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-200">
                  {user.role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-extrabold text-blue-200">
                  {isAdmin ? 'ADMIN ACCESS' : 'MEMBER'}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium flex items-center gap-2 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.orgName || organization.name}</span>
                <span className="text-slate-500">•</span>
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.email}</span>
              </p>
            </div>

          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('edit')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-purple-300" />
              <span>Edit Profile</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigateTab('organization')}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#3C83F6] hover:bg-blue-600 rounded-xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>Manage Team</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Profile Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-[#3C83F6] text-[#3C83F6]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isAdmin ? 'Admin Overview & Org Stats' : 'Personal Performance & Tasks'}</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'edit'
              ? 'border-[#3C83F6] text-[#3C83F6]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Account Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('organization')}
          className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'organization'
              ? 'border-[#3C83F6] text-[#3C83F6]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#3C83F6] text-[#3C83F6]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Passwords</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ROLE STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Time Logged</span>
                <div className="p-2 bg-blue-50 text-[#3C83F6] rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatHoursMinutes(totalLoggedSeconds)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isAdmin ? 'Across personal & org stopwatches' : 'Logged this month'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Tasks</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {completedCount} <span className="text-sm font-bold text-slate-400">/ {userTasks.length}</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                <span>{userTasks.length > 0 ? Math.round((completedCount / userTasks.length) * 100) : 100}% Velocity Rate</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isAdmin ? 'Org Active Members' : 'Current Active Task'}
                </span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  {isAdmin ? <Users className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 truncate">
                {isAdmin ? `${teamMembers.length} Members` : (inProgressCount > 0 ? `${inProgressCount} Running` : 'Idle')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {isAdmin ? '5 Active on dashboard' : 'Active stopwatch ready'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Code</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-black text-slate-900">{organization.code}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Use code for instant member join</p>
            </div>

          </div>

          {/* ADMIN-SPECIFIC DASHBOARD VIEW */}
          {isAdmin ? (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#3C83F6]" />
                      <span>Admin Privileges & Master Controls</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Your account has full administrative authority over {user.orgName || organization.name}.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 text-[#3C83F6] border border-blue-200 rounded-xl text-xs font-black shrink-0">
                    FULL ACCESS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      <span>Invite & Onboard Team</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Issue invite codes, assign faculty/students, and manage onboarding permissions.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span>365-Day Timesheet Audits</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Review live team timers, approve time logs, and export annual audit reports.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Workspace Configuration</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Configure organizational work hours, default project tags, and custom departments.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>Data Security & Backups</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Manage Cloud SQL backups, OAuth security, and user role overrides.
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members Snapshot */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#3C83F6]" />
                    <span>Managed Team Members ({teamMembers.length})</span>
                  </h3>
                  <button
                    onClick={() => onNavigateTab('organization')}
                    className="text-xs font-extrabold text-[#3C83F6] hover:underline cursor-pointer"
                  >
                    View All in Workspace →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {teamMembers.map(member => (
                    <div key={member.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {member.orgRole === 'Admin' && (
                              <span className="px-1.5 py-0.2 bg-blue-100 text-[#3C83F6] rounded text-[9px] font-black">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{member.role} • {member.department}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          member.activeStatus === 'Tracking'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {member.activeStatus}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {formatHoursMinutes(member.todayLoggedSeconds)} today
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* TEAM MEMBER / STUDENT SPECIFIC DASHBOARD VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* My Assigned Tasks & Activities */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#3C83F6]" />
                      <span>My Assigned Tasks ({userTasks.length})</span>
                    </h3>
                    <button
                      onClick={() => onNavigateTab('projects')}
                      className="text-xs font-extrabold text-[#3C83F6] hover:underline cursor-pointer"
                    >
                      View All Tasks →
                    </button>
                  </div>

                  {userTasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <p className="text-xs font-bold">No tasks assigned yet!</p>
                      <button
                        onClick={() => onNavigateTab('dashboard')}
                        className="px-4 py-2 bg-[#3C83F6] text-white rounded-xl text-xs font-extrabold"
                      >
                        Create New Task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {userTasks.slice(0, 5).map(task => (
                        <div
                          key={task.id}
                          className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                task.priority === 'High' || task.priority === 'Urgent'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-blue-100 text-[#3C83F6]'
                              }`}>
                                {task.priority}
                              </span>
                              <h4 className="text-xs font-extrabold text-slate-900 truncate">{task.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{task.category} • Assigned by Principal</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {formatHoursMinutes(task.time_spent_seconds)}
                            </span>
                            {onToggleTimer && (
                              <button
                                onClick={() => onToggleTimer(task.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                                  activeTimerTaskId === task.id
                                    ? 'bg-emerald-500 text-white animate-pulse'
                                    : 'bg-[#3C83F6] text-white hover:bg-blue-600'
                                }`}
                              >
                                {activeTimerTaskId === task.id ? 'Timing...' : 'Start'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Member Profile Sidebar */}
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Personal Badges</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                      <Flame className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <b className="text-xs font-extrabold text-amber-900 block">5-Day Active Streak 🔥</b>
                        <p className="text-[10px] text-amber-700 font-medium">Consistently logged tasks daily</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-200/80">
                      <Award className="w-6 h-6 text-purple-600 shrink-0" />
                      <div>
                        <b className="text-xs font-extrabold text-purple-900 block">Top Task Resolver</b>
                        <p className="text-[10px] text-purple-700 font-medium">{completedCount} tasks completed this month</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: EDIT PROFILE FORM */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">Edit Profile & Account Settings</h3>
            <p className="text-xs text-slate-500 font-medium">Update your personal information, job title, and avatar picture.</p>
          </div>

          {isSavedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Profile information updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">Profile Avatar Photo</label>
              
              <div className="flex items-center gap-4">
                <img
                  src={editAvatar}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 bg-slate-100 shrink-0"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(url)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                          editAvatar === url ? 'border-[#3C83F6] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      id="avatar-file-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setEditAvatar(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="avatar-file-upload"
                      className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#3C83F6] border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from PC</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Select any image file (PNG, JPG, WEBP) from your device</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Role / Job Title</label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Organization Name</label>
                <input
                  type="text"
                  required
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
                />
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-[#3C83F6] hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 3: ORGANIZATION DETAILS */}
      {activeTab === 'organization' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">{organization.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Organization Workspace Details & Join Information</p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-extrabold">
              {organization.type}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Administrator</span>
              <p className="text-sm font-black text-slate-900">{organization.adminName}</p>
              <p className="text-xs text-slate-500 font-medium">{organization.adminEmail}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Workspace Join Code</span>
              <div className="flex items-center justify-between">
                <p className="text-lg font-mono font-black text-slate-900">{organization.code}</p>
                <button
                  onClick={handleCopyCode}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-[#3C83F6] cursor-pointer"
                >
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Workspace Members</span>
              <p className="text-lg font-black text-slate-900">{teamMembers.length} Members</p>
              <p className="text-xs text-emerald-600 font-bold">5 Active Stopwatches</p>
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('organization')}
              className="px-5 py-2.5 bg-[#3C83F6] hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Go to Organization Management Screen</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 4: SECURITY & PASSWORDS */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">Security & Password Management</h3>
            <p className="text-xs text-slate-500 font-medium">Keep your account secure with a strong password and multi-factor settings.</p>
          </div>

          {passSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {passError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#3C83F6]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Update Password</span>
            </button>

          </form>

          {onLogout && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-slate-900">Sign Out of Session</h4>
                <p className="text-[11px] text-slate-500 font-medium">Log out from this session securely.</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out Now</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
