import React, { useState, useEffect, useMemo } from 'react';
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
import { LandingPage } from './components/LandingPage';
import { AddTaskModal } from './components/AddTaskModal';
import { AiInsightsModal } from './components/AiInsightsModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { Task, Category, UserProfile, Organization, TeamMember } from './types';
import { DEFAULT_CATEGORIES, generate1YearSampleTasks } from './utils/sampleData';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Categories & User Profile
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_admin_001',
    name: 'Meeab Gull (Admin)',
    email: 'admin@apexacademy.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'School & Organization Admin',
    isSignedIn: false, // Default to false so Login / Sign Up is the very first step
    accountType: 'OrgAdmin',
    orgId: 'org_apex_01',
    orgName: 'Apex Tech & Education Academy',
    orgType: 'School/University',
    orgRole: 'Admin'
  });

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

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'usr_admin_001',
      name: 'Meeab Gull',
      email: 'admin@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Principal & Org Admin',
      department: 'Management',
      activeStatus: 'Tracking',
      currentTaskTitle: 'Reviewing Curriculum & Team Velocity Reports',
      todayLoggedSeconds: 14820, // 4h 07m
      weeklyLoggedSeconds: 124000,
      completedTasksCount: 12,
      assignedTasksCount: 4,
      joinedDate: '2025-01-10',
      orgRole: 'Admin'
    },
    {
      id: 'usr_member_002',
      name: 'Sarah Khan',
      email: 'sarah.k@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Senior UI/UX Designer',
      department: 'Design & Product',
      activeStatus: 'Tracking',
      currentTaskTitle: 'Designing Student Portal Dashboard Wireframes',
      todayLoggedSeconds: 18400, // 5h 06m
      weeklyLoggedSeconds: 118000,
      completedTasksCount: 18,
      assignedTasksCount: 3,
      joinedDate: '2025-02-01',
      orgRole: 'Member'
    },
    {
      id: 'usr_member_003',
      name: 'Professor Usman',
      email: 'usman.prof@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Faculty Head',
      department: 'Academic Faculty',
      activeStatus: 'Break',
      currentTaskTitle: 'Grading Midterm Physics & CS Papers',
      todayLoggedSeconds: 11200, // 3h 06m
      weeklyLoggedSeconds: 95000,
      completedTasksCount: 9,
      assignedTasksCount: 5,
      joinedDate: '2025-01-15',
      orgRole: 'Manager'
    },
    {
      id: 'usr_member_004',
      name: 'Ali Raza',
      email: 'ali.dev@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Frontend Engineer',
      department: 'Engineering',
      activeStatus: 'Tracking',
      currentTaskTitle: 'Refactoring React Stopwatch Component & Local Storage',
      todayLoggedSeconds: 16200, // 4h 30m
      weeklyLoggedSeconds: 110000,
      completedTasksCount: 15,
      assignedTasksCount: 2,
      joinedDate: '2025-02-10',
      orgRole: 'Member'
    },
    {
      id: 'usr_member_005',
      name: 'Ayesha Noor',
      email: 'ayesha.n@apexacademy.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Junior Research Student',
      department: 'Students',
      activeStatus: 'Idle',
      currentTaskTitle: 'Preparing Final Semester Presentation',
      todayLoggedSeconds: 7200, // 2h 00m
      weeklyLoggedSeconds: 68000,
      completedTasksCount: 6,
      assignedTasksCount: 2,
      joinedDate: '2025-03-01',
      orgRole: 'Member'
    }
  ]);

  // Tasks state with LocalStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('flowtrack_tasks_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to parse saved tasks:', err);
    }
    return generate1YearSampleTasks();
  });

  // Active Timer State
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Save tasks to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('flowtrack_tasks_v1', JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to local storage:', err);
    }
  }, [tasks]);

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

  // Add Team Member to Organization
  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `usr_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers(prev => [...prev, newMember]);
    setOrganization(prev => ({
      ...prev,
      memberCount: prev.memberCount + 1
    }));
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

  // Step 1 Gate: If user is not signed in, show mandatory Auth / Registration screen
  if (!user.isSignedIn) {
    return <AuthScreen onSignIn={(newUser) => setUser(newUser)} />;
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
      />

      {/* Main Content Area (Offset by 64px / lg:ml-64 for fixed sidebar) */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <TopBar
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
          user={user}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
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

          {/* Other navigation tabs fallback to Dashboard */}
          {(currentTab === 'calendar' || currentTab === 'settings') && (
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

    </div>
  );
}
