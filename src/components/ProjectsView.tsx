import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Users, 
  Calendar, 
  TrendingUp, 
  FolderPlus,
  Play,
  ArrowUpRight,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Planning';
  totalHoursSpent: number; // in hours
  estimatedHours: number; // in hours
  membersCount: number;
  membersAvatars: string[];
  dueDate: string;
  completedTasks: number;
  totalTasks: number;
}

interface ProjectsViewProps {
  tasks: Task[];
  onOpenAddTask: () => void;
  onToggleTimer: (taskId: string) => void;
  activeTimerTaskId: string | null;
  user: UserProfile;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  tasks,
  onOpenAddTask,
  onToggleTimer,
  activeTimerTaskId,
  user
}) => {
  // User-specific projects list
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => {
    try {
      if (user?.email) {
        const saved = localStorage.getItem(`flowtrack_projects_${user.email.toLowerCase().trim()}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Sync projects when user email changes
  React.useEffect(() => {
    if (!user?.email) {
      setProjectsList([]);
      return;
    }
    const key = `flowtrack_projects_${user.email.toLowerCase().trim()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProjectsList(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setProjectsList([]);
  }, [user?.email]);

  // Save projects per user email
  React.useEffect(() => {
    if (!user?.email) return;
    const key = `flowtrack_projects_${user.email.toLowerCase().trim()}`;
    try {
      localStorage.setItem(key, JSON.stringify(projectsList));
    } catch (e) {
      console.error(e);
    }
  }, [projectsList, user?.email]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Completed' | 'On Hold' | 'Planning'>('All');
  
  // New Project Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectCategory, setNewProjectCategory] = useState<string>('UI/UX Design');
  const [newProjectDesc, setNewProjectDesc] = useState<string>('');
  const [newProjectHours, setNewProjectHours] = useState<number>(30);
  const [newProjectDueDate, setNewProjectDueDate] = useState<string>('2024-06-30');

  // Filtered list calculation
  const filteredProjects = projectsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI summary calculations
  const totalProjectsCount = projectsList.length;
  const activeProjectsCount = projectsList.filter(p => p.status === 'In Progress').length;
  const totalHoursLogged = projectsList.reduce((acc, p) => acc + p.totalHoursSpent, 0);
  const avgCompletionRate = Math.round(
    projectsList.reduce((acc, p) => acc + (p.completedTasks / Math.max(1, p.totalTasks)) * 100, 0) / Math.max(1, projectsList.length)
  );

  // Add project handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const colors = ['bg-[#635BFF]', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-600', 'bg-rose-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      category: newProjectCategory,
      description: newProjectDesc.trim() || 'Custom project workflow in FlowTrack.',
      color: randomColor,
      status: 'In Progress',
      totalHoursSpent: 0,
      estimatedHours: Number(newProjectHours) || 30,
      membersCount: 1,
      membersAvatars: [user.avatar],
      dueDate: newProjectDueDate ? new Date(newProjectDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jun 30, 2024',
      completedTasks: 0,
      totalTasks: 5
    };

    setProjectsList([created, ...projectsList]);
    setIsCreateModalOpen(false);

    // Reset inputs
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectHours(30);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#635BFF] text-xs font-bold">
              {activeProjectsCount} Active
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track client deliverables, total logged hours, progress and team velocity.
          </p>
        </div>

        {/* Create Project Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-[#635BFF]/25 transition-all flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#635BFF]">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalProjectsCount}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +2 this month
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tracked Time
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalHoursLogged.toFixed(1)}h
            </span>
            <span className="text-xs text-slate-400 font-medium">total logged</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {avgCompletionRate}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">On Schedule</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Team Members
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              12
            </span>
            <span className="text-xs text-slate-400 font-medium">active contributors</span>
          </div>
        </div>

      </div>

      {/* 3. Search Bar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['All', 'In Progress', 'Completed', 'On Hold', 'Planning'] as const).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

      </div>

      {/* 4. Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const progressPercent = Math.min(100, Math.round((project.completedTasks / Math.max(1, project.totalTasks)) * 100));
          const timePercent = Math.min(100, Math.round((project.totalHoursSpent / Math.max(1, project.estimatedHours)) * 100));

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Row: Badge Color + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-lg ${project.color} shadow-xs`} />
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Status Tag */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      project.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : project.status === 'On Hold'
                        ? 'bg-amber-100 text-amber-800'
                        : project.status === 'Planning'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    ● {project.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#635BFF] transition-colors mb-1.5">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-5">
                  {project.description}
                </p>

                {/* Task Completion Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Tasks
                    </span>
                    <span className="font-mono text-slate-800 font-bold">
                      {project.completedTasks} / {project.totalTasks} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${project.color}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Time Logged Progress */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#635BFF]" />
                      Hours Logged
                    </span>
                    <span className="font-mono text-slate-800 font-bold">
                      {project.totalHoursSpent}h / {project.estimatedHours}h
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-800 h-1.5 rounded-full"
                      style={{ width: `${timePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Members, Due Date, Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                
                {/* Member Avatars Stack */}
                <div className="flex items-center -space-x-2">
                  {project.membersAvatars.map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt="Team member"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                  {project.membersCount > project.membersAvatars.length && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-white text-[10px] font-bold text-slate-600 flex items-center justify-center">
                      +{project.membersCount - project.membersAvatars.length}
                    </div>
                  )}
                </div>

                {/* Due Date & Action */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.dueDate}
                  </span>

                  <button
                    onClick={onOpenAddTask}
                    className="p-2 rounded-xl bg-purple-50 text-[#635BFF] hover:bg-[#635BFF] hover:text-white transition-all shadow-xs"
                    title="Add task to this project"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#635BFF] mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or status filter to see other projects.
          </p>
        </div>
      )}

      {/* 5. Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-[#635BFF]">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Create New Project</h3>
                  <p className="text-xs text-slate-500">Set up a new workspace for your tasks & hours.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              
              {/* Project Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. E-Commerce Store Redesign"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium"
                >
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Full-Stack Web">Full-Stack Web</option>
                  <option value="Frontend App">Frontend App</option>
                  <option value="Mobile Design">Mobile Design</option>
                  <option value="Client Work">Client Work</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief summary of project goals and scope..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium resize-none"
                />
              </div>

              {/* Budget Hours & Due Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProjectHours}
                    onChange={(e) => setNewProjectHours(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newProjectDueDate}
                    onChange={(e) => setNewProjectDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#635BFF] focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs font-bold shadow-md shadow-[#635BFF]/25 transition-all"
                >
                  Create Project
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
