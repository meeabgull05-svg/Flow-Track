import React, { useState, useEffect } from 'react';
import heroDashboardImg from '../assets/images/dashboard_hero_preview_1785342817084.jpg';
import { HeroMotionShowcase } from './HeroMotionShowcase';
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
  ExternalLink,
  Rocket,
  Code2,
  Headphones,
  MessageSquare
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
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-10 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-xl bg-[#3C83F6] flex items-center justify-center text-white shadow-md shadow-[#3C83F6]/25 font-black text-base shrink-0">
              F
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span>FlowTrack</span>
                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-blue-50 text-[#3C83F6] border border-blue-200/80">
                  PRO
                </span>
              </div>
              <div className="text-[9.5px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
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
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#3C83F6] hover:bg-[#2563eb] text-white transition-all cursor-pointer shadow-md shadow-[#3C83F6]/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Register Organization</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-4 pb-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-blue-50/50 via-white to-white rounded-2xl sm:rounded-3xl my-1 border border-blue-100/60 shadow-xs">
        
        {/* Left Aligned Content Grid */}
        {/* Equal 6-6 Grid for Left & Right Divs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch text-left">
          
          {/* Left Div: Content & Stats Card */}
          <div className="lg:col-span-6 flex flex-col space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs h-full justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#3C83F6] text-[11px] font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Organization & School Work Management Engine</span>
              </span>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                Manage School, Team & Work Stopwatches <span className="text-[#3C83F6] underline decoration-blue-200 underline-offset-4">In One Hub</span>
              </h1>

              <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-xl">
                Assign tasks to teachers, students, or engineers, track active time logs with real-time stopwatches, and monitor team productivity with automated analytics.
              </p>

              {/* CTAs inside Hero */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2.5 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-[#3C83F6]/25 hover:shadow-lg hover:shadow-[#3C83F6]/35 flex items-center gap-2 group/btn"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Register Organization</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all duration-200 cursor-pointer border border-slate-200/90 flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#3C83F6]" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>

            {/* Clean White Stats & Trust Metrics Card */}
            <div className="pt-3.5 mt-2 border-t border-slate-100 space-y-2">
              
              {/* Stat Cards - 3 Columns */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs hover:bg-blue-50/40 transition-colors text-left">
                  <div className="text-sm sm:text-base font-black text-[#3C83F6]">1,200+</div>
                  <div className="text-[9.5px] font-bold text-slate-500 leading-none mt-1">Active Workspaces</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs hover:bg-emerald-50/40 transition-colors text-left">
                  <div className="text-sm sm:text-base font-black text-emerald-600">99.9%</div>
                  <div className="text-[9.5px] font-bold text-slate-500 leading-none mt-1">Stopwatch Sync</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs hover:bg-purple-50/40 transition-colors text-left">
                  <div className="text-sm sm:text-base font-black text-slate-900">100% Free</div>
                  <div className="text-[9.5px] font-bold text-slate-500 leading-none mt-1">Instant Access</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Div: Interactive Motion Asset Showcase (Height matched to left div) */}
          <div className="lg:col-span-6 h-full">
            <HeroMotionShowcase />
          </div>

        </div>

        {/* Platform Feature Pillars Banner Box (Matching Reference Image) */}
        <div className="pt-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-3 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xl shadow-slate-200/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
              
              {/* Feature 1: Live Time Tracking */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-[#3C83F6] group cursor-pointer border border-transparent hover:border-[#3C83F6] hover:shadow-lg hover:shadow-[#3C83F6]/20">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DCE7FF] group-hover:bg-white/20 text-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                    Live Time Tracking
                  </h3>
                  <p className="text-[11.5px] text-slate-500 group-hover:text-blue-50 font-medium leading-snug transition-colors duration-300">
                    Precision stopwatches with real-time cloud sync for teams and students.
                  </p>
                </div>
              </div>

              {/* Feature 2: Smart Task Auditing */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-[#3C83F6] group cursor-pointer border border-transparent hover:border-[#3C83F6] hover:shadow-lg hover:shadow-[#3C83F6]/20">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DCE7FF] group-hover:bg-white/20 text-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                    Smart Task Auditing
                  </h3>
                  <p className="text-[11.5px] text-slate-500 group-hover:text-blue-50 font-medium leading-snug transition-colors duration-300">
                    Automated 365-day productivity heatmaps, member logs & CSV exports.
                  </p>
                </div>
              </div>

              {/* Feature 3: Secure & Reliable */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-[#3C83F6] group cursor-pointer border border-transparent hover:border-[#3C83F6] hover:shadow-lg hover:shadow-[#3C83F6]/20">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DCE7FF] group-hover:bg-white/20 text-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                    Secure & Reliable
                  </h3>
                  <p className="text-[11.5px] text-slate-500 group-hover:text-blue-50 font-medium leading-snug transition-colors duration-300">
                    Enterprise-grade security and performance at the core of FlowTrack.
                  </p>
                </div>
              </div>

              {/* Feature 4: 24/7 Support */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-[#3C83F6] group cursor-pointer border border-transparent hover:border-[#3C83F6] hover:shadow-lg hover:shadow-[#3C83F6]/20">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DCE7FF] group-hover:bg-white/20 text-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                  <Headphones className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                    24/7 Support
                  </h3>
                  <p className="text-[11.5px] text-slate-500 group-hover:text-blue-50 font-medium leading-snug transition-colors duration-300">
                    We're always here to support your workspace anytime, anywhere.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* How It Works in 3 Steps Section */}
      <section id="workflow" className="py-20 px-6 lg:px-12 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#3C83F6] border border-blue-200/80 text-xs font-extrabold shadow-xs">
              SIMPLE & EFFORTLESS WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How FlowTrack Works In 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Set up your workspace, assign stopwatches to your team, and track real-time productivity with zero learning curve.
            </p>
          </div>

          {/* 3 Step Equal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* Step 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-[#3C83F6]/20 hover:bg-[#3C83F6] hover:border-[#3C83F6] transition-all duration-300 space-y-4 flex flex-col justify-between relative group cursor-pointer">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 group-hover:bg-white/20 border border-blue-100 group-hover:border-white/30 text-[#3C83F6] group-hover:text-white font-mono font-black text-xs transition-colors duration-300">
                    STEP 01
                  </span>
                  <Building2 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-white leading-snug transition-colors duration-300">
                  Create Your Organization
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-blue-50 leading-relaxed font-medium transition-colors duration-300">
                  Set up your school, company, or team hub in under 10 seconds. Easily invite members via join code, email, or role links.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 group-hover:bg-white/15 border border-slate-100 group-hover:border-white/20 space-y-1 transition-colors duration-300">
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-white flex items-center gap-1.5 transition-colors duration-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                  Instant Workspace Setup
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-blue-100 transition-colors duration-300">Includes role-based access for Admins & Members</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-[#3C83F6]/20 hover:bg-[#3C83F6] hover:border-[#3C83F6] transition-all duration-300 space-y-4 flex flex-col justify-between relative group cursor-pointer">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 group-hover:bg-white/20 border border-blue-100 group-hover:border-white/30 text-[#3C83F6] group-hover:text-white font-mono font-black text-xs transition-colors duration-300">
                    STEP 02
                  </span>
                  <Clock className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-white leading-snug transition-colors duration-300">
                  Assign Tasks & Start Stopwatch
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-blue-50 leading-relaxed font-medium transition-colors duration-300">
                  Assign tasks to teachers, engineers, or students. Members log hours using precision live stopwatches with live status tags.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 group-hover:bg-white/15 border border-slate-100 group-hover:border-white/20 space-y-1 transition-colors duration-300">
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-white flex items-center gap-1.5 transition-colors duration-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                  Real-time Cloud Sync
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-blue-100 transition-colors duration-300">Live stopwatch status updates for all team admins</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-[#3C83F6]/20 hover:bg-[#3C83F6] hover:border-[#3C83F6] transition-all duration-300 space-y-4 flex flex-col justify-between relative group cursor-pointer">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 group-hover:bg-white/20 border border-blue-100 group-hover:border-white/30 text-[#3C83F6] group-hover:text-white font-mono font-black text-xs transition-colors duration-300">
                    STEP 03
                  </span>
                  <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-white leading-snug transition-colors duration-300">
                  Review 365-Day Productivity Logs
                </h3>
                <p className="text-xs text-slate-600 group-hover:text-blue-50 leading-relaxed font-medium transition-colors duration-300">
                  Track total hours, view activity contribution heatmaps, generate PDF reports, and export clean CSV data for payroll or grading.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 group-hover:bg-white/15 border border-slate-100 group-hover:border-white/20 space-y-1 transition-colors duration-300">
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-white flex items-center gap-1.5 transition-colors duration-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                  Automated Analytics
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-blue-100 transition-colors duration-300">Detailed graphs & exports ready for export</div>
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

      {/* Complete Productivity & Workflow Capabilities Section */}
      <section id="capabilities" className="py-12 px-6 lg:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline, Description & Features List */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 tracking-wider inline-block">
                  ALL-IN-ONE WORKSPACE
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  Everything You Need to Master Your Daily Workflow
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  FlowTrack combines precision time tracking, project scheduling, and automated team insights into a clean, distraction-free environment.
                </p>
              </div>

              {/* 4 Feature Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 hover:bg-blue-50/40 hover:border-blue-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#3C83F6] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Precision Stopwatch</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-normal">
                    Start, pause, and log active work sessions with live sync across your workspace.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 hover:bg-purple-50/40 hover:border-purple-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#635BFF] flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Smart Projects</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-normal">
                    Organize tasks by client, project category, and priority level effortlessly.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Audit-Ready Exports</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-normal">
                    Generate instant PDF and CSV summaries formatted for organization audits.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 hover:bg-amber-50/40 hover:border-amber-200 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Role Security</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-normal">
                    Granular permissions for Admins and Team Members to protect private log data.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Simple Clean Image */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg">
                <img 
                  src={heroDashboardImg} 
                  alt="FlowTrack Workspace Capabilities Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover rounded-2xl"
                />
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
      <section id="faq" className="py-20 px-6 lg:px-12 bg-slate-50/50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: FAQ Accordions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 text-xs font-black text-[#3C83F6] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/60 shadow-xs">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>GOT QUESTIONS?</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Everything you need to know about FlowTrack workspace setup, live stopwatches, member roles, and automated 365-day reports.
                </p>
              </div>

              {/* FAQ List with Dynamic #3C83F6 Hover Effect */}
              <div className="space-y-3.5 pt-2">
                {faqItems.map((item, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index}
                      className={`rounded-2xl border transition-all duration-300 group cursor-pointer overflow-hidden ${
                        isOpen 
                          ? 'bg-white border-[#3C83F6] shadow-md ring-1 ring-[#3C83F6]/30' 
                          : 'bg-white border-slate-200/90 shadow-xs hover:bg-[#3C83F6] hover:border-[#3C83F6] hover:shadow-xl hover:shadow-[#3C83F6]/20'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-4 sm:p-5 text-left font-black text-sm text-slate-900 flex items-center justify-between cursor-pointer transition-colors duration-300"
                      >
                        <span className="flex items-center gap-3 pr-3">
                          <HelpCircle 
                            className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                              isOpen 
                                ? 'text-[#3C83F6]' 
                                : 'text-[#3C83F6] group-hover:text-white'
                            }`} 
                          />
                          <span className={`transition-colors duration-300 ${
                            isOpen 
                              ? 'text-slate-900' 
                              : 'text-slate-900 group-hover:text-white'
                          }`}>
                            {item.q}
                          </span>
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                            isOpen 
                              ? 'rotate-180 text-[#3C83F6]' 
                              : 'text-slate-400 group-hover:text-white'
                          }`} 
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-200">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visual Time Tracking & Support Showcase Card (Clean White Theme) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-6 relative overflow-hidden group">
                
                {/* Decorative Soft Radial Background Accent */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500"></div>
                
                {/* Header Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#3C83F6] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                    <Headphones className="w-3.5 h-3.5 text-[#3C83F6]" />
                    <span>24/7 FlowTrack Assistance</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Help Online</span>
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="space-y-2 relative z-10 text-left">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    Have Questions About Live Stopwatches or Roles?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Our team setup specialists are available round-the-clock to guide your academy, business, or faculty workspace.
                  </p>
                </div>

                {/* Dashboard Time Tracking Image Preview Card */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md group/img cursor-pointer transition-transform duration-300 hover:scale-[1.01] bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" 
                    alt="FlowTrack Live Analytics & Support Dashboard" 
                    className="w-full h-48 object-cover object-center opacity-95 group-hover/img:opacity-100 transition-opacity duration-300"
                  />
                  
                  {/* Light Glass Overlay Badge */}
                  <div className="absolute inset-x-3 bottom-3 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-lg flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8.5 h-8.5 rounded-lg bg-[#3C83F6] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Clock className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-slate-900 leading-none">Live Workspace Support</div>
                        <div className="text-[9.5px] text-slate-500 font-medium">Real-Time Assistance</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-black text-[#3C83F6] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80">
                      24/7 Active
                    </span>
                  </div>
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-left relative z-10">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Instant Setup
                    </div>
                    <p className="text-[10px] text-slate-500">Join code & role links</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Role Security
                    </div>
                    <p className="text-[10px] text-slate-500">Admin & Member controls</p>
                  </div>
                </div>

                {/* CTA Action Button */}
                <div className="pt-2 relative z-10">
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="w-full py-3.5 px-5 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-[#3C83F6]/25 hover:shadow-xl hover:shadow-[#3C83F6]/35 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact Support Team</span>
                  </button>
                </div>

              </div>

            </div>

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

