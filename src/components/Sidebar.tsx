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
  X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'tracker' 
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  onCloseMobile,
  onOpenAiModal
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker' as NavTab, label: 'Time Tracker', icon: Timer, badge: 'Live' },
    { id: 'projects' as NavTab, label: 'Projects', icon: FolderKanban },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: CalendarIcon },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as NavTab, label: 'Reports', icon: FileText },
    { id: 'goals' as NavTab, label: 'Goals', icon: Target },
  ];

  const extraNavItems = [
    { id: 'yearHistory' as NavTab, label: '1-Year History', icon: Flame, tag: '365d' },
    { id: 'codeGuide' as NavTab, label: 'SQL & Code Guide', icon: Code, tag: 'Docs' },
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
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        <div>
          {/* Top Header & Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <button 
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center text-white shadow-md shadow-[#635BFF]/30 group-hover:scale-105 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    FlowTrack
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-none">
            
            {/* Main Section */}
            <div>
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Menu
              </div>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Platform / Developer Section */}
            <div>
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Analytics & Code
              </div>
              <nav className="space-y-1">
                {extraNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.tag && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

          </div>
        </div>

        {/* Bottom Section: Pro Upgrade Card & Version Footer */}
        <div className="p-3 border-t border-slate-100 space-y-3">
          
          {/* Pastel Pro Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/60 to-blue-50 border border-purple-100/80 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded-lg bg-[#635BFF] text-white">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug mb-3">
              Unlock AI breakdown, 365d analytics & unlimited timers.
            </p>
            <button
              onClick={onOpenAiModal}
              className="w-full py-2 px-3 bg-[#635BFF] hover:bg-[#5249ea] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade Now</span>
            </button>
          </div>

          {/* Footer Metadata */}
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>FlowTrack v1.0.0</span>
            <span className="flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer">
              Active <ChevronRight className="w-3 h-3" />
            </span>
          </div>

        </div>

      </aside>
    </>
  );
};
