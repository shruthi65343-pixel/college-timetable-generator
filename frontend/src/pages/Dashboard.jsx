import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Users, 
  BookOpen, 
  DoorOpen, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  GitBranch, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TimetableGrid from '../components/TimetableGrid';

export default function Dashboard({ dataset, onGenerate, onLoadDemoData, stats, timetable, onNavigate }) {
  const { batches = [], subjects = [], faculty = [], rooms = [], timeSlots = [] } = dataset;

  const facultyConflicts = stats?.facultyConflicts ?? 0;
  const roomConflicts = stats?.roomConflicts ?? 0;
  const batchConflicts = stats?.batchConflicts ?? 0;
  const totalConflicts = facultyConflicts + roomConflicts + batchConflicts;

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Demo Dataset Active
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Graph Coloring & Backtracking Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Smart Timetable Generator
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Generate conflict-free schedules while coordinating student batches, faculty, rooms and available time slots.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadDemoData}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Load Demo Data</span>
          </button>
          <button
            onClick={onGenerate}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate Timetable</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Dataset Summary (Demo Dataset)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Student Batches"
            value={batches.length}
            icon={GraduationCap}
            badge="Batches"
            subtext={`${batches.reduce((acc, b) => acc + (b.studentCount || 0), 0)} Total Students`}
            color="sky"
          />
          <StatCard
            title="Subjects"
            value={subjects.length}
            icon={BookOpen}
            badge="Courses"
            subtext={`${subjects.reduce((acc, s) => acc + (s.sessionsPerWeek || 0), 0)} Weekly Sessions`}
            color="emerald"
          />
          <StatCard
            title="Faculty"
            value={faculty.length}
            icon={Users}
            badge="Professors"
            subtext="Available Mon-Fri"
            color="purple"
          />
          <StatCard
            title="Rooms"
            value={rooms.length}
            icon={DoorOpen}
            badge="Halls & Labs"
            subtext="Halls & Laboratories"
            color="indigo"
          />
          <StatCard
            title="Time Slots"
            value={timeSlots.length}
            icon={Clock}
            badge="30 Slots"
            subtext="6 Slots / Day (Mon-Fri)"
            color="amber"
          />
        </div>
      </div>

      {/* Main Scheduling Status Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>Scheduling Status Monitor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time conflict analysis updated directly from the algorithm output.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
              totalConflicts === 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
            }`}>
              {totalConflicts === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Conflict-Free Schedule</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>{totalConflicts} Active Conflicts</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Live Conflict Counter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Faculty Conflicts</span>
              <div className="text-3xl font-extrabold text-white mt-1">{facultyConflicts}</div>
              <span className="text-[11px] text-slate-500">No double-booked faculty</span>
            </div>
            <div className={`p-3 rounded-xl border ${facultyConflicts === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Room Conflicts</span>
              <div className="text-3xl font-extrabold text-white mt-1">{roomConflicts}</div>
              <span className="text-[11px] text-slate-500">No overlapping room bookings</span>
            </div>
            <div className={`p-3 rounded-xl border ${roomConflicts === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <DoorOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Student-Batch Conflicts</span>
              <div className="text-3xl font-extrabold text-white mt-1">{batchConflicts}</div>
              <span className="text-[11px] text-slate-500">No overlapping batch lectures</span>
            </div>
            <div className={`p-3 rounded-xl border ${batchConflicts === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Algorithm Metrics Bar */}
        {stats && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              <span>Scheduled Sessions:</span> <strong className="text-white ml-1">{stats.scheduledSessions} / {stats.totalSessions}</strong>
            </div>
            <div>
              <span>Chromatic Number:</span> <strong className="text-sky-400 ml-1">{stats.chromaticNumber} Distinct Slots</strong>
            </div>
            <div>
              <span>Backtracks Triggered:</span> <strong className="text-amber-400 ml-1">{stats.backtrackCount}</strong>
            </div>
            <div>
              <span>Solver Execution Time:</span> <strong className="text-emerald-400 ml-1">{stats.executionTimeMs} ms</strong>
            </div>
          </div>
        )}
      </div>

      {/* Algorithmic Pipeline Visual Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span>Algorithmic Solver Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center">
          {[
            { step: '1', title: 'Input Data', desc: 'Subjects, Faculty, Rooms, Slots' },
            { step: '2', title: 'Build Graph', desc: 'Vertices & Constraint Edges' },
            { step: '3', title: 'Graph Coloring', desc: 'DSatur Node Ordering' },
            { step: '4', title: 'Greedy Assign', desc: 'Try Slot & Room' },
            { step: '5', title: 'Constraint Check', desc: 'Faculty/Batch/Room Free?' },
            { step: '6', title: 'Backtrack', desc: 'Undo on Deadlock' },
            { step: '7', title: 'Final Valid', desc: '0-Conflict Schedule' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-sky-500/40 transition">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  {item.step}
                </div>
                <div className="text-xs font-bold text-white">{item.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
              </div>
              {idx < 6 && (
                <div className="hidden md:flex justify-center text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Interactive Timetable Grid Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Generated Schedule Preview</h2>
          <button
            onClick={() => onNavigate('generator')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
          >
            <span>Edit Input Data & Constraints →</span>
          </button>
        </div>
        <TimetableGrid timetable={timetable} dataset={dataset} />
      </div>
    </div>
  );
}
