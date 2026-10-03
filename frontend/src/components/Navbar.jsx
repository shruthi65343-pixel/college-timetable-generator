import React from 'react';
import { Calendar, Cpu, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function Navbar({ onGenerate, isGenerating, stats }) {
  const hasConflicts = (stats?.facultyConflicts || 0) + (stats?.roomConflicts || 0) + (stats?.batchConflicts || 0) > 0;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <div className="relative">
            <Calendar className="w-5 h-5 text-white" />
            <Cpu className="w-3 h-3 text-sky-200 absolute -bottom-1 -right-1" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              SMART SCHEDULE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
              HACKATHON v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Conflict-Free Scheduling using Graph Coloring & Backtracking
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Term Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Semester: <strong className="text-white">Fall 2026</strong></span>
        </div>

        {/* Live Status Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
          hasConflicts 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {hasConflicts ? (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>
            {stats ? (hasConflicts ? 'Conflicts Detected' : '0 Conflicts (100% Valid)') : 'Algorithm Ready'}
          </span>
        </div>

        {/* Generate CTA Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-sky-500/25 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Solving...' : 'Generate Timetable'}</span>
        </button>
      </div>
    </header>
  );
}
