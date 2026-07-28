import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Key, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Building2,
  Users,
  User,
  Mail,
  School,
  Briefcase,
  Sparkles,
  LogOut,
  UserPlus
} from 'lucide-react';
import { UserProfile, AccountType, OrgType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'switch'>('switch');
  const [accountType, setAccountType] = useState<AccountType>(user.accountType || 'OrgAdmin');
  
  // Form fields
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState(user.orgName || 'Apex Tech Academy');
  const [orgType, setOrgType] = useState<OrgType>(user.orgType || 'School/University');
  const [orgCode, setOrgCode] = useState('APEX-8921');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    onUpdateUser({
      id: `usr_${Date.now()}`,
      name: fullName,
      email: email,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: accountType === 'OrgAdmin' ? `${orgType} Admin` : 'Team Member',
      isSignedIn: true,
      accountType: accountType,
      orgId: accountType !== 'Individual' ? 'org_apex_01' : undefined,
      orgName: accountType !== 'Individual' ? orgName : undefined,
      orgType: accountType !== 'Individual' ? orgType : undefined,
      orgRole: accountType === 'OrgAdmin' ? 'Admin' : 'Member'
    });

    onClose();
  };

  const handleQuickDemoLogin = (type: 'admin' | 'member' | 'guest') => {
    if (type === 'admin') {
      onUpdateUser({
        id: 'usr_admin_001',
        name: 'Meeab Gull (Admin)',
        email: 'admin@apexacademy.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'School & Organization Admin',
        isSignedIn: true,
        accountType: 'OrgAdmin',
        orgId: 'org_apex_01',
        orgName: 'Apex Tech Academy',
        orgType: 'School/University',
        orgRole: 'Admin'
      });
    } else if (type === 'member') {
      onUpdateUser({
        id: 'usr_member_002',
        name: 'Sarah Khan',
        email: 'sarah.k@apexacademy.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Senior UI/UX Designer',
        isSignedIn: true,
        accountType: 'TeamMember',
        orgId: 'org_apex_01',
        orgName: 'Apex Tech Academy',
        orgType: 'School/University',
        orgRole: 'Member'
      });
    } else {
      onUpdateUser({
        id: 'usr_guest_003',
        name: 'Guest Individual',
        email: 'guest@flowtrack.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Individual Member',
        isSignedIn: false,
        accountType: 'Individual',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-800">
        
        {/* Top Gradient Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#635BFF] flex items-center justify-center text-white shadow-md shadow-[#635BFF]/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                FlowTrack Account & Workspace
              </h2>
              <p className="text-xs text-indigo-200">
                Sign in to manage your team, track tasks, or access organization
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl mt-4 border border-white/10">
            <button
              onClick={() => setAuthMode('switch')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'switch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Account Status
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {authMode === 'switch' ? (
            <div className="space-y-5">
              
              {/* Current Account Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#635BFF]/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-[#635BFF]">
                      {user.accountType === 'OrgAdmin' ? 'Org Admin' : user.accountType === 'TeamMember' ? 'Team Member' : 'Individual'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  
                  {user.orgName && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-1">
                      <Building2 className="w-3.5 h-3.5 text-[#635BFF]" />
                      <span>{user.orgName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preset Demo Login Switcher */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Quick Switch Role & Organization
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-3.5 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#635BFF] text-white rounded-xl">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Organization Admin (Meeab Gull)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Apex Tech Academy • Full Team Control & Task Assignment
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#635BFF] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('member')}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Team Member (Sarah Khan)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Apex Tech Academy • Works on Assigned Tasks & Logs Time
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('guest')}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-xl">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Individual User (Local Mode)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Personal Timer without Organization
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Account Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('OrgAdmin')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      accountType === 'OrgAdmin'
                        ? 'bg-purple-50 border-[#635BFF] text-slate-900 ring-2 ring-purple-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${accountType === 'OrgAdmin' ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-extrabold">Org Admin</div>
                      <div className="text-[10px] text-slate-500">School/Company Lead</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('TeamMember')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      accountType === 'TeamMember'
                        ? 'bg-purple-50 border-[#635BFF] text-slate-900 ring-2 ring-purple-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users className={`w-4 h-4 ${accountType === 'TeamMember' ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-extrabold">Team Member</div>
                      <div className="text-[10px] text-slate-500">Employee/Student</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Meeab Gull"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.edu or dev@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Organization Fields */}
              {accountType === 'OrgAdmin' && (
                <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-3">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#635BFF]" />
                    <span>Organization Details</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      School / Company / Agency Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Apex Tech Academy or Acme Corp"
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Organization Category
                    </label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as OrgType)}
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                    >
                      <option value="School/University">School / College / University</option>
                      <option value="Company">Company / Tech Business</option>
                      <option value="Agency/Studio">Agency / Design Studio</option>
                      <option value="Enterprise">Enterprise Workspace</option>
                    </select>
                  </div>
                </div>
              )}

              {accountType === 'TeamMember' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organization Invitation Code
                  </label>
                  <input
                    type="text"
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    placeholder="Enter Org Code (e.g. APEX-8921)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password || 'password123'}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5249ea] text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-[#635BFF]/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create Organization Workspace'}</span>
              </button>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure 256-bit Auth</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold text-[#635BFF] hover:underline"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

