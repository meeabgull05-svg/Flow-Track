import React from 'react';
import { Clock, Calendar, ShieldCheck, Sparkles, Zap, CheckCircle2, ArrowRight, Play, BarChart3, Database, Layers } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onViewDemo,
}) => {
  return (
    <div className="space-y-20 py-8 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Gen Task & Time Tracking SaaS App</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Master Your Time. <br />
          <span className="text-indigo-400">
            Track 1-Year Productivity.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          FlowTrack combines live stopwatch time tracking, interactive task management, and a 365-day productivity history archive into one sleek dashboard.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all text-base"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onViewDemo}
            className="flex items-center gap-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 hover:border-slate-600 transition-all text-base"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-current" />
            <span>Try Live Interactive Demo</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Stopwatch Timer
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 365-Day Contribution Grid
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Clerk & Supabase Ready
          </span>
        </div>
      </section>

      {/* Product Mockup Preview */}
      <section className="relative max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        {/* Fake Browser Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-slate-500 font-mono">app.flowtrack.io/dashboard</span>
          <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">Live</span>
        </div>

        {/* Mock Preview Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400">ACTIVE TASK</span>
              <span className="text-xs text-emerald-400 font-mono animate-pulse">01:42:18 Running</span>
            </div>
            <h4 className="text-base font-bold text-white">Refactor Supabase RLS Policies & Indexes</h4>
            <div className="flex gap-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">API & Backend</span>
              <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded">High Priority</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-xs font-bold text-slate-400">1-YEAR STATS</span>
            <div className="text-2xl font-black text-white font-mono">1,420 hrs</div>
            <p className="text-xs text-emerald-400">365-Day Productivity Archive</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Live Active Timer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Start, pause, and log time for tasks in real-time. Background-resilient stopwatch keeps counting accurate seconds even when switching tabs.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1-Year History Matrix</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Visualize 365 days of logged output with a GitHub-style activity grid, time filters (Today, Week, Month, 1-Year), and CSV data export.
          </p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Full-Stack Tech Stack</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for Next.js App Router, Tailwind CSS, Clerk Auth, and Supabase PostgreSQL with complete ready-to-run migration scripts.
          </p>
        </div>
      </section>

      {/* Call to Action Footer Box */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Ready to supercharge your task & time management?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Start logging tasks and tracking 1-year productivity history today.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          <span>Launch FlowTrack App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
