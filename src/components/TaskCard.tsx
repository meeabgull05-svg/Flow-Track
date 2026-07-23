import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, Circle, Clock, Trash2, Edit3, AlertCircle, Plus, Tag, Flame } from 'lucide-react';
import { Task, Priority } from '../types';
import { formatDuration, formatDurationCompact } from '../utils/timeUtils';

interface TaskCardProps {
  task: Task;
  onToggleTimer: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onAddManualTime: (taskId: string, secondsToAdd: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleTimer,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onAddManualTime,
}) => {
  const [showManualTimeInput, setShowManualTimeInput] = useState(false);
  const [manualMinutes, setManualMinutes] = useState('30');

  const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
    Low: { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
    Medium: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800/60' },
    High: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60' },
    Urgent: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-800' },
  };

  const isCompleted = task.status === 'Completed';
  const isRunning = task.is_timer_running;

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(manualMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onAddManualTime(task.id, mins * 60);
      setShowManualTimeInput(false);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        isRunning
          ? 'bg-slate-900 border-indigo-500/80 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
          : isCompleted
          ? 'bg-slate-900/60 border-slate-800/80 opacity-80 hover:opacity-100'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-md'
      }`}
    >
      {/* Top Accent bar if timer running */}
      {isRunning && (
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 animate-pulse" />
      )}

      <div className="p-4 sm:p-5">
        
        {/* Card Header: Checkbox, Title & Status Badges */}
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Complete Toggle Button */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none shrink-0"
              title={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
              ) : (
                <Circle className="w-5 h-5 hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base font-semibold tracking-tight transition-colors ${
                  isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                }`}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Badges: Category & Priority */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                  <Tag className="w-3 h-3" />
                  {task.category}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border}`}
                >
                  {task.priority === 'Urgent' && <Flame className="w-3 h-3 text-red-400" />}
                  {task.priority} Priority
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                      : isRunning
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? 'Completed' : isRunning ? 'In Progress' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons (Edit / Delete) */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditTask(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Timer Controls & Time Log Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Time Counter HH:MM:SS */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold ${
                isRunning
                  ? 'bg-indigo-950/80 text-emerald-300 border-indigo-500/50 shadow-inner'
                  : 'bg-slate-950/60 text-slate-200 border-slate-800'
              }`}
            >
              <Clock className={`w-4 h-4 ${isRunning ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
              <span>{formatDuration(task.time_spent_seconds)}</span>
            </div>

            {task.estimated_seconds && (
              <span className="text-xs text-slate-400 hidden sm:inline" title="Target estimated time">
                / {formatDurationCompact(task.estimated_seconds)} target
              </span>
            )}
          </div>

          {/* Stopwatch Controls (Start/Pause/Resume & +Time) */}
          <div className="flex items-center gap-2">
            
            {/* Quick manual time buttons */}
            {!showManualTimeInput ? (
              <button
                onClick={() => setShowManualTimeInput(true)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                title="Add manual time log"
              >
                + Log Time
              </button>
            ) : (
              <form onSubmit={handleManualAddSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  className="w-14 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="mins"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-500"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualTimeInput(false)}
                  className="px-1.5 py-1 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </form>
            )}

            {/* Main Stopwatch Start/Pause Button */}
            <button
              onClick={() => onToggleTimer(task.id)}
              disabled={isCompleted}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all ${
                isCompleted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Start Timer</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
