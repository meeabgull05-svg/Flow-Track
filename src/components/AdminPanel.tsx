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
  AlertCircle,
  Ban,
  UserX,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowLeft,
  LogOut
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
  isSuspended?: boolean;
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

  // Admin Authentication State (Default: meeabgull05@gmail.com / meerab123)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('flowtrack_admin_auth') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('flowtrack_admin_pwd') || 'meerab123';
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('meeabgull05@gmail.com');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');

  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return 'me*********@gmail.com';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}${'*'.repeat(Math.max(6, name.length - 2))}@${domain}`;
  };
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.toLowerCase().trim();
    if (cleanEmail === 'meeabgull05@gmail.com' && loginPass === adminPassword) {
      sessionStorage.setItem('flowtrack_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Admin Email or Password. Access denied.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('flowtrack_admin_auth');
    setIsAuthenticated(false);
  };

  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleSendRecoveryCode = async () => {
    const cleanEmail = 'meeabgull05@gmail.com';
    setForgotEmail(cleanEmail);

    setIsOtpLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const json = await res.json();
      if (json.success) {
        setForgotSuccess(`Verification OTP sent to your mail (${maskEmail(cleanEmail)})!`);
        setForgotStep('otp');
      } else {
        setForgotError(json.message || 'Failed to send recovery OTP code.');
      }
    } catch (err) {
      setForgotError('Error connecting to backend server. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setForgotError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setIsOtpLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: enteredOtp.trim() }),
      });

      const json = await res.json();
      if (json.success) {
        setForgotError('');
        setForgotSuccess('OTP verified successfully!');
        setForgotStep('reset');
      } else {
        setForgotError(json.message || 'Invalid or expired OTP code. Please check your email.');
      }
    } catch (err) {
      setForgotError('Error verifying OTP code. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 4) {
      setForgotError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }
    setAdminPassword(newPassword);
    localStorage.setItem('flowtrack_admin_pwd', newPassword);
    setForgotError('');
    setForgotSuccess('Admin password updated successfully!');
    setForgotStep('success');
  };

  const handleSkipReset = () => {
    setForgotError('');
    setForgotSuccess('Password reset skipped.');
    setForgotStep('success');
  };

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

  const handleToggleSuspend = async (id: string, currentSuspended: boolean) => {
    const actionText = currentSuspended ? 'unsuspend and reactivate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionText} this user account?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isSuspended: !currentSuspended }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMessage(`User account successfully ${!currentSuspended ? 'SUSPENDED' : 'REACTIVATED'}!`);
        setUsers(users.map(u => u._id === id ? { ...u, isSuspended: !currentSuspended } : u));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(json.message || `Failed to ${actionText} user.`);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#3C83F6] selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle glow background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Admin Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Admin Master Gate</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Enter authorized administrator credentials to access database logs and controls.
            </p>
          </div>

          {/* Login Error Alert */}
          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-300 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="meeabgull05@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(true);
                    setForgotEmail(loginEmail || 'meeabgull05@gmail.com');
                    setForgotError('');
                    setForgotSuccess('');
                    setForgotStep('email');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs text-slate-400 hover:text-slate-200 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main App</span>
            </button>
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Admin Password Recovery</h3>
                </div>
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="text-slate-500 hover:text-slate-300 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {forgotError && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* STEP 1: Email Input */}
              {forgotStep === 'email' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Authorized admin email (<code className="text-blue-400 font-mono">{maskEmail('meeabgull05@gmail.com')}</code>) to receive security verification code.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Admin Email
                    </label>
                    <input
                      type="text"
                      value={maskEmail('meeabgull05@gmail.com')}
                      readOnly
                      disabled
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm font-mono text-slate-300 cursor-not-allowed opacity-80 select-none"
                    />
                  </div>

                  <button
                    onClick={handleSendRecoveryCode}
                    disabled={isOtpLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isOtpLoading ? 'Sending Security Code...' : 'Send Security Code to Mail'}</span>
                  </button>
                </div>
              )}

              {/* STEP 2: OTP Entry */}
              {forgotStep === 'otp' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed bg-blue-950/30 border border-blue-500/20 p-3 rounded-xl">
                    A 6-digit security verification code has been generated and sent to your email (<strong className="text-blue-400 font-mono">{maskEmail('meeabgull05@gmail.com')}</strong>). Please check your mail inbox or spam folder and enter the 6-digit code below.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Enter 6-Digit Email OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-center font-mono font-bold text-white tracking-widest focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isOtpLoading}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <span>{isOtpLoading ? 'Verifying...' : 'Verify Code'}</span>
                    </button>
                    <button
                      onClick={handleSendRecoveryCode}
                      disabled={isOtpLoading}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                      title="Resend OTP code to mail"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Reset Password */}
              {forgotStep === 'reset' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    OTP code verified! You can now set a new password for <strong className="text-slate-200">{maskEmail('meeabgull05@gmail.com')}</strong> or skip this step.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      New Admin Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleResetPassword}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Save New Password
                    </button>
                    <button
                      onClick={handleSkipReset}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Success */}
              {forgotStep === 'success' && (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Password Updated!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Your admin password has been updated. You can now log in using your new credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setLoginEmail('meeabgull05@gmail.com');
                      setLoginPass(adminPassword);
                      setIsForgotPasswordOpen(false);
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Auto-Fill & Return to Login
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    );
  }

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
            onClick={handleAdminLogout}
            className="py-2 px-3 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Lock / Logout Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Lock Panel</span>
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
                    <th className="py-4 px-5">Role & Account Status</th>
                    <th className="py-4 px-5">Organization details</th>
                    <th className="py-4 px-5">Last Activity</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => {
                    const id = user._id;
                    const isPassVisible = !!showPass[id];
                    const isSuspended = !!user.isSuspended;

                    return (
                      <tr key={id} className={`hover:bg-slate-900/40 transition-colors ${isSuspended ? 'bg-red-950/20' : ''}`}>
                        
                        {/* User profile */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border ${
                              isSuspended 
                                ? 'bg-red-950/80 text-red-400 border-red-800/80' 
                                : 'bg-slate-800 text-blue-400 border-slate-700/60'
                            }`}>
                              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="text-xs font-black text-white flex items-center gap-1.5">
                                <span>{user.fullName || 'No Name Provided'}</span>
                                {isSuspended && (
                                  <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono uppercase font-bold">SUSPENDED</span>
                                )}
                              </div>
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
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide border uppercase ${
                              user.accountType === 'OrgAdmin' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : user.accountType === 'TeamMember'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>
                              {user.accountType === 'OrgAdmin' ? 'Org Admin' : user.accountType === 'TeamMember' ? 'Team Member' : 'Individual'}
                            </span>

                            {isSuspended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                                <Ban className="w-3 h-3 text-red-400" />
                                <span>Suspended</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Active</span>
                              </span>
                            )}
                          </div>
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

                        {/* Actions buttons */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleSuspend(id, isSuspended)}
                              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                                isSuspended
                                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                                  : 'bg-red-950/40 hover:bg-red-900/40 text-red-300 border-red-500/30'
                              }`}
                              title={isSuspended ? 'Reactivate User Account' : 'Suspend User Account'}
                            >
                              {isSuspended ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Unsuspend</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5 text-red-400" />
                                  <span>Suspend</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteLog(id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 bg-transparent hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                              title="Remove log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
