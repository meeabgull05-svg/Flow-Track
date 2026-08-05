import React from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  FolderKanban, 
  Calendar as CalendarIcon, 
  BarChart3, 
  FileText, 
  Target, 
  Settings, 
  Flame, 
  Code, 
  ChevronRight, 
  Sparkles,
  Zap,
  Building2,
  Users,
  User,
  LogOut,
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'tracker' 
  | 'organization'
  | 'projects' 
  | 'calendar' 
  | 'analytics' 
  | 'reports' 
  | 'goals' 
  | 'profile' 
  | 'settings' 
  | 'yearHistory' 
  | 'codeGuide' 
  | 'landing';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAiModal: () => void;
  orgName?: string;
  isOrgAdmin?: boolean;
  userAvatar?: string;
  userName?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAiModal,
  orgName = 'Northline Design',
  isOrgAdmin = true,
  userAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  userName = 'Sara Ahmed',
  onLogout
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker' as NavTab, label: 'Timer', icon: Timer, badge: 'Live' },
    { id: 'projects' as NavTab, label: 'Projects', icon: FolderKanban, badge: '12' },
    { id: 'reports' as NavTab, label: 'Reports', icon: FileText },
    { id: 'organization' as NavTab, label: 'Team', icon: Building2, badge: isOrgAdmin ? 'Admin' : undefined },
  ];

  const extraNavItems = [
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: CalendarIcon },
    { id: 'goals' as NavTab, label: 'Goals', icon: Target },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white text-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none border-r border-slate-200/80`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header & Logo */}
          <div className="h-18 px-6 flex items-center justify-between shrink-0 border-b border-slate-100">
            <button 
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#3C83F6] group-hover:scale-105 transition-transform">
                <Timer className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
                Flow Track
              </span>
            </button>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3.5 py-4 space-y-5 overflow-y-auto flex-1 scrollbar-none">
            
            {/* Workspace Section */}
            <div>
              <div className="px-3 text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                Workspace
              </div>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#3C83F6] text-white shadow-md shadow-[#3C83F6]/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#3C83F6] border border-blue-100'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Manage Section */}
            <div>
              <div className="px-3 text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
                Manage
              </div>
              <nav className="space-y-1">
                {extraNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#3C83F6] text-white shadow-md shadow-[#3C83F6]/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Bottom Section: Upgrade Card & User Row */}
          <div className="p-3.5 space-y-3 shrink-0 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-transparent">
            
            {/* Pro Upgrade Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-white border border-blue-100 shadow-2xs relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-blue-400/15 pointer-events-none blur-sm" />
              <b className="text-xs font-black text-slate-900 block mb-1 relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3C83F6]" />
                <span>Go Pro</span>
              </b>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3 relative z-10">
                Unlimited projects, budget alerts and priority support.
              </p>
              <button
                type="button"
                onClick={onOpenAiModal}
                className="w-full py-2 bg-[#3C83F6] hover:bg-[#2563eb] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 relative z-10 cursor-pointer"
              >
                <span>Upgrade workspace</span>
              </button>
            </div>



          </div>

        </div>
      </aside>
    </>
  );
};
