import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  UserPlus, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  BarChart2, 
  ArrowRight,
  Filter
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'system' | 'team' | 'task' | 'security';
  isRead: boolean;
  actionTab?: string;
  actionLabel?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
  userEmail?: string;
  userName?: string;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  userEmail,
  userName,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'team' | 'task' | 'security'>('all');

  // Load or initialize notifications from localStorage
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const emailKey = userEmail ? userEmail.toLowerCase().trim() : 'guest';
    const storageKey = `flowtrack_notifs_${emailKey}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading notifications:', e);
    }

    // Default notifications for fresh account
    const cleanName = userName || (userEmail ? userEmail.split('@')[0] : 'Member');
    return [
      {
        id: `welcome_${Date.now()}`,
        title: `🎉 Welcome to FlowTrack, ${cleanName}!`,
        message: `Your account (${userEmail || 'registered email'}) has been created successfully. Welcome aboard! Explore your workspace, set up tasks, and track productive time.`,
        timestamp: 'Just now',
        type: 'system',
        isRead: false,
        actionTab: 'dashboard',
        actionLabel: 'Go to Dashboard',
      },
      {
        id: 'notif_team_invite',
        title: '📩 Team Workspace Invitation Code',
        message: 'Your workspace organization code is APEX-8921. Share this code with team members to join.',
        timestamp: '10 mins ago',
        type: 'team',
        isRead: false,
        actionTab: 'organization',
        actionLabel: 'View Team Workspace',
      },
      {
        id: 'notif_security',
        title: '🔒 Account Security & Login Verified',
        message: 'Password and security details verified for your new FlowTrack account.',
        timestamp: '1 hour ago',
        type: 'security',
        isRead: true,
      },
      {
        id: 'notif_analytics',
        title: '📊 Productivity Dashboard Ready',
        message: 'Real-time 365-day heatmaps and task stopwatch analytics are active.',
        timestamp: '2 hours ago',
        type: 'system',
        isRead: false,
        actionTab: 'analytics',
        actionLabel: 'View Analytics',
      },
    ];
  });

  // Sync back to localStorage whenever notifications state or user changes
  React.useEffect(() => {
    const emailKey = userEmail ? userEmail.toLowerCase().trim() : 'guest';
    const storageKey = `flowtrack_notifs_${emailKey}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  }, [notifications, userEmail]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'team') return n.type === 'team';
    if (filter === 'task') return n.type === 'task';
    if (filter === 'security') return n.type === 'security';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const handleAction = (tab?: string) => {
    if (tab && onNavigateTab) {
      onNavigateTab(tab);
      onClose();
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'team':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#3C83F6]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3C83F6]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-full ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                Notifications Center
                {unreadCount > 0 && (
                  <span className="text-[11px] font-extrabold px-2 py-0.5 bg-blue-100 text-[#3C83F6] rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                System alerts, team invitations, and task updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#3C83F6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('team')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'team'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setFilter('task')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === 'task'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tasks
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">No notifications found</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {filter === 'unread'
                  ? 'All caught up! You have no unread notifications.'
                  : 'Your notification inbox is completely empty.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleToggleRead(n.id)}
                className={`pt-3 first:pt-0 group flex items-start gap-3.5 p-3 rounded-xl transition-all cursor-pointer ${
                  !n.isRead
                    ? 'bg-blue-50/40 border border-blue-100/80 shadow-2xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* Type Icon Badge */}
                <div className={`p-2 rounded-xl shrink-0 ${
                  !n.isRead ? 'bg-white shadow-2xs ring-1 ring-slate-200' : 'bg-slate-100'
                }`}>
                  {getIconForType(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold truncate ${
                      !n.isRead ? 'text-slate-900 font-extrabold' : 'text-slate-700'
                    }`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {n.message}
                  </p>

                  {/* Optional Action Button */}
                  {n.actionLabel && (
                    <div className="pt-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(n.actionTab);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3C83F6] hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        <span>{n.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread status dot indicator */}
                <div className="pt-1 shrink-0">
                  {!n.isRead ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block ring-2 ring-blue-100" title="Unread" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-200 inline-block opacity-0 group-hover:opacity-100 transition-opacity" title="Read" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>FlowTrack Real-time Notifications</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
