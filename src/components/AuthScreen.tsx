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
  MessageSquare,
  Send
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
  const [isDemoRunning, setIsDemoRunning] = useState(true);
  const [demoTask, setDemoTask] = useState('Designing Student Portal & Faculty Tasks');
  const [demoLaps, setDemoLaps] = useState<string[]>(['00:10:00 - Phase 1 Complete', '00:14:42 - UI Review']);

  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active Navbar Section tracking for navigation highlighting
  const [activeNavSection, setActiveNavSection] = useState<string>('features');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = [
        { id: 'faq', key: 'faq' },
        { id: 'pricing', key: 'pricing' },
        { id: 'capabilities', key: 'features' },
        { id: 'solutions', key: 'solutions' },
        { id: 'features', key: 'features' },
        { id: 'workflow', key: 'features' },
        { id: 'stopwatch', key: 'stopwatch' },
        { id: 'home', key: 'features' },
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveNavSection(sec.key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setActiveNavSection(id);
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

          {/* Fully Functional Navigation Links with Clean Text Color Highlight */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-extrabold text-slate-600 whitespace-nowrap">
            <button 
              onClick={() => scrollToSection('features')} 
              className={`transition-colors cursor-pointer py-1 whitespace-nowrap ${
                activeNavSection === 'features'
                  ? 'text-[#3C83F6] font-black'
                  : 'text-slate-600 hover:text-[#3C83F6]'
              }`}
            >
              Features
            </button>

            <button 
              onClick={() => scrollToSection('solutions')} 
              className={`transition-colors cursor-pointer py-1 whitespace-nowrap ${
                activeNavSection === 'solutions'
                  ? 'text-[#3C83F6] font-black'
                  : 'text-slate-600 hover:text-[#3C83F6]'
              }`}
            >
              For Schools & Teams
            </button>

            <button 
              onClick={() => {
                if (!isDemoRunning) setIsDemoRunning(true);
                scrollToSection('stopwatch');
              }} 
              className={`transition-all duration-200 cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full border whitespace-nowrap ${
                activeNavSection === 'stopwatch'
                  ? 'bg-[#3C83F6] text-white border-[#3C83F6] font-extrabold shadow-md shadow-[#3C83F6]/25 ring-2 ring-blue-500/20 scale-[1.02]'
                  : 'text-[#3C83F6] bg-blue-50/80 hover:bg-blue-100/80 border-blue-100/90 font-bold hover:scale-[1.02]'
              }`}
              title={isDemoRunning ? "Stopwatch is running! Click to view" : "Click to start live stopwatch"}
            >
              <Clock className={`w-3.5 h-3.5 ${activeNavSection === 'stopwatch' ? 'text-white animate-spin-slow' : 'text-[#3C83F6]'}`} />
              <span>{isDemoRunning ? `Live Stopwatch (${formatDemoTime(demoTime)})` : 'Live Stopwatch Demo'}</span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${activeNavSection === 'stopwatch' ? 'bg-emerald-300 animate-ping' : 'bg-[#3C83F6]'}`} />
            </button>

            <button 
              onClick={() => scrollToSection('pricing')} 
              className={`transition-colors cursor-pointer py-1 whitespace-nowrap ${
                activeNavSection === 'pricing'
                  ? 'text-[#3C83F6] font-black'
                  : 'text-slate-600 hover:text-[#3C83F6]'
              }`}
            >
              Pricing
            </button>

            <button 
              onClick={() => scrollToSection('faq')} 
              className={`transition-colors cursor-pointer py-1 whitespace-nowrap ${
                activeNavSection === 'faq'
                  ? 'text-[#3C83F6] font-black'
                  : 'text-slate-600 hover:text-[#3C83F6]'
              }`}
            >
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
          <div id="stopwatch" className="lg:col-span-6 h-full scroll-mt-24">
            <HeroMotionShowcase 
              demoTime={demoTime}
              isDemoRunning={isDemoRunning}
              setIsDemoRunning={setIsDemoRunning}
              setDemoTime={setDemoTime}
            />
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
      <section id="capabilities" className="py-6 sm:py-8 px-4 lg:px-8 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* Left Column: Clean Typography & Highlights (No outer box) */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left space-y-4">
              
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-[#3C83F6] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 tracking-wider inline-block">
                  ALL-IN-ONE WORKSPACE
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Everything You Need to Master Your Daily Workflow
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  FlowTrack combines precision time tracking, project scheduling, and automated team insights into a clean, distraction-free workspace.
                </p>

                {/* Clean Highlights List with smooth hover effects */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3C83F6] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#3C83F6] group-hover:text-white group-hover:scale-110 transition-all duration-200">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#3C83F6] transition-colors">Precision Live Stopwatch Engine</h4>
                      <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5 group-hover:text-slate-600">
                        Start, pause, and log active work sessions with instant live sync across your workspace.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50/40 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-200">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Smart Project & Task Management</h4>
                      <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5 group-hover:text-slate-600">
                        Organize team assignments by category, priority level, and annual heatmaps.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-purple-100 hover:bg-purple-50/40 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#635BFF] group-hover:text-white group-hover:scale-110 transition-all duration-200">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#635BFF] transition-colors">Audit-Ready Exports & Security</h4>
                      <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5 group-hover:text-slate-600">
                        Instant PDF summaries and CSV logs with granular admin permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>



            </div>

            {/* Right Column: Compact Equal-Height Image Card */}
            <div className="lg:col-span-6 h-full flex flex-col justify-center">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-md relative bg-slate-900 flex items-center justify-center min-h-[260px] max-h-[340px]">
                <img 
                  src={heroDashboardImg} 
                  alt="FlowTrack Workspace Capabilities Preview" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl"
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
            <h4 className="font-black text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#3C83F6]" />
              <span>Subscribe Newsletter</span>
            </h4>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed font-medium">
              Stay updated with product releases, productivity guides, and stopwatch features.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200/90 rounded-xl text-emerald-800 text-[11px] font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                  }
                }}
                className="space-y-2"
              >
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#3C83F6] focus:ring-2 focus:ring-[#3C83F6]/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md hover:shadow-[#3C83F6]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe Now</span>
                </button>
              </form>
            )}
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
        <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto lg:overflow-hidden h-screen w-screen flex flex-col justify-center animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full max-w-[1600px] mx-auto">

            {/* LEFT: Brand & Showcase Panel (7 cols on lg screens) */}
            <div className="lg:col-span-7 xl:col-span-7 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] text-white relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 h-full overflow-y-auto lg:overflow-visible">
              
              {/* Radial Glowing Mesh & Ambient Accents */}
              <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[#3C83F6]/30 blur-3xl pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#3C83F6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

              {/* Top Header inside Brand Panel */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Clock className="w-4 h-4 text-blue-300 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-extrabold text-lg tracking-tight text-white block leading-none">FlowTrack</span>
                    <span className="text-[9px] font-bold text-blue-200 tracking-wider uppercase">Workspace & Stopwatch</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-white/90 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xs active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to site</span>
                </button>
              </div>

              {/* Middle Feature Highlights inside Brand Panel */}
              <div className="relative z-10 my-auto py-4 max-w-xl space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-extrabold text-blue-200 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>NEXT-GEN ORGANIZATION TIME TRACKING</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white tracking-tight">
                  Master Your Workflows <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-white">
                    With Precision Stopwatch
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium max-w-md">
                  {authMode === 'login'
                    ? 'Log in to access your organization dashboard, manage active tasks, and review live team stopwatches in real-time.'
                    : 'Set up your school, company, or team workspace in under 10 seconds. Enjoy seamless task assignments and 365-day reports.'}
                </p>

                {/* Glassmorphism Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                    <div className="flex items-center gap-2 text-white font-extrabold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Role-Based Access</span>
                    </div>
                    <p className="text-[10px] text-blue-100/80 font-medium leading-normal">
                      Distinct views for Principals, Team Admins, Faculty, and Students.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                    <div className="flex items-center gap-2 text-white font-extrabold text-xs">
                      <BarChart3 className="w-3.5 h-3.5 text-sky-300" />
                      <span>365-Day Heatmaps</span>
                    </div>
                    <p className="text-[10px] text-blue-100/80 font-medium leading-normal">
                      Instant annual activity heatmaps, PDF reports, and clean CSV logs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Workspace Metrics */}
              <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between gap-4 text-left">
                <div>
                  <div className="text-xl font-black text-white">2.3M+</div>
                  <div className="text-[10px] text-blue-200 font-semibold">Hours Tracked Monthly</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">18,400+</div>
                  <div className="text-[10px] text-blue-200 font-semibold">Active Workspaces</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">99.9%</div>
                  <div className="text-[10px] text-blue-200 font-semibold">Cloud Sync Uptime</div>
                </div>
              </div>

            </div>


            {/* RIGHT: High-End Form Panel (5 cols on lg screens) */}
            <div className="lg:col-span-5 xl:col-span-5 bg-slate-50 flex items-center justify-center p-3 sm:p-5 lg:p-6 xl:p-8 h-full overflow-y-auto">
              <div className="w-full max-w-md bg-white p-5 sm:p-6 xl:p-7 rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-500/10 space-y-3.5 my-auto">

                {/* Log In vs Register Account Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === 'login'
                        ? 'bg-white text-[#3C83F6] shadow-sm border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === 'signup'
                        ? 'bg-[#3C83F6] text-white shadow-sm shadow-[#3C83F6]/25'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Form Header */}
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    {authMode === 'login' ? (
                      <>
                        <span>Welcome Back!</span>
                        <span className="text-base">👋</span>
                      </>
                    ) : (
                      <>
                        <span>Create Workspace</span>
                        <Sparkles className="w-4 h-4 text-[#3C83F6]" />
                      </>
                    )}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">
                    {authMode === 'login'
                      ? 'Enter your credentials to manage active timers and tasks.'
                      : 'Register your school or organization workspace for free.'}
                  </p>
                </div>

                {/* Quick Demo Login Preset Buttons */}
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                  <div className="text-[9px] font-extrabold text-[#3C83F6] uppercase tracking-wider flex items-center justify-between">
                    <span>⚡ 1-Click Demo Logins</span>
                    <span className="bg-blue-100 text-[#3C83F6] px-1.5 py-0.5 rounded text-[8px]">Test Mode</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-800 hover:text-[#3C83F6] border border-blue-200/80 rounded-lg text-[10px] font-extrabold shadow-2xs transition-all cursor-pointer text-center truncate"
                      title="Log in as School Principal / Org Admin"
                    >
                      👑 Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('member')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-800 hover:text-[#3C83F6] border border-blue-200/80 rounded-lg text-[10px] font-extrabold shadow-2xs transition-all cursor-pointer text-center truncate"
                      title="Log in as Faculty / Team Member"
                    >
                      👩‍🏫 Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('guest')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-800 hover:text-[#3C83F6] border border-blue-200/80 rounded-lg text-[10px] font-extrabold shadow-2xs transition-all cursor-pointer text-center truncate"
                      title="Log in as Individual Guest"
                    >
                      👤 Student
                    </button>
                  </div>
                </div>

                {/* Account Type Selector (Only in Signup Mode) */}
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-800">Account Role</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAccountType('OrgAdmin')}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          accountType === 'OrgAdmin'
                            ? 'bg-blue-50/80 border-[#3C83F6] ring-1 ring-[#3C83F6]/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#3C83F6]" />
                          <span>Org Admin</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">Create & manage team</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccountType('TeamMember')}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          accountType === 'TeamMember'
                            ? 'bg-blue-50/80 border-[#3C83F6] ring-1 ring-[#3C83F6]/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#3C83F6]" />
                          <span>Team Member</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">Join existing team</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="space-y-2.5">

                  {authMode === 'signup' && (
                    <div className="space-y-0.5">
                      <label className="block text-[11px] font-bold text-slate-800">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Meeab Gull"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#3C83F6] focus:ring-2 focus:ring-[#3C83F6]/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <label className="block text-[11px] font-bold text-slate-800">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@apexacademy.edu"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#3C83F6] focus:ring-2 focus:ring-[#3C83F6]/20 transition-all"
                      />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-0.5">
                      <label className="block text-[11px] font-bold text-slate-800">
                        {accountType === 'OrgAdmin' ? 'Organization / School Name' : 'Organization Join Code'}
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={accountType === 'OrgAdmin' ? orgName : orgCode}
                          onChange={(e) => accountType === 'OrgAdmin' ? setOrgName(e.target.value) : setOrgCode(e.target.value)}
                          placeholder={accountType === 'OrgAdmin' ? "e.g. Apex Tech & Education" : "e.g. APEX-8921"}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#3C83F6] focus:ring-2 focus:ring-[#3C83F6]/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <label className="block text-[11px] font-bold text-slate-800">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#3C83F6] focus:ring-2 focus:ring-[#3C83F6]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'login' && (
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <label className="flex items-center gap-1.5 text-slate-600 font-bold cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-[#3C83F6] focus:ring-[#3C83F6]" defaultChecked />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('admin')}
                        className="text-[#3C83F6] font-extrabold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#3C83F6] hover:bg-[#2563EB] text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-[#3C83F6]/30 hover:shadow-lg hover:shadow-[#3C83F6]/40 cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                  >
                    <span>{authMode === 'login' ? 'Log In to FlowTrack' : 'Register Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-2 my-1.5">
                  <div className="h-[1px] bg-slate-200 flex-1" />
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
                    OR CONTINUE WITH
                  </span>
                  <div className="h-[1px] bg-slate-200 flex-1" />
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200/90 rounded-lg bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300 active:scale-[0.98]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16">
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
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200/90 rounded-lg bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300 active:scale-[0.98]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16">
                      <path fill="#0F172A" d="M13.5 5.7c-.9.05-1.55.5-2.05.5-.53 0-1.1-.45-1.87-.44-.96.01-1.85.55-2.34 1.4-1 1.73-.26 4.29.72 5.7.48.68 1.05 1.45 1.8 1.42.72-.03 1-.46 1.87-.46.87 0 1.12.46 1.88.45.78-.01 1.27-.7 1.75-1.38.55-.79.78-1.55.79-1.6-.02-.01-1.5-.58-1.52-2.3-.01-1.44 1.18-2.13 1.23-2.16-.68-1-1.73-1.11-2.1-1.13h.04zM10.9 4.4c.4-.48.68-1.16.6-1.83-.58.02-1.28.39-1.7.87-.37.42-.7 1.11-.61 1.76.64.05 1.3-.33 1.71-.8z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Switch line */}
                <p className="text-center text-[11px] text-slate-600 font-semibold pt-0.5">
                  {authMode === 'login' ? (
                    <>
                      Need a new Organization?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="font-black text-[#3C83F6] hover:underline cursor-pointer"
                      >
                        Register Organization
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="font-black text-[#3C83F6] hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>

                {/* Terms notice */}
                <p className="text-[9px] text-slate-400 text-center leading-normal font-medium">
                  By registering or logging in, you agree to FlowTrack's{' '}
                  <span className="underline cursor-pointer hover:text-slate-600">Terms</span> and{' '}
                  <span className="underline cursor-pointer hover:text-slate-600">Privacy</span>.
                </p>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

