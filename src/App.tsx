import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { YearHistoryView } from './components/YearHistoryView';
import { CodeGuideView } from './components/CodeGuideView';
import { LandingPage } from './components/LandingPage';
import { AiInsightsModal } from './components/AiInsightsModal';
import { AuthModal } from './components/AuthModal';
import { Task, TimeFilter, Category, UserProfile } from './types';
import { DEFAULT_CATEGORIES, generate1YearSampleTasks } from './utils/sampleData';
import { formatDuration, isTaskInTimeFilter } from './utils/timeUtils';
import { Plus, Clock, CheckCircle2, Calendar, Filter, Sparkles, RefreshCw, Layers, ShieldCheck, Flame } from 'lucide-react';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'yearHistory' | 'codeGuide' | 'landing'>('dashboard');

  // Categories & User Profile
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_clerk_flowtrack_001',
    name: 'Meeab Gull',
    email: 'meeabgull05@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'Pro Developer',
    isSignedIn: true,
  });

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

  // Filters & Search
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState<TimeFilter>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

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

  // Live Timer Interval Engine
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

  // Add Manual Time Log (+Seconds)
  const handleAddManualTime = (taskId: string, secondsToAdd: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              time_spent_seconds: t.time_spent_seconds + secondsToAdd,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  };

  // Seed 1-Year Sample Data
  const handleSeedData = () => {
    const sample = generate1YearSampleTasks();
    setTasks(sample);
    setActiveTimerTaskId(null);
  };

  // Filter tasks for Main Dashboard view
  const dashboardTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Timeframe filter
      if (!isTaskInTimeFilter(t, dashboardTimeFilter)) return false;

      // Category filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;

      return true;
    });
  }, [tasks, dashboardTimeFilter, selectedCategory, selectedPriority]);

  // Dashboard total logged seconds
  const dashboardTotalSeconds = useMemo(() => {
    return dashboardTasks.reduce((acc, t) => acc + t.time_spent_seconds, 0);
  }, [dashboardTasks]);

  const dashboardCompletedCount = useMemo(() => {
    return dashboardTasks.filter((t) => t.status === 'Completed').length;
  }, [dashboardTasks]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeTaskRunningTitle={activeTask?.title}
        activeTaskSeconds={activeTask?.time_spent_seconds}
        isTimerRunning={!!activeTimerTaskId}
        onToggleActiveTimer={() => activeTimerTaskId && handleToggleTimer(activeTimerTaskId)}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAddTask={() => {
          setTaskToEdit(null);
          setIsAddTaskOpen(true);
        }}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onSeedData={handleSeedData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* TAB 1: DASHBOARD VIEW */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Dashboard Banner / Summary Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    FlowTrack Live Workspace
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Task Management & Live Stopwatch
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Add tasks, track time live, and organize work entries seamlessly.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSeedData}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                  title="Populate 365 days of sample tasks for history analytics"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Seed 1-Year Sample Tasks</span>
                </button>

                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsAddTaskOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Time Logged ({dashboardTimeFilter})</div>
                  <div className="text-xl font-mono font-bold text-white mt-0.5">
                    {formatDuration(dashboardTotalSeconds)}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Completed Tasks</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {dashboardCompletedCount} <span className="text-xs text-slate-500 font-normal">/ {dashboardTasks.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Active Timer State</div>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5 truncate max-w-[140px]">
                    {activeTask ? activeTask.title : 'No Timer Active'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">History Period</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">
                    365-Day Archive Ready
                  </div>
                </div>
              </div>

            </div>

            {/* Time horizon pill tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-xs font-semibold text-slate-400 px-3 hidden sm:inline">Filter:</span>
                
                {(['today', 'week', 'month', 'year', 'all'] as TimeFilter[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setDashboardTimeFilter(tf)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      dashboardTimeFilter === tf
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tf === 'year' ? '1-Year History' : tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : tf}
                  </button>
                ))}
              </div>

              {/* Category & Priority Selectors */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Main Task Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Tasks ({dashboardTasks.length})</span>
                </h2>
                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsAddTaskOpen(true);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Task
                </button>
              </div>

              {dashboardTasks.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-200">No tasks found for this filter</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    There are no tasks matching your selected timeframe or categories. Create a task or seed sample data!
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setTaskToEdit(null);
                        setIsAddTaskOpen(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                    >
                      Create First Task
                    </button>
                    <button
                      onClick={handleSeedData}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                    >
                      Seed 1-Year Sample Data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {dashboardTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={{
                        ...task,
                        is_timer_running: activeTimerTaskId === task.id,
                      }}
                      onToggleTimer={handleToggleTimer}
                      onToggleComplete={handleToggleComplete}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={(t) => {
                        setTaskToEdit(t);
                        setIsAddTaskOpen(true);
                      }}
                      onAddManualTime={handleAddManualTime}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: 1-YEAR HISTORY ANALYTICS VIEW */}
        {currentTab === 'yearHistory' && (
          <YearHistoryView
            tasks={tasks}
            onSeedData={handleSeedData}
            onClearData={() => setTasks([])}
          />
        )}

        {/* TAB 3: DEVELOPER CODE & SQL GUIDE */}
        {currentTab === 'codeGuide' && <CodeGuideView />}

        {/* TAB 4: LANDING PAGE */}
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentTab('dashboard')}
            onSignIn={() => setIsAuthModalOpen(true)}
            onViewDemo={() => setCurrentTab('dashboard')}
          />
        )}

      </main>

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
