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
  userName = 'Sara Ahmed'
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
    { id: 'yearHistory' as NavTab, label: '365d History', icon: Flame },
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#15181D] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl lg:shadow-none border-r border-[#232733]`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header & Logo */}
          <div className="h-18 px-6 flex items-center justify-between shrink-0">
            <button 
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border-1.5 border-[#8FA0FF] flex items-center justify-center text-[#8FA0FF]">
                <Timer className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-semibold tracking-tight text-white">
                Flow Track
              </span>
            </button>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#8A90A6] hover:text-white hover:bg-[#1F232C] lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-2 space-y-5 overflow-y-auto flex-1 scrollbar-none">
            
            {/* Workspace Section */}
            <div>
              <div className="px-3 text-[10.5px] font-mono font-semibold text-[#6B7180] uppercase tracking-widest mb-2">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2E4CFF] text-white shadow-md shadow-[#2E4CFF]/30'
                          : 'text-[#B6BAC9] hover:text-white hover:bg-[#1F232C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 opacity-85" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#232733] text-[#8FA0FF]'
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
              <div className="px-3 text-[10.5px] font-mono font-semibold text-[#6B7180] uppercase tracking-widest mb-2">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2E4CFF] text-white shadow-md shadow-[#2E4CFF]/30'
                          : 'text-[#B6BAC9] hover:text-white hover:bg-[#1F232C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 opacity-85" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Bottom Section: Upgrade Card & User Row */}
          <div className="p-4 space-y-3 shrink-0 border-t border-[#232733]">
            
            {/* Pro Upgrade Box */}
            <div className="p-4 rounded-xl bg-[#1F232C] relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-radial from-[#2E4CFF]/40 to-transparent pointer-events-none" />
              <b className="text-xs font-semibold text-white block mb-1 relative z-10">Go Pro</b>
              <p className="text-[11.5px] text-[#9CA1B3] leading-relaxed mb-3 relative z-10">
                Unlimited projects, budget alerts and priority support.
              </p>
              <button
                onClick={onOpenAiModal}
                className="w-full py-2 bg-[#2E4CFF] hover:bg-[#1B2FBF] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 relative z-10 cursor-pointer"
              >
                <span>Upgrade workspace</span>
              </button>
            </div>

            {/* User Profile Row */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src={userAvatar}
                alt={userName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover bg-[#2E4CFF]/20"
              />
              <div className="min-w-0 flex-1">
                <b className="text-xs font-semibold text-white block truncate">{userName}</b>
                <span className="text-[11px] text-[#8A90A6] block truncate">{orgName}</span>
              </div>
            </div>

          </div>

        </div>
      </aside>
    </>
  );
};
