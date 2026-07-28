import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Zap, 
  X, 
  MoreHorizontal, 
  ChevronRight, 
  CheckSquare, 
  Circle, 
  AlertCircle,
  Flag,
  Award
} from 'lucide-react';
import { Task, UserProfile } from '../types';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalItem {
  id: string;
  title: string;
  category: 'Work & Projects' | 'Skill Learning' | 'Productivity' | 'Health & Focus';
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string; // e.g. 'hrs', 'tasks', 'courses', 'days'
  deadline: string;
  color: string;
  status: 'In Progress' | 'Achieved' | 'Behind';
  streakDays: number;
  milestones: Milestone[];
}

interface GoalsViewProps {
  tasks: Task[];
  user: UserProfile;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ tasks, user }) => {
  // Initial Sample Goals List
  const [goalsList, setGoalsList] = useState<GoalItem[]>([
    {
      id: 'goal_1',
      title: 'Complete 35 Hours of Deep Work',
      category: 'Work & Projects',
      description: 'Focus solely on high-value development and client architecture tasks with zero distractions.',
      currentValue: 28,
      targetValue: 35,
      unit: 'hrs',
      deadline: 'This Week',
      color: 'bg-[#635BFF]',
      status: 'In Progress',
      streakDays: 14,
      milestones: [
        { id: 'm1', title: 'Finish FlowTrack dashboard overhaul', completed: true },
        { id: 'm2', title: 'Complete WeVersity API integration', completed: true },
        { id: 'm3', title: 'Log 7+ hours for 5 consecutive days', completed: false },
      ]
    },
    {
      id: 'goal_2',
      title: 'Master React Server Components & Next 15',
      category: 'Skill Learning',
      description: 'Study advanced React performance patterns, server actions, and caching strategies.',
      currentValue: 8,
      targetValue: 10,
      unit: 'modules',
      deadline: 'Jun 30, 2024',
      color: 'bg-emerald-500',
      status: 'In Progress',
      streakDays: 9,
      milestones: [
        { id: 'm4', title: 'Complete official Next.js documentation course', completed: true },
        { id: 'm5', title: 'Build demo server actions project', completed: true },
        { id: 'm6', title: 'Write technical summary blog post', completed: false },
      ]
    },
    {
      id: 'goal_3',
      title: 'Maintain 90%+ On-Time Task Completion Rate',
      category: 'Productivity',
      description: 'Deliver all assigned project tickets before deadline with high accuracy.',
      currentValue: 92,
      targetValue: 90,
      unit: '%',
      deadline: 'End of Month',
      color: 'bg-blue-500',
      status: 'Achieved',
      streakDays: 21,
      milestones: [
        { id: 'm7', title: 'Zero overdue tasks for 2 weeks', completed: true },
        { id: 'm8', title: 'Clear backlog tasks', completed: true },
      ]
    },
    {
      id: 'goal_4',
      title: 'Daily 30-Minute Focused Morning Sprints',
      category: 'Health & Focus',
      description: 'Start every workday at 9:00 AM with 30 minutes of clear priority planning.',
      currentValue: 18,
      targetValue: 22,
      unit: 'days',
      deadline: 'This Month',
      color: 'bg-amber-500',
      status: 'In Progress',
      streakDays: 18,
      milestones: [
        { id: 'm9', title: 'No phone checking during first 30 mins', completed: true },
        { id: 'm10', title: 'Maintain streak through Friday', completed: false },
      ]
    }
  ]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<GoalItem['category']>('Work & Projects');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newTargetValue, setNewTargetValue] = useState<number>(40);
  const [newUnit, setNewUnit] = useState<string>('hrs');
  const [newDeadline, setNewDeadline] = useState<string>('Next Month');

  // Filter calculation
  const filteredGoals = goalsList.filter(g => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory;
  });

  // Toggle milestone handler
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoalsList(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map(m => {
        if (m.id === milestoneId) return { ...m, completed: !m.completed };
        return m;
      });
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const totalCount = updatedMilestones.length || 1;
      const newProgressValue = Math.round((completedCount / totalCount) * goal.targetValue);

      return {
        ...goal,
        milestones: updatedMilestones,
        currentValue: Math.min(goal.targetValue, newProgressValue),
        status: newProgressValue >= goal.targetValue ? 'Achieved' : 'In Progress'
      };
    }));
  };

  // Quick Increment Progress Handler
  const handleIncrementProgress = (goalId: string) => {
    setGoalsList(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const newValue = Math.min(g.targetValue, g.currentValue + 1);
      return {
        ...g,
        currentValue: newValue,
        status: newValue >= g.targetValue ? 'Achieved' : 'In Progress'
      };
    }));
  };

  // Create Goal Submission
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ['bg-[#635BFF]', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-600'];
    const created: GoalItem = {
      id: `goal_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Custom goal target set in FlowTrack.',
      currentValue: 0,
      targetValue: Number(newTargetValue) || 10,
      unit: newUnit.trim() || 'target',
      deadline: newDeadline,
      color: colors[Math.floor(Math.random() * colors.length)],
      status: 'In Progress',
      streakDays: 1,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Initial setup & kickoff', completed: false },
        { id: `m_${Date.now()}_2`, title: 'Reach 50% target milestone', completed: false },
        { id: `m_${Date.now()}_3`, title: 'Final goal review', completed: false },
      ]
    };

    setGoalsList([created, ...goalsList]);
    setIsModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewTargetValue(40);
  };

  // Summary Metrics
  const achievedGoalsCount = goalsList.filter(g => g.status === 'Achieved').length;
  const avgProgressPercent = Math.round(
    goalsList.reduce((acc, g) => acc + (g.currentValue / Math.max(1, g.targetValue)) * 100, 0) / Math.max(1, goalsList.length)
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Goals & Objectives
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 14 Day Streak
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Set ambitious targets, track key milestones, and maintain high productivity velocity.
          </p>
        </div>

        {/* New Goal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#635BFF]/25 transition-all flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* 2. KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Goals
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-[#635BFF]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {goalsList.length}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2 Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            {achievedGoalsCount} objectives completed
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Progress
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {avgProgressPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              On Schedule
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Across active objectives
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Streak
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              14 Days
            </span>
            <span className="text-xs text-amber-600 font-bold">
              🔥 Personal Best
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Daily goal logs maintained
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Badges Earned
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              8
            </span>
            <span className="text-xs text-blue-600 font-bold">
              Level 4 Achiever
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Next unlock at 10 goals
          </p>
        </div>

      </div>

      {/* 3. Category Filter Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {(['All', 'Work & Projects', 'Skill Learning', 'Productivity', 'Health & Focus'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.currentValue / Math.max(1, goal.targetValue)) * 100));

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* Top Row: Category + Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-lg ${goal.color}`} />
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      {goal.category}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                      goal.status === 'Achieved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : goal.status === 'Behind'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    ● {goal.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#635BFF] transition-colors mb-1">
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {goal.description}
                </p>

                {/* Progress Metric & Bar */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-700">Target Progress</span>
                    <span className="font-mono text-slate-900">
                      {goal.currentValue} / {goal.targetValue} {goal.unit} ({progressPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${goal.color} transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Key Milestones Checklist */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Key Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                  </span>

                  <div className="space-y-1.5">
                    {goal.milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors text-xs font-medium"
                      >
                        {milestone.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className={milestone.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                          {milestone.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                
                {/* Deadline & Streak */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {goal.deadline}
                  </span>

                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {goal.streakDays}d streak
                  </span>
                </div>

                {/* Quick Increment Progress Button */}
                <button
                  onClick={() => handleIncrementProgress(goal.id)}
                  disabled={goal.currentValue >= goal.targetValue}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-[#635BFF] text-[#635BFF] hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 {goal.unit}</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* 5. Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-[#635BFF]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Set New Objective</h3>
                  <p className="text-xs text-slate-500">Define measurable metrics and target deadlines.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateGoal} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete 40 Hours of Client Coding"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GoalItem['category'])}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium"
                >
                  <option value="Work & Projects">Work & Projects</option>
                  <option value="Skill Learning">Skill Learning</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Health & Focus">Health & Focus</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe why this objective matters..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium resize-none"
                />
              </div>

              {/* Target & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Metric Value
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unit (hrs, tasks, %)
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="hrs"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Target Deadline
                </label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="e.g. End of Quarter / Next Sunday"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs font-bold shadow-md shadow-[#635BFF]/25 transition-all"
                >
                  Save Objective
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
