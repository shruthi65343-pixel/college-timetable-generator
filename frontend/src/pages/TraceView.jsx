import React from 'react';
import AlgorithmTracePlayer from '../components/AlgorithmTracePlayer';

export default function TraceView({ traceSteps }) {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Algorithm Trace & Backtracking Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Step-by-step playback engine showing greedy slot selection, constraint validation, and backtracking stack frames.
        </p>
      </div>

      <AlgorithmTracePlayer traceSteps={traceSteps} />
    </div>
  );
}
