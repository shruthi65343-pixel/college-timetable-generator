import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sliders
} from 'lucide-react';

export default function AlgorithmTracePlayer({ traceSteps = [] }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(400);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'BACKTRACK' | 'SUCCESS'

  const totalSteps = traceSteps.length;

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, speedMs]);

  if (!traceSteps || traceSteps.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Algorithm Trace Recorded Yet</h3>
        <p className="text-sm text-slate-400">Click "Generate Timetable" to record the step-by-step backtracking trace.</p>
      </div>
    );
  }

  const currentStep = traceSteps[currentStepIndex] || traceSteps[0];

  // Filter trace logs
  const filteredSteps = traceSteps.filter(s => {
    if (filterType === 'BACKTRACK') return s.type === 'BACKTRACK';
    if (filterType === 'SUCCESS') return s.type === 'SUCCESS_ASSIGNMENT';
    return true;
  });

  const getStepBadge = (type) => {
    switch (type) {
      case 'START':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">INIT</span>;
      case 'SELECT_NODE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">SELECT NODE</span>;
      case 'CONSTRAINT_FAIL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">CONFLICT</span>;
      case 'SUCCESS_ASSIGNMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">ASSIGNED</span>;
      case 'BACKTRACK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 animate-pulse">BACKTRACK</span>;
      case 'COMPLETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">SOLVED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-0">
      {/* Visualizer Player Toolbar */}
      <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Algorithm Trace & Backtracking Visualizer</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe how the solver makes greedy decisions, detects constraint collisions, and backtracks.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <button
            onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition shadow-md shadow-sky-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Slider */}
          <div className="flex items-center space-x-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="w-20 accent-sky-500 cursor-pointer"
            />
            <span className="w-10 font-mono text-[11px] text-slate-300">{speedMs}ms</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-200"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Active Step Inspector & Trace Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* Left Panel: Active Step Detail Card (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-slate-900 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Decision Step</span>
            {getStepBadge(currentStep.type)}
          </div>

          {/* Main Card Content */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            {currentStep.type === 'BACKTRACK' ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">BACKTRACK ALERT TRIGGERED!</h4>
                  <p className="text-xs text-amber-300/90 mt-0.5 leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Step #{currentStep.step}:</span>
                  <span className="text-sky-400">{currentStep.subjectName || currentStep.message || currentStep.type}</span>
                </h3>
                {currentStep.explanation && (
                  <p className="text-xs text-slate-300 mt-2 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
                    {currentStep.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Decision Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Target Session</span>
                <strong className="text-slate-200">{currentStep.subjectName || 'N/A'}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Student Batch</span>
                <strong className="text-slate-200">{currentStep.batchName || 'N/A'}</strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Assigned Time Slot</span>
                <strong className={currentStep.slotText ? 'text-emerald-400' : 'text-slate-400'}>
                  {currentStep.slotText || 'None'}
                </strong>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Assigned Room</span>
                <strong className={currentStep.roomCode ? 'text-emerald-400' : 'text-slate-400'}>
                  {currentStep.roomCode || 'None'}
                </strong>
              </div>
            </div>

            {/* Constraint Failure Reason if applicable */}
            {currentStep.reason && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
                <strong className="block text-rose-200 mb-0.5">Constraint Violation Reason:</strong>
                {currentStep.reason}
              </div>
            )}
          </div>

          {/* Quick Explanation Notes */}
          <div className="text-xs text-slate-400 space-y-1">
            <strong className="text-slate-300">Why Backtracking is essential:</strong>
            <p className="leading-relaxed">
              When greedy slot allocation hits a deadlock (no valid slot available without breaking hard constraints), the algorithm backtracks up the search tree, unassigning previous slots to find a globally valid schedule.
            </p>
          </div>
        </div>

        {/* Right Panel: Scrollable Trace Event History (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-950 space-y-3 flex flex-col h-[480px]">
          <div className="flex items-center justify-between shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Execution Log</h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  filterType === 'ALL' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({traceSteps.length})
              </button>
              <button
                onClick={() => setFilterType('BACKTRACK')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  filterType === 'BACKTRACK' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Backtracks ({traceSteps.filter(s => s.type === 'BACKTRACK').length})
              </button>
            </div>
          </div>

          {/* Log Table List */}
          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 font-mono text-xs">
            {filteredSteps.map((step, idx) => {
              const realIndex = traceSteps.indexOf(step);
              const isActive = realIndex === currentStepIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIndex(realIndex)}
                  className={`p-2.5 rounded-lg cursor-pointer border transition-all ${
                    isActive
                      ? 'bg-sky-500/10 border-sky-500/50 text-white font-semibold shadow-sm'
                      : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">#{step.step}</span>
                    {getStepBadge(step.type)}
                  </div>
                  <div className="text-slate-300 text-[11px] truncate mt-1">
                    {step.subjectName ? `${step.subjectName} (${step.batchName})` : step.message || step.type}
                  </div>
                  {step.slotText && (
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      → {step.slotText} {step.roomCode ? `[${step.roomCode}]` : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
