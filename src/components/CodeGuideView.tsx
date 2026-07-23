import React, { useState } from 'react';
import { Code, Copy, Check, Database, FolderTree, Key, Terminal, Server, FileText } from 'lucide-react';

export const CodeGuideView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchema = `-- ========================================================
-- FLOWTRACK: SUPABASE POSTGRESQL SCHEMA FOR TASKS & TIME LOGS
-- ========================================================

-- 1. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    status VARCHAR(20) CHECK (status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
    time_spent_seconds BIGINT DEFAULT 0,
    estimated_seconds BIGINT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Create Time Logs Detail Table (For 1-Year Audit History)
CREATE TABLE IF NOT EXISTS public.time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance Indexes for Fast 1-Year Queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Isolate data per Clerk user_id)
CREATE POLICY "Users can manage their own tasks"
    ON public.tasks
    FOR ALL
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own time logs"
    ON public.time_logs
    FOR ALL
    USING (auth.jwt() ->> 'sub' = user_id);
`;

  const folderStructure = `flowtrack/
├── app/
│   ├── layout.tsx                # Root layout with ClerkProvider
│   ├── page.tsx                  # Public Landing Page
│   ├── (auth)/
│   │   ├── sign-in/page.tsx      # Clerk Sign-In route
│   │   └── sign-up/page.tsx      # Clerk Sign-Up route
│   └── dashboard/
│       ├── page.tsx              # Protected Dashboard Route
│       ├── year-history/page.tsx # 365-Day Productivity History View
│       └── api/
│           ├── tasks/route.ts    # Tasks CRUD API Route
│           └── timer/route.ts    # Live Stopwatch Sync Endpoint
├── components/
│   ├── Header.tsx                # Main Header & Navigation
│   ├── ActiveTimerBanner.tsx     # Floating Persistent Stopwatch
│   ├── TaskCard.tsx              # Interactive Task Card with Live Timer
│   ├── AddTaskModal.tsx          # Task creation modal
│   └── YearHistoryMatrix.tsx     # 52-week 365-day contribution heatmap
├── lib/
│   ├── supabaseClient.ts         # Supabase Client SDK initialization
│   ├── timeUtils.ts              # Stopwatch & 365-day formatters
│   └── types.ts                  # Shared TypeScript interfaces
├── middleware.ts                 # Clerk Authentication Route Protection
├── .env.local                    # Secrets & API Keys
└── package.json`;

  const dashboardCodeSnippet = `// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';
import { Task } from '@/lib/types';
import { TaskCard } from '@/components/TaskCard';

export default function DashboardPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);

  // Live Timer Interval Engine
  useEffect(() => {
    if (!activeTimerTaskId) return;

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === activeTimerTaskId
            ? { ...t, time_spent_seconds: t.time_spent_seconds + 1 }
            : t
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimerTaskId]);

  const toggleTimer = (taskId: string) => {
    setActiveTimerTaskId((current) => (current === taskId ? null : taskId));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">FlowTrack Task Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={{ ...task, is_timer_running: task.id === activeTimerTaskId }}
            onToggleTimer={toggleTimer}
          />
        ))}
      </div>
    </div>
  );
}`;

  const envSnippet = `# ========================================================
# FLOWTRACK ENVIRONMENT CONFIGURATION (.env.local)
# ========================================================

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Developer Blueprint & Setup Guide
            </h1>
            <p className="text-sm text-slate-400">
              Complete production architecture, Supabase SQL migration script, Next.js App Router folder structure, and environment setup.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Supabase SQL Schema */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">1. Supabase PostgreSQL SQL Schema</h2>
          </div>
          <button
            onClick={() => copyToClipboard(sqlSchema, 'sql')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            {copiedSection === 'sql' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
          </button>
        </div>
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
          {sqlSchema}
        </pre>
      </div>

      {/* Section 2: Next.js Folder Structure */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">2. Next.js App Router Folder Structure</h2>
          </div>
          <button
            onClick={() => copyToClipboard(folderStructure, 'structure')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
          >
            {copiedSection === 'structure' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === 'structure' ? 'Copied Tree!' : 'Copy Tree'}</span>
          </button>
        </div>
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
          {folderStructure}
        </pre>
      </div>

      {/* Section 3: React / Next.js Live Timer Component */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">3. Dashboard Component with Live Timer Logic</h2>
          </div>
          <button
            onClick={() => copyToClipboard(dashboardCodeSnippet, 'component')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
          >
            {copiedSection === 'component' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === 'component' ? 'Copied Code!' : 'Copy React Code'}</span>
          </button>
        </div>
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
          {dashboardCodeSnippet}
        </pre>
      </div>

      {/* Section 4: Environment Variables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">4. Environment Variables (.env.local)</h2>
          </div>
          <button
            onClick={() => copyToClipboard(envSnippet, 'env')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
          >
            {copiedSection === 'env' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === 'env' ? 'Copied .env!' : 'Copy .env'}</span>
          </button>
        </div>
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
          {envSnippet}
        </pre>
      </div>

    </div>
  );
};
