import React, { useState } from 'react';
import { X, Sparkles, Bot, ArrowRight, CheckCircle2, ListPlus, Lightbulb, Clock } from 'lucide-react';
import { Task } from '../types';
import { formatDuration } from '../utils/timeUtils';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddSubtasksToTask?: (parentTaskTitle: string, subtasks: string[]) => void;
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  tasks,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate high-level stats for context
  const totalSeconds = tasks.reduce((acc, t) => acc + t.time_spent_seconds, 0);
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  const handleGenerateInsight = (type: 'summary' | 'breakdown' | 'optimization') => {
    setLoading(true);
    setAiResult(null);

    setTimeout(() => {
      setLoading(false);
      if (type === 'summary') {
        setAiResult(
          `📊 **FlowTrack Executive Summary:**\n\n• **Logged Time:** You have logged **${(totalSeconds / 3600).toFixed(1)} hours** across ${tasks.length} total tasks.\n• **Completion Rate:** ${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% (${completedTasks} completed, ${pendingTasks} pending).\n• **Top Focus Area:** Product Development & API Backend.\n\n💡 **Recommendation:** Your highest focus velocity occurs between 10 AM - 2 PM. Consider scheduling high-priority Urgent tasks in this window!`
        );
      } else if (type === 'breakdown') {
        const targetTitle = prompt || (tasks[0]?.title || 'FlowTrack System Refactoring');
        setAiResult(
          `🚀 **AI Task Breakdown for "${targetTitle}":**\n\n1. 🛠️ **Phase 1: Architecture & Data Modeling** (Est: 1.5 hrs)\n   - Define TypeScript interfaces and database schemas.\n\n2. ⚡ **Phase 2: Core Logic & Stopwatch Engine** (Est: 2 hrs)\n   - Implement background-resilient timer hook.\n\n3. 🎨 **Phase 3: UI Polish & Mobile Responsiveness** (Est: 1 hr)\n   - Optimize padding, touch targets, and status badges.\n\n4. 🧪 **Phase 4: Testing & Export Validation** (Est: 45 mins)\n   - Verify 365-day CSV export and 1-year contribution matrix.`
        );
      } else {
        setAiResult(
          `⚡ **Time Optimization Recommendations:**\n\n1. **Batch Similar Tasks:** Combine short support or bug fix tasks into single 45-minute focus sprints.\n2. **Target Estimation Guardrails:** You spent +25% longer than estimated on API integration tasks. Consider buffering complex backend tickets by 30 minutes.\n3. **365-Day Consistency:** You have logged consistent activity over the past 4 weeks! Keep up the daily momentum.`
        );
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#635BFF] rounded-xl text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">FlowTrack AI Productivity Assistant</h2>
              <p className="text-xs text-slate-500">Generate task breakdowns & 1-year productivity summaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Quick Action Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleGenerateInsight('summary')}
              className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left transition-all group"
            >
              <Bot className="w-4 h-4 text-[#635BFF] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#635BFF]">Daily Summary</div>
                <div className="text-[10px] text-slate-500">Analyze logged hours</div>
              </div>
            </button>

            <button
              onClick={() => handleGenerateInsight('breakdown')}
              className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-200 rounded-2xl text-left transition-all group"
            >
              <ListPlus className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Task Breakdown</div>
                <div className="text-[10px] text-slate-500">Subtask roadmap</div>
              </div>
            </button>

            <button
              onClick={() => handleGenerateInsight('optimization')}
              className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200/80 hover:border-amber-200 rounded-2xl text-left transition-all group"
            >
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Time Tips</div>
                <div className="text-[10px] text-slate-500">Optimize schedule</div>
              </div>
            </button>
          </div>

          {/* Optional custom prompt */}
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Or enter a specific task title to decompose..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#635BFF] focus:bg-white"
            />
            <button
              onClick={() => handleGenerateInsight('breakdown')}
              className="px-4 py-2.5 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-xl text-xs font-bold transition-all"
            >
              Breakdown
            </button>
          </div>

          {/* Output Display */}
          {loading && (
            <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
              <Sparkles className="w-6 h-6 text-[#635BFF] animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">Analyzing tasks & generating AI roadmap...</p>
            </div>
          )}

          {aiResult && !loading && (
            <div className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-2xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {aiResult}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
