import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Ban } from 'lucide-react';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { TrackerView } from './components/TrackerView';
import { ProjectsView } from './components/ProjectsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { GoalsView } from './components/GoalsView';
import { OrganizationView } from './components/OrganizationView';
import { YearHistoryView } from './components/YearHistoryView';
import { CodeGuideView } from './components/CodeGuideView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { AddTaskModal } from './components/AddTaskModal';
import { AiInsightsModal } from './components/AiInsightsModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminPanel } from './components/AdminPanel';
import { Task, Category, UserProfile, Organization, TeamMember } from './types';
import { DEFAULT_CATEGORIES, generate1YearSampleTasks } from './utils/sampleData';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Admin Route state check
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin' || window.location.search.includes('admin');
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const isCurrentlyAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin' || window.location.search.includes('admin');
      setIsAdminView(isCurrentlyAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    const interval = setInterval(handleUrlChange, 1000);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      clearInterval(interval);
    };
  }, []);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Theme Mode & Accent Color
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sunset' | 'system'>(() => {
    return (localStorage.getItem('flowtrack_theme_mode') as any) || 'light';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('flowtrack_accent_color') || '#3C83F6';
  });

  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>(() => {
    return (localStorage.getItem('flowtrack_ui_density') as any) || 'comfortable';
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'sunset');

      if (themeMode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(themeMode);
      }

      root.setAttribute('data-density', density);
      root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
      root.classList.add(`density-${density}`);
      localStorage.setItem('flowtrack_ui_density', density);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode, density]);

  // Categories & User Profile
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('flowtrack_logged_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object' && parsed.email && parsed.isSignedIn !== false) {
          return {
            ...parsed,
            isSignedIn: true
          };
        }
      }
    } catch (e) {
      console.error('Error restoring saved user session:', e);
    }
    return {
      id: 'usr_admin_001',
      name: 'Meeab Gull (Admin)',
      email: 'admin@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'School & Organization Admin',
      isSignedIn: false, // Default to false if no saved session exists
      accountType: 'OrgAdmin',
      orgId: 'org_apex_01',
      orgName: 'Apex Tech & Education Academy',
      orgType: 'School/University',
      orgRole: 'Admin'
    };
  });

  // Persist user login session state across browser reopens / refreshes
  useEffect(() => {
    try {
      if (user.isSignedIn && user.email) {
        localStorage.setItem('flowtrack_logged_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('flowtrack_logged_user');
      }
    } catch (e) {
      console.error('Error saving user session state:', e);
    }
  }, [user]);

  // Organization Workspace State
  const [organization, setOrganization] = useState<Organization>({
    id: 'org_apex_01',
    name: 'Apex Tech & Education Academy',
    type: 'School/University',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    code: 'APEX-8921',
    memberCount: 5,
    adminName: 'Meeab Gull',
    adminEmail: 'admin@apexacademy.edu'
  });

  // Team Members State initialized dynamically from MongoDB
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Real-time fetch of team members from MongoDB Atlas Database
  const fetchRealTimeUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const userOrgName = (user.orgName || organization.name)?.toLowerCase().trim();
        const userOrgCode = organization.code?.toLowerCase().trim();
        const currentUserEmail = user.email?.toLowerCase().trim();

        // Filter users belonging to the current user's workspace/organization or email
        const filteredUsers = json.data.filter((u: any) => {
          const uEmail = u.email?.toLowerCase().trim();
          const uOrgName = u.orgName?.toLowerCase().trim();
          const uOrgCode = u.orgCode?.toLowerCase().trim();

          if (currentUserEmail && uEmail === currentUserEmail) return true;
          if (userOrgName && uOrgName && uOrgName === userOrgName) return true;
          if (userOrgCode && uOrgCode && uOrgCode === userOrgCode) return true;

          return false;
        });

        // If no users match yet, fallback to current logged-in user
        const targetUsers = filteredUsers.length > 0 ? filteredUsers : [{
          _id: user.id || 'usr_current',
          fullName: user.name,
          email: user.email,
          photoURL: user.avatar,
          accountType: user.role === 'Admin' ? 'OrgAdmin' : 'TeamMember',
          orgName: user.orgName || organization.name,
          orgCode: organization.code
        }];

        const mappedMembers: TeamMember[] = targetUsers.map((u: any, idx: number) => {
          const name = u.fullName || (u.email ? u.email.split('@')[0] : 'Member');
          const email = u.email || '';
          const avatar = u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3C83F6`;
          return {
            id: u._id || `usr_mongo_${idx}`,
            name,
            email,
            avatar,
            role: u.accountType === 'OrgAdmin' ? 'Organization Admin' : u.accountType || 'Team Member',
            department: u.orgType || u.orgName || 'Engineering',
            activeStatus: idx === 0 ? 'Tracking' : 'Idle',
            currentTaskTitle: `Active in ${u.orgName || 'Workspace'}`,
            todayLoggedSeconds: 0,
            weeklyLoggedSeconds: 0,
            completedTasksCount: 0,
            assignedTasksCount: 0,
            joinedDate: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            orgRole: u.accountType === 'OrgAdmin' || (currentUserEmail && email.toLowerCase() === currentUserEmail) ? 'Admin' : 'Member',
          };
        });

        setTeamMembers(mappedMembers);
        setOrganization((prev) => ({
          ...prev,
          memberCount: mappedMembers.length,
        }));
      }
    } catch {
      // Silently handle transient connection errors
    }
  }, [user.email, user.name, user.avatar, user.role, user.orgName, user.id, organization.name, organization.code]);

  useEffect(() => {
    fetchRealTimeUsers();
  }, [user.isSignedIn, fetchRealTimeUsers]);

  // Tasks state with per-user LocalStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      if (user?.email) {
        const saved = localStorage.getItem(`flowtrack_tasks_${user.email.toLowerCase().trim()}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse saved tasks:', err);
    }
    return [];
  });

  // Active Timer State
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Suspended User Alert Modal State
  const [isSuspendedPopupOpen, setIsSuspendedPopupOpen] = useState(false);
  const [suspendedEmail, setSuspendedEmail] = useState('');

  // Real-time suspension check polling (enforces instant logout when admin suspends account)
  useEffect(() => {
    if (!user.isSignedIn || !user.email) return;

    let isSubscribed = true;

    const checkSuspensionStatus = async () => {
      try {
        const res = await fetch(`/api/admin/status?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (isSubscribed && json.success && json.isSuspended) {
          setSuspendedEmail(user.email);
          setIsSuspendedPopupOpen(true);
          setUser((prev) => ({ ...prev, isSignedIn: false }));
          localStorage.removeItem('flowtrack_logged_user');
        }
      } catch {
        // Silently catch transient network glitches during polling
      }
    };

    checkSuspensionStatus();
    const interval = setInterval(checkSuspensionStatus, 4000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [user.isSignedIn, user.email]);

  // Sync tasks state when user email changes
  useEffect(() => {
    if (!user?.email || !user.isSignedIn) {
      setTasks([]);
      return;
    }
    const key = `flowtrack_tasks_${user.email.toLowerCase().trim()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          return;
        }
      }
    } catch (err) {
      console.error('Error loading tasks for email:', err);
    }
    // New email account: start fresh with zero pre-added tasks/time
    setTasks([]);
  }, [user.email, user.isSignedIn]);

  // Save tasks to LocalStorage per user email on change
  useEffect(() => {
    if (!user?.email || !user.isSignedIn) return;
    const key = `flowtrack_tasks_${user.email.toLowerCase().trim()}`;
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to local storage:', err);
    }
  }, [tasks, user.email, user.isSignedIn]);

  // Live Timer Interval Engine (1 second updates)
  useEffect(() => {
    if (!activeTimerTaskId) return;

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === activeTimerTaskId) {
            return {
              ...t,
              time_spent_seconds: t.time_spent_seconds + 1,
              updated_at: new Date().toISOString(),
            };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimerTaskId]);

  // Active running task details
  const activeTask = useMemo(() => {
    return tasks.find((t) => t.id === activeTimerTaskId);
  }, [tasks, activeTimerTaskId]);

  // Toggle Live Timer Stopwatch
  const handleToggleTimer = (taskId: string) => {
    setActiveTimerTaskId((current) => {
      if (current === taskId) return null;
      
      // Update task status to In Progress
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'In Progress', is_timer_running: true } : { ...t, is_timer_running: false }))
      );
      return taskId;
    });
  };

  // Toggle Task Completion
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'Completed';
          if (isNowCompleted && activeTimerTaskId === taskId) {
            setActiveTimerTaskId(null);
          }
          return {
            ...t,
            status: isNowCompleted ? 'Completed' : 'Pending',
            is_timer_running: false,
            completed_at: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    if (activeTimerTaskId === taskId) {
      setActiveTimerTaskId(null);
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Save New or Edited Task
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'user_id' | 'time_spent_seconds' | 'created_at' | 'updated_at'>,
    editTaskId?: string
  ) => {
    const nowISO = new Date().toISOString();

    if (editTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editTaskId
            ? {
                ...t,
                ...taskData,
                updated_at: nowISO,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_id: user.id,
        time_spent_seconds: 0,
        created_at: nowISO,
        updated_at: nowISO,
        ...taskData,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('flowtrack_logged_user');
    } catch (e) {
      console.error(e);
    }
    setUser((prev) => ({ ...prev, isSignedIn: false }));
    setCurrentTab('dashboard');
  };

  // Add Team Member to Organization & MongoDB Atlas Database
  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    fetch('/api/admin/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: memberData.name,
        email: memberData.email,
        password: '[Added via Organization Workspace]',
        photoURL: memberData.avatar,
        accountType: memberData.orgRole === 'Admin' ? 'OrgAdmin' : 'TeamMember',
        orgName: organization.name,
        orgType: memberData.department,
        orgCode: organization.code
      })
    })
      .then(() => {
        fetchRealTimeUsers();
      })
      .catch((err) => {
        console.error('Error logging new team member to MongoDB:', err);
      });
  };

  // Assign Task to Team Member
  const handleAssignTask = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'time_spent_seconds'>) => {
    const nowISO = new Date().toISOString();
    const newTask: Task = {
      id: `task_assigned_${Date.now()}`,
      time_spent_seconds: 0,
      created_at: nowISO,
      updated_at: nowISO,
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);

    // Update assigned count for team member
    if (taskData.assigned_to_id) {
      setTeamMembers(prev => prev.map(m => {
        if (m.id === taskData.assigned_to_id) {
          return {
            ...m,
            assignedTasksCount: m.assignedTasksCount + 1,
            currentTaskTitle: taskData.title
          };
        }
        return m;
      }));
    }
  };

  // Seed 1-Year Sample Data
  const handleSeedData = () => {
    const sample = generate1YearSampleTasks();
    setTasks(sample);
    setActiveTimerTaskId(null);
  };

  // User Projects Count Calculation for Sidebar Badge
  const userProjectsCount = useMemo(() => {
    if (!user?.email || !user.isSignedIn) return 0;
    try {
      const saved = localStorage.getItem(`flowtrack_projects_${user.email.toLowerCase().trim()}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch (e) {
      console.error(e);
    }
    const uniqueProjects = new Set(tasks.map(t => t.project_name || t.category_id).filter(Boolean));
    return uniqueProjects.size;
  }, [user?.email, user?.isSignedIn, tasks]);

  // Initial Application Loading Screen
  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  // Admin Master Panel Route - Bypass sign-in gates
  if (isAdminView) {
    return <AdminPanel />;
  }

  // Step 1 Gate: If user is not signed in, show mandatory Auth / Registration screen
  if (!user.isSignedIn) {
    return (
      <>
        {/* REAL-TIME SUSPENDED USER ALERT POPUP MODAL */}
        {isSuspendedPopupOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl relative text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Ban className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Account Suspended</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Your account (<strong className="text-red-400 font-mono">{suspendedEmail}</strong>) has been <strong className="text-red-400 uppercase font-bold">suspended</strong> by an administrator.
              </p>
              <p className="text-xs text-slate-400 mt-2 bg-red-950/40 p-3 rounded-xl border border-red-500/20">
                You have been logged out automatically. You will not be able to access the app or log in until an administrator reactivates your account.
              </p>
              <button
                onClick={() => setIsSuspendedPopupOpen(false)}
                className="w-full mt-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <span>Understand & Dismiss</span>
              </button>
            </div>
          </div>
        )}
        <AuthScreen onSignIn={(newUser) => setUser(newUser)} />
      </>
    );
  }

  // If on landing page view, render full landing page
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentTab('dashboard')}
        onSignIn={() => setIsAuthModalOpen(true)}
        onViewDemo={() => setCurrentTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans antialiased selection:bg-[#635BFF] selection:text-white flex">
      
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        orgName={user.orgName || 'Northline Design'}
        isOrgAdmin={user.accountType === 'OrgAdmin' || user.orgRole === 'Admin'}
        userName={user.name}
        userAvatar={user.avatar}
        onLogout={handleLogout}
        projectsCount={userProjectsCount}
      />

      {/* Main Content Area (Offset by 64px / lg:ml-64 for fixed sidebar) */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <TopBar
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
          user={user}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setCurrentTab('profile')}
          onLogout={handleLogout}
          onOpenAddTask={() => {
            setTaskToEdit(null);
            setIsAddTaskOpen(true);
          }}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          isTimerRunning={!!activeTimerTaskId}
          activeTaskRunningTitle={activeTask?.title}
          activeTaskSeconds={activeTask?.time_spent_seconds}
          onToggleActiveTimer={() => activeTimerTaskId && handleToggleTimer(activeTimerTaskId)}
        />

        {/* Dynamic Route View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* Main Dashboard */}
          {currentTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              activeTimerTaskId={activeTimerTaskId}
              onToggleTimer={handleToggleTimer}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
              onOpenEditTask={(t) => {
                setTaskToEdit(t);
                setIsAddTaskOpen(true);
              }}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onSeedData={handleSeedData}
              onNavigateTab={setCurrentTab}
              user={user}
            />
          )}

          {/* Dedicated Time Tracker Page (from user mockup) */}
          {currentTab === 'tracker' && (
            <TrackerView
              tasks={tasks}
              activeTimerTaskId={activeTimerTaskId}
              onToggleTimer={handleToggleTimer}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
              onOpenEditTask={(t) => {
                setTaskToEdit(t);
                setIsAddTaskOpen(true);
              }}
              user={user}
            />
          )}

          {/* Dedicated Organization & Team Workspace */}
          {currentTab === 'organization' && (
            <OrganizationView
              user={user}
              organization={organization}
              teamMembers={teamMembers}
              onAddTeamMember={handleAddTeamMember}
              onAssignTask={handleAssignTask}
              tasks={tasks}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* Dedicated Projects Page */}
          {currentTab === 'projects' && (
            <ProjectsView
              tasks={tasks}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
              onToggleTimer={handleToggleTimer}
              activeTimerTaskId={activeTimerTaskId}
              user={user}
            />
          )}

          {/* Dedicated Analytics Page */}
          {currentTab === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              user={user}
            />
          )}

          {/* Dedicated Reports & Timesheets Page */}
          {currentTab === 'reports' && (
            <ReportsView
              tasks={tasks}
              user={user}
            />
          )}

          {/* Dedicated Goals & Objectives Page */}
          {currentTab === 'goals' && (
            <GoalsView
              tasks={tasks}
              user={user}
            />
          )}

          {/* Dedicated User Profile Page */}
          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateUser={setUser}
              organization={organization}
              teamMembers={teamMembers}
              tasks={tasks}
              onNavigateTab={setCurrentTab}
              onToggleTimer={handleToggleTimer}
              activeTimerTaskId={activeTimerTaskId}
              onLogout={handleLogout}
            />
          )}

          {/* Dedicated Settings & Preferences Page */}
          {currentTab === 'settings' && (
            <SettingsView 
              user={user} 
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              density={density}
              setDensity={setDensity}
            />
          )}

          {/* Calendar tab fallback to Dashboard */}
          {currentTab === 'calendar' && (
            <DashboardView
              tasks={tasks}
              activeTimerTaskId={activeTimerTaskId}
              onToggleTimer={handleToggleTimer}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
              onOpenEditTask={(t) => {
                setTaskToEdit(t);
                setIsAddTaskOpen(true);
              }}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onSeedData={handleSeedData}
              onNavigateTab={setCurrentTab}
              user={user}
            />
          )}

          {/* 1-Year History Heatmap View */}
          {currentTab === 'yearHistory' && (
            <YearHistoryView
              tasks={tasks}
              onSeedData={handleSeedData}
              onClearData={() => setTasks([])}
            />
          )}

          {/* Developer SQL Schema & Code Docs */}
          {currentTab === 'codeGuide' && <CodeGuideView />}

        </main>

      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSaveTask={handleSaveTask}
        categories={categories}
        taskToEdit={taskToEdit}
      />

      <AiInsightsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        tasks={tasks}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUpdateUser={setUser}
      />

      {/* REAL-TIME SUSPENDED USER ALERT POPUP MODAL */}
      {isSuspendedPopupOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <Ban className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Account Suspended</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Your account (<strong className="text-red-400 font-mono">{suspendedEmail}</strong>) has been <strong className="text-red-400 uppercase font-bold">suspended</strong> by an administrator.
            </p>
            <p className="text-xs text-slate-400 mt-2 bg-red-950/40 p-3 rounded-xl border border-red-500/20">
              You have been logged out automatically. You will not be able to access the app or log in until an administrator reactivates your account.
            </p>
            <button
              onClick={() => setIsSuspendedPopupOpen(false)}
              className="w-full mt-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <span>Understand & Dismiss</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
