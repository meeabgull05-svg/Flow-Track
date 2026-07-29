import React, { useState, useEffect } from 'react';
import heroDashboardImg from '../assets/images/dashboard_hero_preview_1785342817084.jpg';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Lock, 
  Mail, 
  User, 
  School, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Eye, 
  EyeOff,
  Briefcase,
  Key,
  BarChart3,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Flag,
  X,
  Star,
  Globe,
  Award,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  FileText,
  Layers,
  Check,
  ExternalLink
} from 'lucide-react';
import { UserProfile, AccountType, OrgType } from '../types';

interface AuthScreenProps {
  onSignIn: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [accountType, setAccountType] = useState<AccountType>('OrgAdmin');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Organization Info
  const [orgName, setOrgName] = useState('Apex Tech & Education Academy');
  const [orgType, setOrgType] = useState<OrgType>('School/University');
  const [orgCode, setOrgCode] = useState('APEX-8921');

  // Interactive Homepage Preview Tab State
  const [previewTab, setPreviewTab] = useState<'admin' | 'member' | 'analytics'>('admin');

  // Interactive Live Stopwatch Demo State on Landing Page
  const [demoTime, setDemoTime] = useState(1482); // 00:24:42
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoTask, setDemoTask] = useState('Designing Student Portal & Faculty Tasks');
  const [demoLaps, setDemoLaps] = useState<string[]>(['00:10:00 - Phase 1 Complete', '00:14:42 - UI Review']);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let interval: any = null;
    if (isDemoRunning) {
      interval = setInterval(() => {
        setDemoTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isDemoRunning]);

  const formatDemoTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDemoLap = () => {
    if (isDemoRunning) {
      setDemoLaps([`${formatDemoTime(demoTime)} - Lap Logged`, ...demoLaps]);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAccountType('OrgAdmin');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (authMode === 'signup') {
      onSignIn({
        id: `usr_${Date.now()}`,
        name: fullName || 'Meeab Gull',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'Organization Owner & Admin',
        isSignedIn: true,
        accountType: 'OrgAdmin',
        orgId: `org_${Date.now()}`,
        orgName: orgName || 'My Organization Workspace',
        orgType: orgType || 'School/University',
        orgRole: 'Admin'
      });
    } else {
      onSignIn({
        id: `usr_${Date.now()}`,
        name: fullName || email.split('@')[0] || 'Organization Admin',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'Organization Admin',
        isSignedIn: true,
        accountType: 'OrgAdmin',
        orgId: 'org_apex_01',
        orgName: orgName || 'Apex Tech & Education Academy',
        orgType: 'School/University',
        orgRole: 'Admin'
      });
    }
  };

  const handleDemoLogin = (type: 'admin' | 'member' | 'guest') => {
    if (type === 'admin') {
      onSignIn({
        id: 'usr_admin_001',
        name: 'Meeab Gull (Admin)',
        email: 'admin@apexacademy.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'School & Organization Admin',
        isSignedIn: true,
        accountType: 'OrgAdmin',
        orgId: 'org_apex_01',
        orgName: 'Apex Tech & Education Academy',
        orgType: 'School/University',
        orgRole: 'Admin'
      });
    } else if (type === 'member') {
      onSignIn({
        id: 'usr_member_002',
        name: 'Sarah Khan',
        email: 'sarah.k@apexacademy.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Senior UI/UX Designer',
        isSignedIn: true,
        accountType: 'TeamMember',
        orgId: 'org_apex_01',
        orgName: 'Apex Tech & Education Academy',
        orgType: 'School/University',
        orgRole: 'Member'
      });
    } else {
      onSignIn({
        id: 'usr_guest_003',
        name: 'Guest Individual User',
        email: 'guest@flowtrack.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Individual Workspace',
        isSignedIn: true,
        accountType: 'Individual',
      });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqItems = [
    {
      q: 'How do I create a new Organization Workspace?',
      a: 'Click on "Create Organization" in the header or hero section. Select "Org Admin", enter your school or company name, and your admin workspace will be provisioned instantly.'
    },
    {
      q: 'Can teachers or principals assign tasks to students and staff?',
      a: 'Yes! Organization Admins can create tasks, set priority levels (High, Medium, Low), set due dates, and assign them directly to specific team members or students.'
    },
    {
      q: 'Does the live stopwatch keep running if I switch browser tabs?',
      a: 'Yes, the stopwatch runs on high-precision background timing. Your logged seconds will automatically update when you switch back.'
    },
    {
      q: 'How do team members or students join an existing workspace?',
      a: 'Admins share a unique 8-character Organization Code (e.g. APEX-8921). Members enter this code during sign-up to join the workspace.'
    },
    {
      q: 'Can I export task logs and stopwatch hours for payroll or reports?',
      a: 'Absolutely! The Analytics dashboard includes one-click export options for CSV, PDF, and detailed timeline summaries.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between selection:bg-[#3C83F6] selection:text-white font-sans scroll-smooth">
      
      {/* Top Website Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-[#3C83F6] flex items-center justify-center text-white shadow-md shadow-[#3C83F6]/25 font-black text-lg shrink-0">
              F
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span>FlowTrack</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-[#3C83F6] border border-blue-200/80">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                Work & Time Engine
              </div>
            </div>
          </div>

          {/* Fully Functional Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-extrabold text-slate-600 whitespace-nowrap">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#3C83F6] transition-colors cursor-pointer py-1 whitespace-nowrap">
              Features
            </button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-[#3C83F6] transition-colors cursor-pointer py-1 whitespace-nowrap">
              For Schools & Teams
            </button>
            <button onClick={() => scrollToSection('stopwatch')} className="hover:text-[#3C83F6] transition-colors cursor-pointer flex items-center gap-1.5 text-[#3C83F6] bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100 hover:bg-blue-100/80 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Stopwatch Demo</span>
            </button>
            <button onClick={() => scrollToSection('analytics')} className="hover:text-[#3C83F6] transition-colors cursor-pointer py-1 whitespace-nowrap">
              Analytics & Reports
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#3C83F6] transition-colors cursor-pointer py-1 whitespace-nowrap">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#3C83F6] transition-colors cursor-pointer py-1 whitespace-nowrap">
              FAQ
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
          <button
            onClick={() => openAuthModal('login')}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#3C83F6] hover:bg-[#2563eb] text-white transition-all cursor-pointer shadow-md shadow-[#3C83F6]/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Register Organization</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-6 pb-8 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto w-full bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl my-2 border border-blue-100/60 shadow-xs">
        
        {/* Left Aligned Content Grid */}
        {/* Equal 6-6 Grid for Left & Right Divs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center text-left">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#3C83F6] text-xs font-extrabold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Organization & School Work Management Engine</span>
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Manage School, Team & Work Stopwatches <span className="text-[#3C83F6] underline decoration-blue-200 underline-offset-4">In One Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl">
              Assign tasks to teachers, students, or engineers, track active time logs with real-time stopwatches, and monitor team productivity with automated analytics.
            </p>

            {/* CTAs inside Hero */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => openAuthModal('signup')}
                className="px-5 py-2.5 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-[#3C83F6]/20 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Register Organization</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-slate-200/80 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#3C83F6]" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Stat Cards - Clean left-aligned highlights */}
            <div className="pt-1 grid grid-cols-3 gap-2.5 max-w-lg">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-base font-black text-[#3C83F6]">1,200+</div>
                <div className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">Active Workspaces</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-base font-black text-emerald-600">99.9%</div>
                <div className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">Stopwatch Sync</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-base font-black text-slate-900">100% Free</div>
                <div className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">Instant Access</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium pt-0.5">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3C83F6] shrink-0" /> Encrypted Security
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Real-time Cloud Sync
              </span>
            </div>
          </div>

          {/* Right Div: Balanced Equal 6-Column Dashboard Showcase Frame with Image */}
          <div className="lg:col-span-6 relative group">
            
            {/* Soft Ambient Glow Behind Image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl transition-all group-hover:blur-2xl" />

            <div className="relative bg-white rounded-3xl p-3 sm:p-4 border border-blue-100 shadow-xl shadow-blue-500/10 space-y-3 overflow-hidden">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 font-mono ml-2">flowtrack.app/dashboard</span>
                </div>
                
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600 animate-spin" /> Live Syncing
                </span>
              </div>

              {/* Main Image Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group/img">
                <img
                  src={heroDashboardImg}
                  alt="FlowTrack Live Workspace Dashboard Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover rounded-2xl transform transition-transform duration-500 group-hover/img:scale-[1.02]"
                />

                {/* Overlay Floating Live Status Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-xl border border-white/20 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-xs font-black">14 Active Team Stopwatches</div>
                      <div className="text-[10px] text-slate-300 font-medium">Real-time Faculty & Student Sync</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                    01:42:18
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher Buttons below image */}
              <div className="pt-1 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Instant Workspace Role Previews:</span>
                  </span>
                  <span className="text-[10px] text-[#3C83F6] font-semibold">Click to test workspace</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDemoLogin('admin')}
                    className="py-2 px-2.5 bg-slate-50 hover:bg-blue-50 hover:text-[#3C83F6] hover:border-blue-200 text-slate-800 font-extrabold text-[11px] rounded-xl border border-slate-200/80 transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>⚡ Admin</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('member')}
                    className="py-2 px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-800 font-extrabold text-[11px] rounded-xl border border-slate-200/80 transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>💻 Member</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('guest')}
                    className="py-2 px-2.5 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 text-slate-800 font-extrabold text-[11px] rounded-xl border border-slate-200/80 transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>🎓 Guest</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Interactive Live Preview Showcase */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 text-left">
            
            {/* Tab Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#3C83F6] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Apex Tech & Education Academy</h3>
                  <p className="text-xs text-slate-500 font-medium">Active Organization Workspace • Code: APEX-8921</p>
                </div>
              </div>

              {/* Preview Tab Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-extrabold">
                <button
                  onClick={() => setPreviewTab('admin')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    previewTab === 'admin' ? 'bg-white text-[#3C83F6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin View
                </button>
                <button
                  onClick={() => setPreviewTab('member')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    previewTab === 'member' ? 'bg-white text-[#3C83F6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Member View
                </button>
                <button
                  onClick={() => setPreviewTab('analytics')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    previewTab === 'analytics' ? 'bg-white text-[#3C83F6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Analytics Tab
                </button>
              </div>
            </div>

            {/* Dynamic Content Preview Based on Tab */}
            {previewTab === 'admin' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Live Team Stopwatches & Active Assignments</span>
                  <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>3 Stopwatches Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Meeab Gull (Principal)</span>
                      <span className="text-emerald-600 font-extrabold">Online</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 truncate">Reviewing Curriculum & Team Reports</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-extrabold text-[#3C83F6]">04:07:00</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700">Tracking</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Sarah Khan (UI Designer)</span>
                      <span className="text-emerald-600 font-extrabold">Online</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 truncate">Designing Student Portal Dashboard</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-extrabold text-[#3C83F6]">05:06:00</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700">Tracking</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Professor Usman (Faculty)</span>
                      <span className="text-amber-600 font-extrabold">On Break</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 truncate">Grading Midterm CS Papers</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-extrabold text-[#3C83F6]">03:06:00</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700">Paused</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'member' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs font-black text-slate-800">Assigned Tasks for Team Member (Sarah Khan)</div>
                <div className="space-y-2">
                  <div className="p-3.5 bg-blue-50/50 border border-blue-200/60 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Finalize Responsive Layout for School Website</div>
                      <div className="text-[11px] text-slate-500">Assigned by Meeab Gull • Priority: High</div>
                    </div>
                    <button onClick={() => handleDemoLogin('member')} className="px-3 py-1.5 bg-[#3C83F6] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#2563eb]">
                      Start Stopwatch
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Prepare Weekly Design Presentation</div>
                      <div className="text-[11px] text-slate-500">Assigned by Admin • Priority: Medium</div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Pending</span>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'analytics' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs font-black text-slate-800">Organization Performance Overview</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <div className="text-lg font-black text-[#3C83F6]">128.5 hrs</div>
                    <div className="text-[10px] font-bold text-slate-500">Total Hours Logged</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <div className="text-lg font-black text-emerald-600">96%</div>
                    <div className="text-[10px] font-bold text-slate-500">Task Completion Rate</div>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-center">
                    <div className="text-lg font-black text-sky-600">8 Members</div>
                    <div className="text-[10px] font-bold text-slate-500">Active Workspace</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <div className="text-lg font-black text-amber-600">14 Tasks</div>
                    <div className="text-[10px] font-bold text-slate-500">Completed This Week</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* Interactive Live Stopwatch & Workflow Section (White Light Theme) */}
      <section id="stopwatch" className="py-20 px-6 lg:px-12 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#3C83F6] border border-blue-200/80 text-xs font-extrabold shadow-xs">
              LIVE INTERACTIVE DEMO & WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Test Our Precision Stopwatch Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Experience zero-latency task timing. Start, pause, or record laps right here in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Side: 3-Step Simple Workflow Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wide">How It Works in 3 Steps</div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3C83F6] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  1
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-900">Create Your Organization</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Set up your school, company, or team hub in 10 seconds. Invite members via code or email.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3C83F6] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  2
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-900">Assign Tasks & Start Stopwatch</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Assign work to teachers, engineers, or students with priority badges and real-time timers.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3C83F6] font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  3
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-slate-900">Review 365-Day Productivity Logs</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Track total hours, view contribution heatmaps, and export CSV reports for payroll or grading.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Ready to start?</span>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Register Workspace →
                </button>
              </div>
            </div>

            {/* Right Side: Clean White Interactive Stopwatch Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-slate-800">Live Browser Stopwatch</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                  Interactive Widget
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Active Task Title:</label>
                <input
                  type="text"
                  value={demoTask}
                  onChange={(e) => setDemoTask(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#3C83F6] focus:outline-none transition-all"
                />
              </div>

              {/* Main Timer Display in Light Mode */}
              <div className="py-6 bg-gradient-to-b from-blue-50/80 to-blue-50/30 rounded-2xl border border-blue-100/90 text-center space-y-1">
                <div className="text-4xl sm:text-6xl font-mono font-black tracking-widest text-[#3C83F6]">
                  {formatDemoTime(demoTime)}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {isDemoRunning ? 'Stopwatch Active • Recording Time' : 'Stopwatch Paused'}
                </div>
              </div>

              {/* Stopwatch Control Buttons */}
              <div className="flex items-center justify-center gap-2.5">
                <button
                  onClick={() => setIsDemoRunning(!isDemoRunning)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDemoRunning 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                      : 'bg-[#3C83F6] hover:bg-[#2563eb] text-white shadow-[#3C83F6]/20'
                  }`}
                >
                  {isDemoRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isDemoRunning ? 'Pause Timer' : 'Start Timer'}</span>
                </button>

                <button
                  onClick={handleDemoLap}
                  disabled={!isDemoRunning}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200"
                >
                  <Flag className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lap</span>
                </button>

                <button
                  onClick={() => {
                    setIsDemoRunning(false);
                    setDemoTime(0);
                    setDemoLaps([]);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Lap Records */}
              {demoLaps.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono text-slate-800 max-h-28 overflow-y-auto">
                  <div className="text-[10px] font-sans font-bold text-slate-500 uppercase">Logged Laps:</div>
                  {demoLaps.map((lap, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-200/80 pb-1 last:border-0">
                      <span>{lap}</span>
                      <span className="text-[#3C83F6] font-bold">Lap {demoLaps.length - i}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-1 text-center">
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="text-xs text-[#3C83F6] hover:underline font-extrabold cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Launch full admin dashboard with pre-filled mock data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Core Features Grid Section */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/60">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for Modern Schools, Tech Teams & Workspaces
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Everything required to manage staff, assign student or developer tasks, and verify time logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3C83F6] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Organization & Team Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Create custom organizations for schools, universities, software companies, or design studios. Manage admins, teachers, and team members effortlessly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Live Stopwatch Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Start, pause, resume, and log time for active tasks. Every second is synchronized to your personal and organization timeline.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Task Assignment & Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Admins can assign specific tasks with priority levels (High, Medium, Low) to teachers, students, or engineers and track progress in real-time.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">1-Click Org Codes</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Invite team members or students seamlessly using unique Organization Invitation Codes (e.g., APEX-8921).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Role-Based Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Differentiate between Admin controls, Member task lists, and Individual personal stopwatches with strict security.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Exportable Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Download verified time tracking records, task logs, and user productivity summaries in one click for payroll or academic grading.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Solutions for Schools & Teams Section */}
      <section id="solutions" className="py-20 px-6 lg:px-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/60">
              TAILORED SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Designed for Your Specific Organization Type
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between hover:border-[#3C83F6]/40 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3C83F6] flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Schools & Universities</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Ideal for Principals, Faculty Heads, and Professors managing student project submissions and staff grading hours.
                </p>
                <ul className="space-y-2 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assign tasks to faculty & students</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Monitor midterm paper grading time</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Organization code entry for students</li>
                </ul>
              </div>

              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-[#3C83F6] font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-blue-200/70"
              >
                Register School Workspace →
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-[#3C83F6] shadow-lg shadow-[#3C83F6]/10 space-y-6 flex flex-col justify-between relative">
              <span className="absolute -top-3.5 right-6 bg-[#3C83F6] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs">
                MOST POPULAR
              </span>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3C83F6] flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Software Companies & Agencies</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Track sprint velocity, UI/UX design sessions, and client project billables with high accuracy.
                </p>
                <ul className="space-y-2 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Developer & Designer stopwatch logs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time active session dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority task queue & sprint reports</li>
                </ul>
              </div>

              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-[#3C83F6]/20"
              >
                Register Company Workspace →
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Individual & Freelancers</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Simple personal stopwatch and task logger without organization overhead.
                </p>
                <ul className="space-y-2 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Personal stopwatch timer</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom task categorization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct CSV log export</li>
                </ul>
              </div>

              <button
                onClick={() => handleDemoLogin('guest')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                Launch Guest Workspace →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Analytics & Performance Preview Section */}
      <section id="analytics" className="py-20 px-6 lg:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/60">
                REAL-TIME INSIGHTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                Clear Analytics for Team Productivity & Task Auditing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                No more guessing who worked on what. FlowTrack automatically aggregates active stopwatch sessions into visual charts, member logs, and exported spreadsheets.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                  <TrendingUp className="w-5 h-5 text-[#3C83F6] mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Total Hours Logged vs Capacity</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Track weekly team hours and compare against assigned task benchmarks.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                  <Award className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Active Daily Streaks</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Encourage daily work discipline with automated activity badges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Visual Card (Clean White Light Theme) */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
                <div className="text-sm font-black text-slate-900 tracking-tight">Apex Tech Academy - Weekly Report</div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded-full border border-emerald-200/80">
                  +18.4% Efficiency
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Curriculum & Staff Management</span>
                    <span className="font-mono text-[#3C83F6]">42 hrs (88%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-[#3C83F6]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Student UI & Portal Sprints</span>
                    <span className="font-mono text-emerald-600">38 hrs (75%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Faculty Grading & Exams</span>
                    <span className="font-mono text-amber-600">26 hrs (60%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-amber-500"></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono flex-wrap gap-2">
                <span className="font-bold">Verified Logged Time: 106.0 hrs</span>
                <button onClick={() => handleDemoLogin('admin')} className="text-[#3C83F6] hover:underline font-extrabold cursor-pointer">
                  View Full Analytics →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/60">
              SIMPLE TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Flexible Plans for Every Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Start free with full stopwatch and task assignment capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Free Starter</div>
                <div className="text-3xl font-black text-slate-900">$0 <span className="text-xs text-slate-500 font-normal">/ forever</span></div>
                <p className="text-xs text-slate-500 font-medium">Perfect for small teams or individual stopwatch tracking.</p>
                
                <ul className="space-y-2.5 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 5 Organization Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Live Stopwatch Logs</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic Task Assignments</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> CSV Log Export</li>
                </ul>
              </div>

              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Org Tier */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#3C83F6] shadow-xl space-y-6 flex flex-col justify-between relative">
              <span className="absolute -top-3.5 right-6 bg-[#3C83F6] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs">
                RECOMMENDED
              </span>

              <div className="space-y-4">
                <div className="text-xs font-extrabold text-[#3C83F6] uppercase tracking-wider">PRO Organization</div>
                <div className="text-3xl font-black text-slate-900">$19 <span className="text-xs text-slate-500 font-normal">/ month per workspace</span></div>
                <p className="text-xs text-slate-500 font-medium">Full management control for schools, departments, and companies.</p>
                
                <ul className="space-y-2.5 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#3C83F6]" /> Unlimited Team & Student Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#3C83F6]" /> Organization Invitation Codes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#3C83F6]" /> Advanced Priority Task Engine</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#3C83F6]" /> Weekly Analytics & PDF Reports</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#3C83F6]" /> Priority 24/7 Support</li>
                </ul>
              </div>

              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-[#3C83F6]/25"
              >
                Create Pro Organization →
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Enterprise</div>
                <div className="text-3xl font-black text-slate-900">Custom</div>
                <p className="text-xs text-slate-500 font-medium">For large universities, school districts, and enterprises.</p>
                
                <ul className="space-y-2.5 text-xs font-bold text-slate-700 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Cloud Infrastructure</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom SSO & SAML Integration</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Multi-School Admin Hierarchy</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom SLA & Onboarding</li>
                </ul>
              </div>

              <button
                onClick={() => openAuthModal('signup')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Contact Enterprise Team
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="py-20 px-6 lg:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/60">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left font-black text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#3C83F6]" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>

                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-6 lg:px-12 bg-[#3C83F6] text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Start Managing Work & Stopwatches for Your Organization?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-medium">
            Join schools, universities, and companies using FlowTrack for real-time time tracking and task administration.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="px-8 py-4 bg-white text-[#3C83F6] font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Launch Admin Dashboard Immediately</span>
            </button>

            <button
              onClick={() => openAuthModal('signup')}
              className="px-8 py-4 bg-slate-900 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:bg-slate-800 transition-all cursor-pointer border border-slate-700"
            >
              Register New Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-6 lg:px-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3C83F6] flex items-center justify-center text-white font-black">
                F
              </div>
              <span className="font-black text-slate-900 text-sm">FlowTrack PRO ORG</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              High-precision stopwatch and task management platform for schools, universities, tech teams, and agencies.
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-[11px] font-bold text-slate-500">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-[#3C83F6] cursor-pointer">Features Overview</button></li>
              <li><button onClick={() => scrollToSection('stopwatch')} className="hover:text-[#3C83F6] cursor-pointer">Live Stopwatch Demo</button></li>
              <li><button onClick={() => scrollToSection('analytics')} className="hover:text-[#3C83F6] cursor-pointer">Analytics Engine</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#3C83F6] cursor-pointer">Plans & Pricing</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-3">Solutions</h4>
            <ul className="space-y-2 text-[11px] font-bold text-slate-500">
              <li><button onClick={() => scrollToSection('solutions')} className="hover:text-[#3C83F6] cursor-pointer">Schools & Universities</button></li>
              <li><button onClick={() => scrollToSection('solutions')} className="hover:text-[#3C83F6] cursor-pointer">Software Companies</button></li>
              <li><button onClick={() => scrollToSection('solutions')} className="hover:text-[#3C83F6] cursor-pointer">Design Agencies</button></li>
              <li><button onClick={() => scrollToSection('solutions')} className="hover:text-[#3C83F6] cursor-pointer">Individual Users</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-3">Demo Credentials</h4>
            <div className="space-y-2 text-[11px] text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div><strong className="text-slate-800">Admin:</strong> admin@apexacademy.edu</div>
              <div><strong className="text-slate-800">Org Code:</strong> APEX-8921</div>
              <div><strong className="text-slate-800">Role:</strong> School Principal & Admin</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-medium">
          <div>© {new Date().getFullYear()} FlowTrack Platform. All rights reserved.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>

      {/* Dedicated Full-Screen Auth Page (Replaces Modal Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto min-h-screen flex flex-col justify-between animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">

            {/* LEFT: Brand / Flow Panel */}
            <div className="bg-[#15181D] text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 min-h-[420px] lg:min-h-screen">
              
              {/* Radial Ambient Background Glows */}
              <div className="absolute -left-28 -bottom-28 w-96 h-96 rounded-full bg-blue-600/35 blur-3xl pointer-events-none" />
              <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

              {/* Top Header inside Brand Panel */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-blue-400/40 flex items-center justify-center bg-blue-500/10">
                    <Clock className="w-4 h-4 text-[#8FA0FF]" />
                  </div>
                  <span className="font-serif font-semibold text-xl tracking-tight text-white">Flow Track</span>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to site</span>
                </button>
              </div>

              {/* Mid Hero Section inside Brand Panel */}
              <div className="relative z-10 my-10 max-w-lg space-y-4">
                <span className="font-mono text-xs text-[#A9B3FF] uppercase tracking-widest font-semibold block">
                  Time, in flow
                </span>
                
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white tracking-tight">
                  Every hour, tracked <em className="italic text-[#8FA0FF] font-normal">without</em> the friction.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-1 max-w-md">
                  {authMode === 'login'
                    ? 'Sign in to pick up your running timers, or start a free account and have your first flow going in under a minute.'
                    : 'Start a free account and have your first flow going in under a minute.'}
                </p>

                {/* Flow Visual SVG */}
                <div className="relative h-28 pt-4 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 380 120" preserveAspectRatio="none">
                    <path
                      d="M0,70 C 60,20 90,110 150,60 C 210,15 240,105 300,55 C 330,32 355,50 380,40"
                      fill="none"
                      stroke="#3A4470"
                      strokeWidth="1.5"
                      strokeDasharray="5 6"
                    />
                    <path
                      d="M0,70 C 60,20 90,110 150,60"
                      fill="none"
                      stroke="#2E4CFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="0" cy="70" r="5" fill="#2E4CFF" />
                    <circle cx="150" cy="60" r="6" fill="#2E4CFF" />
                    <circle cx="240" cy="88" r="5" fill="#232733" stroke="#3A4050" strokeWidth="1" />
                    <circle cx="380" cy="40" r="5" fill="#232733" stroke="#3A4050" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Bottom Stats in Brand Panel */}
              <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-8 text-left">
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-white">2.3M+</div>
                  <div className="text-xs text-slate-400 font-medium">hours tracked / mo</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-white">18,400</div>
                  <div className="text-xs text-slate-400 font-medium">teams in flow</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-medium text-white">4.9/5</div>
                  <div className="text-xs text-slate-400 font-medium">average rating</div>
                </div>
              </div>

            </div>


            {/* RIGHT: Form Panel */}
            <div className="bg-white flex items-center justify-center p-6 sm:p-10 lg:p-14">
              <div className="w-full max-w-md space-y-6">

                {/* Tabs Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {/* Form Header */}
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                    {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {authMode === 'login'
                      ? 'Log in to pick up right where your timer left off.'
                      : 'Start free — your first flow takes under a minute to set up.'}
                  </p>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-900">Full name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Sara Ahmed"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/15 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-900">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/15 transition-all"
                      />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-900">Organization / Team Name</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="Apex Tech & Education"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/15 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-900">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'login' && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-[#2E4CFF] focus:ring-[#2E4CFF]" defaultChecked />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('admin')}
                        className="text-[#2E4CFF] font-semibold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#2E4CFF] hover:bg-[#1B2FBF] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#2E4CFF]/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{authMode === 'login' ? 'Log in to Flow Track' : 'Create free account'}</span>
                  </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-[1px] bg-slate-200 flex-1" />
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    OR CONTINUE WITH
                  </span>
                  <div className="h-[1px] bg-slate-200 flex-1" />
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16">
                      <path fill="#4285F4" d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.68 3.68 0 01-1.6 2.42v2h2.58c1.5-1.39 2.4-3.44 2.4-5.88z"/>
                      <path fill="#34A853" d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.58-2c-.72.48-1.63.76-2.71.76-2.08 0-3.85-1.4-4.48-3.29H.86v2.07A8 8 0 008 16z"/>
                      <path fill="#FBBC05" d="M3.52 9.53a4.8 4.8 0 010-3.06V4.4H.86a8 8 0 000 7.2l2.66-2.07z"/>
                      <path fill="#EA4335" d="M8 3.18c1.17 0 2.23.4 3.06 1.2l2.29-2.29C11.96.9 10.16.13 8 .13a8 8 0 00-7.14 4.27l2.66 2.07C4.15 4.58 5.92 3.18 8 3.18z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16">
                      <path fill="#15181D" d="M13.5 5.7c-.9.05-1.55.5-2.05.5-.53 0-1.1-.45-1.87-.44-.96.01-1.85.55-2.34 1.4-1 1.73-.26 4.29.72 5.7.48.68 1.05 1.45 1.8 1.42.72-.03 1-.46 1.87-.46.87 0 1.12.46 1.88.45.78-.01 1.27-.7 1.75-1.38.55-.79.78-1.55.79-1.6-.02-.01-1.5-.58-1.52-2.3-.01-1.44 1.18-2.13 1.23-2.16-.68-1-1.73-1.11-2.1-1.13h.04zM10.9 4.4c.4-.48.68-1.16.6-1.83-.58.02-1.28.39-1.7.87-.37.42-.7 1.11-.61 1.76.64.05 1.3-.33 1.71-.8z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Switch line */}
                <p className="text-center text-xs text-slate-600 pt-2">
                  {authMode === 'login' ? (
                    <>
                      New to Flow Track?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="font-bold text-[#2E4CFF] hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="font-bold text-[#2E4CFF] hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>

                {/* Terms notice */}
                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  By continuing, you agree to Flow Track's{' '}
                  <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and{' '}
                  <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
                </p>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

